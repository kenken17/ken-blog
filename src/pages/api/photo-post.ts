import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

interface SavedImage {
  url: string;
  alt: string;
  caption?: string;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'photo-post';
}

function sanitizeFilename(input: string): string {
  return input.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');
}

function yamlSafe(value: string): string {
  return value.replace(/"/g, '\\"');
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
    const imageFiles = formData.getAll('images').filter((entry): entry is File => entry instanceof File);

    if (!title || !description) {
      return new Response(JSON.stringify({ error: 'Missing required fields: title and description' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (imageFiles.length === 0) {
      return new Response(JSON.stringify({ error: 'At least one image is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const slug = slugify(title);
    const datePrefix = new Date().toISOString().slice(0, 10);

    const imagesDir = path.resolve(process.cwd(), 'public', 'images', 'posts');
    const postsDir = path.resolve(process.cwd(), 'src', 'content', 'posts');

    fs.mkdirSync(imagesDir, { recursive: true });
    fs.mkdirSync(postsDir, { recursive: true });

    const savedImages: SavedImage[] = [];

    for (const [index, file] of imageFiles.entries()) {
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return new Response(JSON.stringify({ error: `Unsupported image type: ${file.type || 'unknown'}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return new Response(JSON.stringify({ error: `${file.name} exceeds 10MB limit` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const safeOriginal = sanitizeFilename(file.name || `image-${index + 1}`);
      const extension = path.extname(safeOriginal) || '.jpg';
      const basename = path.basename(safeOriginal, extension) || `image-${index + 1}`;
      const imageFileName = `${datePrefix}-${slug}-${index + 1}-${basename}${extension}`;
      const destinationPath = path.join(imagesDir, imageFileName);

      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(destinationPath, buffer);

      const captionValue = String(formData.get(`caption_${index}`) ?? '').trim();
      savedImages.push({
        url: `/images/posts/${imageFileName}`,
        alt: `${title} photo ${index + 1}`,
        caption: captionValue || undefined,
      });
    }

    const imageYaml = savedImages
      .map((image) => {
        const lines = [
          `  - url: "${yamlSafe(image.url)}"`,
          `    alt: "${yamlSafe(image.alt)}"`,
        ];

        if (image.caption) {
          lines.push(`    caption: "${yamlSafe(image.caption)}"`);
        }

        return lines.join('\n');
      })
      .join('\n');

    const markdown = `---\ntitle: "${yamlSafe(title)}"\ndescription: "${yamlSafe(description)}"\npubDate: ${datePrefix}\npostType: photo\ndraft: true\ntags: [\"photo\"]\nimages:\n${imageYaml}\n---\n\n${description}\n`;

    const postFilename = `${datePrefix}-${slug}.md`;
    const postPath = path.join(postsDir, postFilename);
    fs.writeFileSync(postPath, markdown, 'utf-8');

    return new Response(
      JSON.stringify({
        success: true,
        slug: postFilename.replace(/\.md$/, ''),
        imagesSaved: savedImages.length,
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
