import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ken-blog.pages.dev',
  output: 'static',
  integrations: [sitemap()],
});
