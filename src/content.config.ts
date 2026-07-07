import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Colección "blog": todos los .md / .mdx dentro de src/content/blog/
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    // Acepta fechas tipo "2026-07-07" en el frontmatter.
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // Ponlo a true para ocultar un post del sitio publicado.
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
