import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imagen', plural: 'Imágenes' },
  access: { read: () => true },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Texto alternativo',
      admin: { description: 'Describe la imagen en una frase (accesibilidad y Google).' },
    },
  ],
  upload: {
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 768 },
      { name: 'hero', width: 1600 },
    ],
  },
}
