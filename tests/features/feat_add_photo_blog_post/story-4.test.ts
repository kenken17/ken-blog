import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const slugPagePath = path.resolve(process.cwd(), 'src/pages/blog/[slug].astro');

describe('Story 4: Photo blog post page', () => {
  let pageSource: string;

  beforeAll(() => {
    pageSource = fs.readFileSync(slugPagePath, 'utf-8');
  });

  it('page file exists', () => {
    expect(fs.existsSync(slugPagePath)).toBe(true);
  });

  it('imports PhotoGallery component', () => {
    expect(pageSource).toContain("import PhotoGallery from '../../components/PhotoGallery.astro'");
  });

  it('imports isPhotoPost utility', () => {
    expect(pageSource).toContain("import { getPhotoImages, getPhotoThumbnail, isPhotoPost } from '../../utils/posts'");
  });

  it('detects photo posts using isPhotoPost', () => {
    expect(pageSource).toContain('const photoPost = isPhotoPost(post)');
  });

  it('gets photo images using getPhotoImages', () => {
    expect(pageSource).toContain('const photoImages = getPhotoImages(post)');
  });

  it('gets photo thumbnail using getPhotoThumbnail', () => {
    expect(pageSource).toContain('const photoThumbnail = getPhotoThumbnail(post)');
  });

  it('conditionally renders PhotoGallery for photo posts', () => {
    expect(pageSource).toContain('{photoPost ?');
    expect(pageSource).toContain('<PhotoGallery images={photoImages} />');
  });

  it('renders standard Content for regular posts', () => {
    expect(pageSource).toContain('<Content components={{ pre: CodeBlock }} />');
  });

  it('displays title for all posts', () => {
    expect(pageSource).toContain('{post.data.title}');
  });

  it('displays description for all posts', () => {
    expect(pageSource).toContain('{post.data.description}');
  });

  it('shows "Photo Post" indicator for photo posts', () => {
    expect(pageSource).toContain('Photo Post');
    expect(pageSource).toContain('{photoPost && (');
  });

  it('renders reading time for all posts', () => {
    expect(pageSource).toContain('{readingTime} min read');
  });

  it('includes back to blog link', () => {
    expect(pageSource).toContain('← Back to all posts');
    expect(pageSource).toContain('href="/blog"');
  });

  it('includes previous/next post navigation', () => {
    expect(pageSource).toContain('aria-label="Post navigation"');
    expect(pageSource).toContain('Newer:');
    expect(pageSource).toContain('Older:');
  });

  it('generates SEO metadata for all posts', () => {
    expect(pageSource).toContain('generateJsonLd');
    expect(pageSource).toContain("canonicalPath: `/blog/${post.id}`");
  });

  it('generates ImageGallery JSON-LD for photo posts', () => {
    expect(pageSource).toContain("'ImageGallery'");
  });

  it('includes og:image from photo thumbnail for photo posts', () => {
    expect(pageSource).toContain('ogImage={photoThumbnail?.url}');
  });

  it('uses BaseLayout with title and description', () => {
    expect(pageSource).toContain('<BaseLayout');
    expect(pageSource).toContain('title=');
    expect(pageSource).toContain('description=');
  });

  it('includes SEO meta tags generation', () => {
    expect(pageSource).toContain('jsonLd={jsonLd}');
    expect(pageSource).toContain('ogType="article"');
  });
});
