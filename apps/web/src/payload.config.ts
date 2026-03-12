import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';

import { Users } from './cms/collections/Users';
import { Motos } from './cms/collections/Motos';
import { Servicos } from './cms/collections/Servicos';
import { Media } from './cms/collections/Media';

const filename = typeof __filename !== 'undefined' ? __filename : fileURLToPath(import.meta.url);
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(filename);

const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET;
if (!PAYLOAD_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('PAYLOAD_SECRET deve ser definido em produção. Configure a variável de ambiente.');
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Moto e Cia Aracaju',
    },
  },
  collections: [Users, Motos, Servicos, Media],
  editor: lexicalEditor({}),
  secret: PAYLOAD_SECRET || 'dev-secret-change-me-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  cors: [SERVER_URL, ...(process.env.CORS_ALLOWED_ORIGINS?.split(',') || [])],
  csrf: [SERVER_URL, ...(process.env.CORS_ALLOWED_ORIGINS?.split(',') || [])],
  i18n: {
    supportedLanguages: {
      pt: {} as never,
    },
    fallbackLanguage: 'pt',
  },
});

