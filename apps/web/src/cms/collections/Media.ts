import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: '../public/media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 200,
        position: 'centre',
      },
      {
        name: 'card',
        width: 800,
        height: 533,
        position: 'centre',
      },
      {
        name: 'large',
        width: 1600,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto Alternativo (SEO)',
      type: 'text',
      required: true,
      admin: {
        description: 'Descreva brevemente a imagem para acessibilidade e SEO',
      },
    },
  ],
};

