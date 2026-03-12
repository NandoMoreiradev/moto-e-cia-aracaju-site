import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'nome', 'role'],
  },
  auth: true,
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: 'Perfil',
      type: 'select',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      defaultValue: 'editor',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Define as permissões de acesso no painel',
      },
    },
  ],
};

