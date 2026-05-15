export const WORDS_PER_MINUTE = 200;

function stripMarkdown(content: string): string {
  return (
    content
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]*`/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/(\*{1,2}|_{1,2})([^*_]+)\1/g, '$2')
      .replace(/^>\s*/gm, '')
      .replace(/^[\s]*[-*+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      .replace(/^(---|___|\*\*\*)\s*$/gm, '')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

export function calculateReadingTime(content: string): number {
  const plainText = stripMarkdown(content);
  const words = plainText.split(/\s+/).filter((word) => word.length > 0);
  const wordCount = words.length;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return Math.max(minutes, 1);
}
