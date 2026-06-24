import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const apiPath = path.resolve(process.cwd(), 'src/pages/api/photo-post.ts');

describe('Story 3: Photo post API endpoint', () => {
  let apiSource: string;

  beforeAll(() => {
    apiSource = fs.readFileSync(apiPath, 'utf-8');
  });

  it('API endpoint file exists', () => {
    expect(fs.existsSync(apiPath)).toBe(true);
  });

  it('exports a POST handler', () => {
    expect(apiSource).toContain('export const POST: APIRoute');
  });

  it('blocks requests in production mode', () => {
    expect(apiSource).toContain('import.meta.env.PROD');
    expect(apiSource).toContain('status: 403');
  });

  it('parses form data from the request', () => {
    expect(apiSource).toContain('request.formData()');
  });

  it('validates title is required', () => {
    expect(apiSource).toContain('Missing required fields: title and description');
    expect(apiSource).toContain('status: 400');
  });

  it('validates description is required', () => {
    expect(apiSource).toContain("String(formData.get('description')");
  });

  it('requires at least one image', () => {
    expect(apiSource).toContain('At least one image is required');
  });

  it('validates image MIME types', () => {
    expect(apiSource).toContain('ALLOWED_MIME_TYPES');
    expect(apiSource).toContain("'image/jpeg'");
    expect(apiSource).toContain("'image/png'");
    expect(apiSource).toContain("'image/webp'");
    expect(apiSource).toContain("'image/gif'");
  });

  it('validates file size with 10MB limit', () => {
    expect(apiSource).toContain('MAX_FILE_SIZE_BYTES');
    expect(apiSource).toContain('10 * 1024 * 1024');
  });

  it('generates a slug from the title', () => {
    expect(apiSource).toContain('function slugify');
    expect(apiSource).toContain('slugify(title)');
  });

  it('saves images to public/images/posts/', () => {
    expect(apiSource).toContain("path.resolve(process.cwd(), 'public', 'images', 'posts')");
  });

  it('creates markdown in src/content/posts/', () => {
    expect(apiSource).toContain("path.resolve(process.cwd(), 'src', 'content', 'posts')");
  });

  it('creates directories if they do not exist', () => {
    expect(apiSource).toContain('fs.mkdirSync');
    expect(apiSource).toContain('recursive: true');
  });

  it('writes image buffer to disk', () => {
    expect(apiSource).toContain('Buffer.from(await file.arrayBuffer())');
    expect(apiSource).toContain('fs.writeFileSync');
  });

  it('generates markdown with YAML frontmatter', () => {
    expect(apiSource).toContain('---\\n');
    expect(apiSource).toContain('postType: photo');
    expect(apiSource).toContain('draft: true');
  });

  it('includes image metadata in frontmatter', () => {
    expect(apiSource).toContain('images:');
    expect(apiSource).toContain('url:');
    expect(apiSource).toContain('alt:');
  });

  it('returns success with slug and image count', () => {
    expect(apiSource).toContain('success: true');
    expect(apiSource).toContain('slug:');
    expect(apiSource).toContain('imagesSaved:');
  });

  it('returns error response on failure', () => {
    expect(apiSource).toContain('catch (error)');
    expect(apiSource).toContain('status: 500');
  });

  it('returns unsupported image type error for invalid MIME types', () => {
    expect(apiSource).toContain('Unsupported image type');
  });

  it('returns file size exceeded error', () => {
    expect(apiSource).toContain('exceeds 10MB limit');
  });

  it('sanitizes filenames', () => {
    expect(apiSource).toContain('function sanitizeFilename');
    expect(apiSource).toContain('sanitizeFilename');
  });

  it('uses yamlSafe to escape double quotes in markdown', () => {
    expect(apiSource).toContain('function yamlSafe');
    expect(apiSource).toContain('yamlSafe(title)');
  });

  it('reads caption from form data', () => {
    expect(apiSource).toContain("formData.get(`caption_${index}`)");
  });

  it('returns Unsupported media type error for non-image files', () => {
    expect(apiSource).toContain("'image/jpeg'");
    expect(apiSource).toContain("'image/png'");
    expect(apiSource).toContain("'image/webp'");
    expect(apiSource).toContain("'image/gif'");
  });
});
