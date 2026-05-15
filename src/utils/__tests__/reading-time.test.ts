import { describe, it, expect } from 'vitest';
import { calculateReadingTime, WORDS_PER_MINUTE } from '../reading-time';

function generateWords(count: number): string {
  return Array.from({ length: count }, (_, i) => `word${i}`).join(' ');
}

describe('WORDS_PER_MINUTE', () => {
  it('equals 200', () => {
    expect(WORDS_PER_MINUTE).toBe(200);
  });
});

describe('calculateReadingTime', () => {
  it('returns correct reading time for normal multi-paragraph content', () => {
    const content = `First paragraph with some words here.\n\nSecond paragraph continues with more words to read.`;
    expect(calculateReadingTime(content)).toBe(1);
  });

  it('returns 1 for an empty string', () => {
    expect(calculateReadingTime('')).toBe(1);
  });

  it('returns 1 for a single word', () => {
    expect(calculateReadingTime('hello')).toBe(1);
  });

  it('returns 1 for exactly 200 words', () => {
    const content = generateWords(200);
    expect(calculateReadingTime(content)).toBe(1);
  });

  it('returns 2 for 201 words (rounds up)', () => {
    const content = generateWords(201);
    expect(calculateReadingTime(content)).toBe(2);
  });

  it('strips markdown syntax before counting words', () => {
    const content = `# Heading\n\nThis is **bold** and _italic_ text with a [link](https://example.com) and ![image alt](image.png).\n\n> A blockquote here.\n\n- List item one\n- List item two\n\n\`inline code\` and \`\`\`\nfenced code block\n\`\`\``;
    expect(calculateReadingTime(content)).toBe(1);
  });

  it('returns correct time for very long content (10,000+ words)', () => {
    const content = generateWords(10000);
    expect(calculateReadingTime(content)).toBe(50);
  });

  it('handles markdown headings without counting hash symbols', () => {
    const content = '## Section Title\n\nSome paragraph text here.';
    expect(calculateReadingTime(content)).toBe(1);
  });
});
