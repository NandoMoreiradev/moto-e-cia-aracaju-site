export const theme = {
  colors: {
    // Cores da marca
    primary: '#0055A4',       // Azul principal
    primaryDark: '#003E7A',   // Azul escuro (hover)
    primaryLight: '#1A6FBC',  // Azul claro

    secondary: '#E2231A',     // Vermelho principal
    secondaryDark: '#B81A13', // Vermelho escuro (hover)
    secondaryLight: '#FF3B31',// Vermelho claro

    // Neutros
    dark: '#151515',          // Fundo escuro (header, footer)
    darkGray: '#2A2A2A',      // Cinza escuro
    gray: '#6B7280',          // Texto secundário
    lightGray: '#E5E7EB',     // Bordas, divisores
    offWhite: '#F8F8F8',      // Background geral

    white: '#FFFFFF',

    // Texto
    textPrimary: '#1A1A1A',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    textInverse: '#FFFFFF',

    // Status
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // WhatsApp
    whatsapp: '#25D366',
  },

  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },

  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },

  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeights: {
    tight: '1.2',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '2.5rem',  // 40px
    '3xl': '3rem',    // 48px
    '4xl': '4rem',    // 64px
    '5xl': '6rem',    // 96px
    '6xl': '8rem',    // 128px
  },

  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    card: '0 4px 20px rgba(0, 0, 0, 0.08)',
    button: '0 4px 14px rgba(0, 85, 164, 0.4)',
  },

  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  transitions: {
    fast: '0.15s ease',
    normal: '0.25s ease',
    slow: '0.4s ease',
    spring: '0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  zIndex: {
    hide: -1,
    base: 0,
    raised: 1,
    dropdown: 1000,
    sticky: 1100,
    overlay: 1200,
    modal: 1300,
    popover: 1400,
    toast: 1500,
  },
} as const;

export type Theme = typeof theme;
