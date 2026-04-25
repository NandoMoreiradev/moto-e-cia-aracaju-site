import type { Metadata } from 'next';
import StyledComponentsRegistry from '@/lib/styled-registry';
import { Providers } from '@/lib/providers';
import { Toaster } from 'react-hot-toast';
import { Barlow, Barlow_Condensed } from 'next/font/google';

const barlow = Barlow({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-barlow',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-barlow-condensed',
});

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
    <html lang="pt-BR" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body style={{ margin: 0, padding: 0 }}>
        <StyledComponentsRegistry>
          <Providers>
            <Toaster position="top-right" />
            {children}
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
