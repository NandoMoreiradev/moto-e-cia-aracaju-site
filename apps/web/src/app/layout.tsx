import type { Metadata } from 'next';
import StyledComponentsRegistry from '@/lib/styled-registry';
import { Providers } from '@/lib/providers';

export const metadata: Metadata = {
  title: {
    template: '%s | Moto e Cia Aracaju',
    default: 'Moto e Cia Aracaju — Suzuki, Haojue, Zontes',
  },
  description:
    'Concessionária de motos em Aracaju/SE. Revendedora oficial Suzuki, Haojue e Zontes. Motos novas, usadas, peças, serviços e aluguel.',
  keywords: ['motos aracaju', 'suzuki aracaju', 'haojue aracaju', 'zontes', 'moto e cia'],
  openGraph: {
    siteName: 'Moto e Cia Aracaju',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
