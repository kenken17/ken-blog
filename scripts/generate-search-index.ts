import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

interface PostFrontmatter {
  title: string;
  description?: string;
  pubDate: string | Date;
  draft?: boolean;
  tags?: string[];
}

interface SearchIndexEntry {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  pubDate: string;
}

const postsDir = path.resolve('src/content/posts');
const outputPath = path.resolve('public/search-index.json');

function extractFrontmatter(content: string): { frontmatter: string; body: string } {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: '', body: content };
  }
  return { frontmatter: match[1]!, body: match[2]! };
}

function generateSearchIndex(): SearchIndexEntry[] {
  if (!fs.existsSync(postsDir)) {
    console.warn(`Posts directory not found: ${postsDir}`);
    return [];
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));
  const entries: SearchIndexEntry[] = [];

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter } = extractFrontmatter(content);

    if (!frontmatter) {
      console.warn(`No frontmatter found in ${file}`);
      continue;
    }

    const data = yaml.load(frontmatter) as PostFrontmatter;

    if (data.draft) {
      continue;
    }

    const slug = file.replace(/\.md$/, '');
    const pubDate =
      data.pubDate instanceof Date
        ? data.pubDate.toISOString().split('T')[0]!
        : String(data.pubDate);

    entries.push({
      slug,
      title: data.title,
      description: data.description || '',
      tags: data.tags || [],
      pubDate,
    });
  }

  entries.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return entries;
}

const index = generateSearchIndex();

const publicDir = path.dirname(outputPath);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
console.log(`Generated search index with ${index.length} entries at ${outputPath}`);
