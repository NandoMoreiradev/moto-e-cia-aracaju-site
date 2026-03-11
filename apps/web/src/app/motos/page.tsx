import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Catálogo de Motos',
  description: 'Confira nosso catálogo completo de motos novas e usadas em Aracaju/SE.',
};

export default function MotosPage() {
  return (
    <main style={{ padding: '6rem 2rem 4rem', maxWidth: 1280, margin: '0 auto' }}>
      <h1>Catálogo de Motos</h1>
      <p style={{ marginTop: '1rem', color: '#6B7280' }}>
        Em breve: listagem completa com filtros por marca, tipo e preço.
      </p>
    </main>
  );
}
