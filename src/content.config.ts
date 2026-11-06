import { glob, file } from 'astro/loaders'
import { defineCollection } from 'astro:content'

import { pageSchema, postSchema, projectSchema } from '~/schema'

const pages = defineCollection({
  loader: glob({ base: './src/pages', pattern: '**/*.mdx' }),
  schema: pageSchema,
})

const home = defineCollection({
  // ids are the file paths without the extension: 'index', 'tr/index'
  // (the default would turn 'tr/index' into 'tr')
  loader: glob({
    base: './src/content/home',
    pattern: '**/*.{md,mdx}',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
  }),
})

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.{md,mdx}' }),
  schema: postSchema,
})

const projects = defineCollection({
  loader: file('./src/content/projects/data.json'),
  schema: projectSchema,
})

const shorts = defineCollection({
  loader: glob({ base: './src/content/shorts', pattern: '**/[^_]*.{md,mdx}' }),
  schema: postSchema,
})

export const collections = {
  pages,
  home,
  blog,
  projects,
  shorts,
}
