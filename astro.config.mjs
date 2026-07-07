// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // URL de producción en GitHub Pages.
  // Repo: krusef-hash/blog  ->  https://krusef-hash.github.io/blog
  site: 'https://krusef-hash.github.io',
  // base = '/<nombre-del-repo>' porque es un "project site".
  // Si algún día usas un repo llamado <usuario>.github.io, pon base: '/'.
  base: '/blog',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      // Doble tema: uno para claro y otro para oscuro.
      // El CSS de global.css alterna entre ambos según html.dark
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});
