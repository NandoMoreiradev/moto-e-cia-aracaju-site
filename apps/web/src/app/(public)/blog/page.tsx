import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artigos sobre motos, dicas de manutenção e novidades da Moto e Cia Aracaju.',
};

export default function BlogPage() {
  return (
    <main style={{ padding: '6rem 2rem 4rem', maxWidth: 1280, margin: '0 auto' }}>
      <h1>Blog</h1>
      <p style={{ marginTop: '1rem', color: '#6B7280' }}>
        Em breve: artigos e novidades do mundo das motos.
      </p>
    </main>
  );
}
