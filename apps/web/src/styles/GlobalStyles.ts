import { createGlobalStyle } from 'styled-components';
import { Theme } from '@moto-e-cia/shared';

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  /* Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.fontWeights.regular};
    line-height: ${({ theme }) => theme.lineHeights.normal};
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.white};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    line-height: ${({ theme }) => theme.lineHeights.tight};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};
  }

  img, video {
    max-width: 100%;
    height: auto;
    display: block;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    outline: none;
  }

  ul, ol {
    list-style: none;
  }

  /* Scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.lightGray};
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray};
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary};
  }

  /* Seleção de texto */
  ::selection {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }

  /* Container padrão */
  .container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.lg};

    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      padding: 0 ${({ theme }) => theme.spacing.md};
    }
  }
`;
