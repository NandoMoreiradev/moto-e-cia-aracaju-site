import type { CollectionConfig } from 'payload';

export const Servicos: CollectionConfig = {
  slug: 'servicos',
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'ativo', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'titulo',
      label: 'Título',
      type: 'text',
      required: true,
    },
    {
      name: 'descricao', // Corrigido: removido acento do nome da propriedade
      label: 'Descrição',
      type: 'textarea',
      required: true,
    },
    {
      name: 'imagem',
      label: 'Imagem',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'ativo',
      label: 'Ativo',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
};

