import { describe, it, expect } from 'vitest';
import { transform } from '@astrojs/compiler';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(
  process.cwd(),
  'src/components/PhotoGallery.astro',
);

async function compileComponent() {
  const source = fs.readFileSync(componentPath, 'utf-8');
  const result = await transform(source, {
    filename: 'PhotoGallery.astro',
    moduleId: 'PhotoGallery.astro',
    sourcemap: false,
  });
  return result.code;
}

describe('Story 2: PhotoGallery component', () => {
  it('component file exists and compiles without errors', async () => {
    expect(fs.existsSync(componentPath)).toBe(true);
    const code = await compileComponent();
    expect(code).toBeTruthy();
    expect(code.length).toBeGreaterThan(0);
  });

  it('accepts an images prop of type PostImage array', () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('images: PostImage[]');
  });

  it('imports PostImage type from utils/posts', () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain("import type { PostImage } from '../utils/posts'");
  });

  it('renders a gallery section with aria-label', async () => {
    const code = await compileComponent();
    expect(code).toContain('aria-label="Photo gallery"');
  });

  it('renders a responsive grid with data-photo-gallery', async () => {
    const code = await compileComponent();
    expect(code).toContain('data-photo-gallery');
  });

  it('renders grid-cols-1 for mobile layout', async () => {
    const code = await compileComponent();
    expect(code).toContain('grid-cols-1');
  });

  it('renders sm:grid-cols-2 for tablet layout', async () => {
    const code = await compileComponent();
    expect(code).toContain('sm:grid-cols-2');
  });

  it('renders xl:grid-cols-3 for desktop layout', async () => {
    const code = await compileComponent();
    expect(code).toContain('xl:grid-cols-3');
  });

  it('renders each image inside a figure element', async () => {
    const code = await compileComponent();
    expect(code).toContain('<figure');
  });

  it('renders images with loading="lazy" for lazy loading', async () => {
    const code = await compileComponent();
    expect(code).toContain('loading="lazy"');
  });

  it('renders images with decoding="async"', async () => {
    const code = await compileComponent();
    expect(code).toContain('decoding="async"');
  });

  it('renders images with alt text from the data', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('alt={image.alt}');
  });

  it('renders image captions when present', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('{image.caption}');
    expect(source).toContain('<figcaption');
  });

  it('renders srcset with responsive widths', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('buildSrcSet');
    expect(source).toContain('480');
    expect(source).toContain('768');
    expect(source).toContain('1024');
    expect(source).toContain('1440');
  });

  it('renders a sizes attribute for viewport detection', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('sizes={sizes}');
    expect(source).toContain('sizes =');
  });

  it('renders a lightbox overlay with data-photo-lightbox', async () => {
    const code = await compileComponent();
    expect(code).toContain('data-photo-lightbox');
  });

  it('lightbox has role="dialog" and aria-modal="true"', async () => {
    const code = await compileComponent();
    expect(code).toContain('role="dialog"');
    expect(code).toContain('aria-modal="true"');
  });

  it('lightbox has a close button with data-lightbox-close', async () => {
    const code = await compileComponent();
    expect(code).toContain('data-lightbox-close');
  });

  it('lightbox has previous/next buttons', async () => {
    const code = await compileComponent();
    expect(code).toContain('data-lightbox-prev');
    expect(code).toContain('data-lightbox-next');
  });

  it('lightbox has a counter element', async () => {
    const code = await compileComponent();
    expect(code).toContain('data-lightbox-counter');
  });

  it('lightbox image element exists', async () => {
    const code = await compileComponent();
    expect(code).toContain('data-lightbox-image');
  });

  it('lightbox caption element exists', async () => {
    const code = await compileComponent();
    expect(code).toContain('data-lightbox-caption');
  });

  it('photo triggers have data-photo-trigger with index', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('data-photo-trigger={index}');
  });

  it('has keyboard accessibility: Escape key closes lightbox', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain("event.key === 'Escape'");
  });

  it('has keyboard accessibility: ArrowLeft navigates to previous', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain("event.key === 'ArrowLeft'");
  });

  it('has keyboard accessibility: ArrowRight navigates to next', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain("event.key === 'ArrowRight'");
  });

  it('lightbox close button has aria-label', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('aria-label="Close image viewer"');
  });

  it('prev/next buttons have aria-labels', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('aria-label="Previous image"');
    expect(source).toContain('aria-label="Next image"');
  });

  it('triggers have aria-label with image count', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('aria-label={`Open image ${index + 1} of ${images.length}: ${image.alt}`}');
  });
});
