import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB
const ALLOWED_MIME_TYPES = new Set(['video/mp4', 'video/webm']);

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'video-post';
}

function sanitizeFilename(input: string): string {
  return input.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');
}

function yamlSafe(value: string): string {
  return value.replace(/"/g, '\\"');
}

function validateEmbedUrl(url: string): boolean {
  // Simple YouTube/Vimeo URL validation
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  return !!(youtubeMatch || vimeoMatch);
}

export const POST: APIRoute = async ({ request }) => {
  if (import.meta.env.PROD) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await request.formData();

    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const caption = String(formData.get('caption') ?? '').trim();
    const type = String(formData.get('type') ?? '').trim(); // 'upload' or 'embed'
    const autoplay = String(formData.get('autoplay') ?? '') === 'true';
    const loop = String(formData.get('loop') ?? '') === 'true';
    const controls = String(formData.get('controls') ?? '') === 'true';

    if (!title || !description) {
      return new Response(JSON.stringify({ error: 'Missing required fields: title and description' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (type !== 'upload' && type !== 'embed') {
      return new Response(JSON.stringify({ error: 'Invalid video type. Must be "upload" or "embed"' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const slug = slugify(title);
    const datePrefix = new Date().toISOString().slice(0, 10);
    const postsDir = path.resolve(process.cwd(), 'src', 'content', 'posts');
    fs.mkdirSync(postsDir, { recursive: true });

    let videoUrl = '';

    if (type === 'upload') {
      const videoFile = formData.get('video') as File | null;
      
      if (!videoFile || !(videoFile instanceof File)) {
        return new Response(JSON.stringify({ error: 'Video file is required for upload type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (!ALLOWED_MIME_TYPES.has(videoFile.type)) {
        return new Response(JSON.stringify({ error: `Unsupported video type: ${videoFile.type || 'unknown'}. Use MP4 or WebM.` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (videoFile.size > MAX_FILE_SIZE_BYTES) {
        return new Response(JSON.stringify({ error: `${videoFile.name} exceeds 100MB limit` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Save video file
      const videosDir = path.resolve(process.cwd(), 'public', 'videos', 'posts');
      fs.mkdirSync(videosDir, { recursive: true });

      const safeOriginal = sanitizeFilename(videoFile.name || 'video');
      const extension = path.extname(safeOriginal) || '.mp4';
      const basename = path.basename(safeOriginal, extension) || 'video';
      const videoFileName = `${datePrefix}-${slug}-${basename}${extension}`;
      const destinationPath = path.join(videosDir, videoFileName);

      const buffer = Buffer.from(await videoFile.arrayBuffer());
      fs.writeFileSync(destinationPath, buffer);

      videoUrl = `/videos/posts/${videoFileName}`;
      
    } else if (type === 'embed') {
      const embedUrl = String(formData.get('embedUrl') ?? '').trim();
      
      if (!embedUrl) {
        return new Response(JSON.stringify({ error: 'Embed URL is required for embed type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (!validateEmbedUrl(embedUrl)) {
        return new Response(JSON.stringify({ error: 'Invalid embed URL. Please use a YouTube or Vimeo URL.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      videoUrl = embedUrl;
    }

    // Build video frontmatter
    const videoYaml = [
      `video:`,
      `  type: "${type}"`,
      `  url: "${yamlSafe(videoUrl)}"`,
      `  autoplay: ${autoplay}`,
      `  loop: ${loop}`,
      `  controls: ${controls}`,
    ];

    if (caption) {
      videoYaml.push(`  caption: "${yamlSafe(caption)}"`);
    }

    const videoYamlString = videoYaml.join('\n');

    const markdown = `---
title: "${yamlSafe(title)}"
description: "${yamlSafe(description)}"
pubDate: ${datePrefix}
postType: video
draft: true
tags: ["video"]
${videoYamlString}
---

${description}
`;

    const postFilename = `${datePrefix}-${slug}.md`;
    const postPath = path.join(postsDir, postFilename);
    fs.writeFileSync(postPath, markdown, 'utf-8');

    return new Response(
      JSON.stringify({
        success: true,
        slug: postFilename.replace(/\.md$/, ''),
        type,
        videoUrl,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};