'use client';

import { ThemeProvider } from 'styled-components';
import { theme } from '@moto-e-cia/shared';
// Se houver um GlobalStyles no @shared, trocar abaixo, ou criar o arquivo se inexistente.
import { GlobalStyles } from '@/styles/GlobalStyles';
import { WhatsAppProvider } from '@/contexts/WhatsAppContext';
import { WhatsAppModal } from '@/components/common/WhatsAppModal';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <WhatsAppProvider>
        {children}
        <WhatsAppModal />
      </WhatsAppProvider>
    </ThemeProvider>
  );
}
