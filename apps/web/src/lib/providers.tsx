'use client';

import { ThemeProvider } from 'styled-components';
import { theme } from '@moto-e-cia/shared';
// Se houver um GlobalStyles no @shared, trocar abaixo, ou criar o arquivo se inexistente.
import { GlobalStyles } from '@moto-e-cia/shared';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}
