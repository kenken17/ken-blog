export interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: string;
  strict: string;
  theme: string;
  lang: string;
  reactionsEnabled: string;
  emitMetadata: string;
  inputPosition: string;
}

export const giscusConfig: GiscusConfig = {
  repo: 'kenken17/ken-blog',
  repoId: 'R_kgDOSYASSw',
  category: 'General',
  categoryId: 'DIC_kwDOSYASS84C8-er',
  mapping: 'pathname',
  strict: '0',
  theme: 'light',
  lang: 'en',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
};
