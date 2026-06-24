import { describe, it, expect } from 'vitest';
import { transform } from '@astrojs/compiler';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(
  process.cwd(),
  'src/components/PhotoPostForm.astro',
);

async function compileComponent() {
  const source = fs.readFileSync(componentPath, 'utf-8');
  const result = await transform(source, {
    filename: 'PhotoPostForm.astro',
    moduleId: 'PhotoPostForm.astro',
    sourcemap: false,
  });
  return result.code;
}

describe('Story 3: PhotoPostForm component', () => {
  it('component file exists and compiles without errors', async () => {
    expect(fs.existsSync(componentPath)).toBe(true);
    const code = await compileComponent();
    expect(code).toBeTruthy();
    expect(code.length).toBeGreaterThan(0);
  });

  it('renders a form with id="photo-post-form"', async () => {
    const code = await compileComponent();
    expect(code).toContain('id="photo-post-form"');
  });

  it('renders a title input field', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('id="photo-post-title"');
    expect(source).toContain('name="title"');
    expect(source).toContain('type="text"');
    expect(source).toContain('required');
  });

  it('renders a description textarea', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('id="photo-post-description"');
    expect(source).toContain('name="description"');
    expect(source).toContain('<textarea');
  });

  it('renders a file input accepting image types', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('id="photo-file-input"');
    expect(source).toContain('type="file"');
    expect(source).toContain('multiple');
  });

  it('file input accepts jpg, png, webp, gif', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('image/png');
    expect(source).toContain('image/jpeg');
    expect(source).toContain('image/webp');
    expect(source).toContain('image/gif');
  });

  it('renders a drop zone for drag-and-drop', async () => {
    const code = await compileComponent();
    expect(code).toContain('id="photo-drop-zone"');
  });

  it('renders a file picker button', async () => {
    const code = await compileComponent();
    expect(code).toContain('id="photo-file-picker"');
  });

  it('renders a preview list container', async () => {
    const code = await compileComponent();
    expect(code).toContain('id="photo-preview-list"');
  });

  it('renders a submit button', async () => {
    const code = await compileComponent();
    expect(code).toContain('id="photo-submit-btn"');
  });

  it('renders a status element for feedback', async () => {
    const code = await compileComponent();
    expect(code).toContain('id="photo-post-status"');
    expect(code).toContain('role="status"');
  });

  it('has client-side script for form handling', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('<script>');
    expect(source).toContain("addEventListener('submit'");
  });

  it('validates file size with 10MB limit', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('MAX_FILE_SIZE_BYTES');
    expect(source).toContain('10 * 1024 * 1024');
  });

  it('validates file type with ACCEPTED_TYPES set', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('ACCEPTED_TYPES');
    expect(source).toContain("new Set(");
  });

  it('has drag and drop event handlers', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain("addEventListener('dragover'");
    expect(source).toContain("addEventListener('dragleave'");
    expect(source).toContain("addEventListener('drop'");
  });

  it('has image reorder functionality', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('moveImage');
    expect(source).toContain('data-move-up');
    expect(source).toContain('data-move-down');
  });

  it('has image remove functionality', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('data-remove');
  });

  it('sends FormData to /api/photo-post endpoint', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain("/api/photo-post'");
    expect(source).toContain("method: 'POST'");
  });

  it('includes caption inputs for each image', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('data-caption-index');
    expect(source).toContain('caption_${index}');
  });

  it('has aria-label on the form section', async () => {
    const source = fs.readFileSync(componentPath, 'utf-8');
    expect(source).toContain('aria-label="Create photo post form"');
  });
});
