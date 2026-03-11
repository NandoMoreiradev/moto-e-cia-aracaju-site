'use client';

import { ThemeProvider } from 'styled-components';
import { theme } from '@moto-e-cia/shared';
import { GlobalStyles } from '@/styles/GlobalStyles';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}
