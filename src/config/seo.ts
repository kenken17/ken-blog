export const SITE_URL = 'https://ken-blog.pages.dev';

export const siteConfig = {
  title: "Ken's Blog",
  description: "A place for thoughts on engineering, design, and technology.",
  lang: 'en',
  author: 'Ken',
  ogImage: '/og-image.png',
  twitterHandle: '',
} as const;

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

export type JsonLdObject = Record<string, unknown>;
