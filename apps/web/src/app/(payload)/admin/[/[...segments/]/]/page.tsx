import { RootPage, GenerateViewMetadata } from '@payloadcms/next/views';
import config from '@/payload.config';

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

// Em versões recentes do Payload 3, o importMap é gerado ou definido para otimizar o bundle.
// Por enquanto, usaremos um objeto vazio se não houver um gerado.
const importMap = {};

export const generateMetadata = async ({ params, searchParams }: Args) =>
  GenerateViewMetadata({ config, params: await params, searchParams: await searchParams, importMap });

const Page = async ({ params, searchParams }: Args) =>
  RootPage({ config, params, searchParams, importMap });

export default Page;
