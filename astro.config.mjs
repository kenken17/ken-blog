import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

/**
 * Remark plugin to parse code fence metadata and attach data-filename to <pre> tags.
 * Supports syntax: ```javascript title="example.js"
 */
function remarkCodeFilename() {
  return function (tree) {
    function walk(node) {
      if (node.type === 'code') {
        if (node.meta) {
          const match = node.meta.match(/title=["']([^"']+)["']/);
          if (match) {
            node.data = node.data || {};
            node.data.hProperties = node.data.hProperties || {};
            node.data.hProperties['data-filename'] = match[1];
          }
        }
      }
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(walk);
      }
    }
    walk(tree);
  };
}

/**
 * Custom Shiki transformer that adds line numbers to each code line.
 */
function transformerLineNumbers() {
  return {
    name: 'line-numbers',
    line(node, line) {
      // Prepend a line number span to the beginning of each line
      node.children.unshift({
        type: 'element',
        tagName: 'span',
        properties: { class: 'line-number' },
        children: [{ type: 'text', value: String(line) }],
      });
      return node;
    },
  };
}

export default defineConfig({
  site: 'https://ken-blog.pages.dev',
  output: 'static',
  integrations: [sitemap(), mdx()],
  markdown: {
    remarkPlugins: [remarkCodeFilename],
    shikiConfig: {
      theme: 'github-light',
      darkMode: 'github-dark',
      wrap: true,
      transformers: [transformerLineNumbers()],
    },
  },
});
