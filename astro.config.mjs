import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import mdx from '@astrojs/mdx'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'
import rehypeExternalLinks from 'rehype-external-links'

// Custom rehype plugin to handle image paths
const rehypeImagePath = () => {
  const imageBaseUrl = 'https://i.kiksoft.net/';
  return (tree) => {
    // Process img tags
    tree.children.forEach((node) => {
      if (node.type === 'element' && node.tagName === 'img') {
        const src = node.properties.src;
        if (src && typeof src === 'string' && src.startsWith('/assets/')) {
          // Replace /assets/ with imageBaseUrl
          node.properties.src = imageBaseUrl + src.replace('/assets/', '');
        }
      }
      // Process markdown image nodes
      if (node.type === 'element' && node.tagName === 'p') {
        node.children.forEach((child) => {
          if (child.type === 'element' && child.tagName === 'img') {
            const src = child.properties.src;
            if (src && typeof src === 'string' && src.startsWith('/assets/')) {
              child.properties.src = imageBaseUrl + src.replace('/assets/', '');
            }
          }
        });
      }
    });
  };
};

// https://astro.build/config
export default defineConfig({
  site: 'https://astro-blog-template.netlify.app',
  integrations: [mdx(), svelte()],
  markdown: {
    shikiConfig: {
      theme: 'nord',
    },
    remarkPlugins: [remarkGfm, remarkSmartypants],
    rehypePlugins: [
      rehypeImagePath,
      [
        rehypeExternalLinks,
        {
          target: '_blank',
        },
      ],
    ],
  },
})
