import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { asSeoCollection } from '@nuxtjs/seo/content'

export default defineContentConfig({
  collections: {
    landing: defineCollection(
      asSeoCollection({
        type: 'page',
        source: 'index.md',
      }),
    ),
    docs: defineCollection(
      asSeoCollection({
        type: 'page',
        source: {
          include: '**',
          exclude: ['index.md'],
        },
        schema: z.object({
          links: z.array(z.object({
            label: z.string(),
            icon: z.string(),
            to: z.string(),
            target: z.string().optional(),
          })).optional(),
        }),
      }),
    ),
  },
})
