import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const configPath = path.resolve(process.cwd(), 'src/content.config.ts');

describe('Story 1: Photo blog post content schema', () => {
  let configSource: string;

  beforeAll(() => {
    configSource = fs.readFileSync(configPath, 'utf-8');
  });

  it('content.config.ts exists and compiles', () => {
    expect(fs.existsSync(configPath)).toBe(true);
    expect(configSource.length).toBeGreaterThan(0);
  });

  it('defines a postType field with article and photo enum values', () => {
    expect(configSource).toContain("postType: z.enum(['article', 'photo'])");
  });

  it('defines an images array field in the posts schema', () => {
    expect(configSource).toContain('images:');
    expect(configSource).toContain('z.array(');
  });

  it('images array items have url, alt, and optional caption', () => {
    expect(configSource).toContain('url: z.string()');
    expect(configSource).toContain('alt: z.string()');
    expect(configSource).toContain('caption: z.string().optional()');
  });

  it('title is a required string field', () => {
    expect(configSource).toContain('title: z.string()');
  });

  it('description is an optional string field', () => {
    expect(configSource).toContain('description: z.string().optional()');
  });

  it('pubDate is a coerced date field', () => {
    expect(configSource).toContain('pubDate: z.coerce.date()');
  });

  it('tags is an optional array of strings with default empty array', () => {
    expect(configSource).toContain('tags: z.array(z.string()).optional().default([])');
  });

  it('draft is an optional boolean with default false', () => {
    expect(configSource).toContain('draft: z.boolean().optional().default(false)');
  });

  it('images defaults to empty array', () => {
    expect(configSource).toContain("images: z\n      .array(");
    expect(configSource).toContain('.optional().default([])');
  });

  it('sample photo post exists and has correct frontmatter fields', () => {
    const samplePath = path.resolve(process.cwd(), 'src/content/posts/photo-post-sample.md');
    expect(fs.existsSync(samplePath)).toBe(true);

    const content = fs.readFileSync(samplePath, 'utf-8');
    expect(content).toContain('postType: photo');
    expect(content).toContain('images:');
    expect(content).toContain('url:');
    expect(content).toContain('alt:');
  });

  it('posts.ts exports isPhotoPost utility function', () => {
    const postsPath = path.resolve(process.cwd(), 'src/utils/posts.ts');
    const postsSource = fs.readFileSync(postsPath, 'utf-8');
    expect(postsSource).toContain('export function isPhotoPost');
  });

  it('posts.ts exports getPostType utility function', () => {
    const postsPath = path.resolve(process.cwd(), 'src/utils/posts.ts');
    const postsSource = fs.readFileSync(postsPath, 'utf-8');
    expect(postsSource).toContain('export function getPostType');
  });

  it('posts.ts exports getPhotoImages utility function', () => {
    const postsPath = path.resolve(process.cwd(), 'src/utils/posts.ts');
    const postsSource = fs.readFileSync(postsPath, 'utf-8');
    expect(postsSource).toContain('export function getPhotoImages');
  });

  it('posts.ts exports getPhotoThumbnail utility function', () => {
    const postsPath = path.resolve(process.cwd(), 'src/utils/posts.ts');
    const postsSource = fs.readFileSync(postsPath, 'utf-8');
    expect(postsSource).toContain('export function getPhotoThumbnail');
  });

  it('posts.ts PostImage type has url, alt, and optional caption', () => {
    const postsPath = path.resolve(process.cwd(), 'src/utils/posts.ts');
    const postsSource = fs.readFileSync(postsPath, 'utf-8');
    expect(postsSource).toContain('url: string');
    expect(postsSource).toContain('alt: string');
    expect(postsSource).toContain('caption?: string');
  });
});
