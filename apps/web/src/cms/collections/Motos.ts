import type { CollectionConfig } from 'payload';

export const Motos: CollectionConfig = {
  slug: 'motos',
  admin: {
    useAsTitle: 'modelo',
    defaultColumns: ['marca', 'modelo', 'ano', 'preco', 'disponivel'],
    listSearchableFields: ['modelo', 'marca'],
  },
  access: {
    read: () => true, // Público para leitura
  },
  fields: [
    {
      name: 'marca',
      label: 'Marca',
      type: 'select',
      options: [
        { label: 'Suzuki', value: 'suzuki' },
        { label: 'Haojue', value: 'haojue' },
        { label: 'Zontes', value: 'zontes' },
        { label: 'Kymco', value: 'kymco' },
        { label: 'Seminovas', value: 'seminovas' },
      ],
      required: true,
    },
    {
      name: 'modelo',
      label: 'Modelo',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL amigável gerada automaticamente pelo modelo',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Gera o slug automaticamente a partir do modelo se ainda não definido
            if (!value && data?.modelo) {
              return data.modelo
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove acentos
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'ano',
      label: 'Ano',
      type: 'number',
      required: true,
      min: 2000,
      max: new Date().getFullYear() + 1,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'preco',
      label: 'Preço (R$)',
      type: 'number',
      required: true,
    },
    {
      name: 'disponivel',
      label: 'Disponível para venda',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'cor',
      label: 'Cor',
      type: 'text',
    },
    {
      name: 'km',
      label: 'Quilometragem',
      type: 'number',
      admin: {
        description: 'Deixe em branco para motos 0 km',
      },
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'richText',
    },
    {
      name: 'imagens',
      label: 'Imagens',
      type: 'array',
      fields: [
        {
          name: 'imagem',
          label: 'Imagem',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        description: 'Adicione até 10 imagens da moto',
      },
    },
  ],
};

