import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { calculateReadingTime } from '../../../src/utils/reading-time';

const configPath = path.resolve(process.cwd(), 'src/content.config.ts');
const authorPath = path.resolve(process.cwd(), 'src/content/authors/ken.md');
const avatarPath = path.resolve(process.cwd(), 'public/images/avatar.png');

describe('Story 1: Author content collection and data model', () => {
  describe('TASK-1-1: content.config.ts', () => {
    it('defines an authors collection', () => {
      const source = fs.readFileSync(configPath, 'utf-8');
      expect(source).toContain("const authors = defineCollection");
      expect(source).toContain("loader: glob({ pattern: '**/*.md', base: './src/content/authors' })");
    });

    it('authors schema has name, avatar, and bio fields', () => {
      const source = fs.readFileSync(configPath, 'utf-8');
      expect(source).toContain('name: z.string()');
      expect(source).toContain('avatar: z.string()');
      expect(source).toContain('bio: z.string()');
    });

    it('posts schema has optional author field with default ken', () => {
      const source = fs.readFileSync(configPath, 'utf-8');
      expect(source).toContain('author: z.string().optional().default(\'ken\')');
    });

    it('exports both posts and authors collections', () => {
      const source = fs.readFileSync(configPath, 'utf-8');
      expect(source).toContain('export const collections = { posts, authors }');
    });
  });

  describe('TASK-1-2: Author content entry and avatar', () => {
    it('creates ken.md author file', () => {
      expect(fs.existsSync(authorPath)).toBe(true);
    });

    it('ken.md has required frontmatter fields', () => {
      const source = fs.readFileSync(authorPath, 'utf-8');
      expect(source).toContain('name: "Ken"');
      expect(source).toContain('avatar: "/images/avatar.png"');
      expect(source).toContain('bio:');
    });

    it('placeholder avatar image exists', () => {
      expect(fs.existsSync(avatarPath)).toBe(true);
    });
  });

  describe('calculateReadingTime utility', () => {
    it('returns a positive number for realistic markdown input', () => {
      const markdown = `# Hello World

This is a paragraph with enough words to make a meaningful reading time calculation. We need at least a few sentences to get a non-trivial result.

## Section Two

Here is another paragraph continuing the thought process. The function should strip markdown and count only real words.`;
      const result = calculateReadingTime(markdown);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });

    it('rounds up short text to at least 1 minute', () => {
      const shortText = 'Hello world.';
      expect(calculateReadingTime(shortText)).toBe(1);
    });

    it('returns > 5 min for long text over 1000 words', () => {
      const longText = Array.from({ length: 1100 }, (_, i) => `word${i}`).join(' ');
      expect(calculateReadingTime(longText)).toBeGreaterThan(5);
    });

    it('strips markdown before counting words', () => {
      const markdownWithSyntax = `# Heading\n\nThis is **bold** and _italic_ with a [link](https://example.com).\n\n\`code\` and \`\`\`\nblock\n\`\`\``;
      const result = calculateReadingTime(markdownWithSyntax);
      expect(result).toBe(1);
    });
  });
});
