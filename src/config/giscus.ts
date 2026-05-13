export interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: string;
  theme: string;
  lang: string;
  reactionsEnabled: string;
  emitMetadata: string;
}

export const giscusConfig: GiscusConfig = {
  repo: 'kenken17/ken-blog-comments',
  repoId: 'R_kgDOOXXXXX',
  category: 'Comments',
  categoryId: 'DIC_kwDOOXXXXX',
  mapping: 'pathname',
  theme: 'light',
  lang: 'en',
  reactionsEnabled: '1',
  emitMetadata: '0',
};
