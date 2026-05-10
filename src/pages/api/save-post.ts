import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const POST: APIRoute = async ({ request }) => {
  if (import.meta.env.PROD) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { filename, content } = await request.json();

    if (!filename || !content) {
      return new Response(JSON.stringify({ error: 'Missing filename or content' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const safeFilename = filename.replace(/[^a-z0-9.-]/gi, '-').replace(/-+/g, '-');
    if (!safeFilename.endsWith('.md')) {
      return new Response(JSON.stringify({ error: 'File must be .md' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const postsDir = path.resolve(process.cwd(), 'src', 'content', 'posts');
    const filePath = path.join(postsDir, safeFilename);

    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, 'utf-8');

    return new Response(JSON.stringify({ success: true, filename: safeFilename }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
