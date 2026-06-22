import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});

export const collections = {
  docs: docsCollection,
};
