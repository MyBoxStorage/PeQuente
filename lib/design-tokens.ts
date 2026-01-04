/**
 * Design Tokens - Pé Quente Calçados
 * Sistema centralizado de tokens de design para consistência visual
 */

// Paleta de Cores Master Supremo
export const colors = {
  // Cores Principais
  red: {
    primary: '#FF0000',
    hover: '#ff3333',
    active: '#CC0000',
  },
  blue: {
    primary: '#00008B',
    hover: '#1a1aff',
    active: '#000066',
  },
  yellow: {
    primary: '#FFD700', // Usar apenas no logo
  },

  // Backgrounds (Neutros Quentes)
  background: {
    base: '#0a0a0a',      // Fundo principal
    card: '#2d2d2d',      // Cards (mudança de #1e1e1e para mais acolhedor)
    elevated: '#252525',  // Elementos elevados
    border: '#353535',    // Borders, inputs
  },

  // Texto
  text: {
    primary: '#ffffff',
    secondary: '#a0a0a0',
    muted: '#6b6b6b',
  },
} as const;

// Sistema de Elevação (Sombras)
export const elevation = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
  glow: {
    red: '0 0 20px rgba(255, 0, 0, 0.3), 0 0 40px rgba(255, 0, 0, 0.2)',
    blue: '0 0 20px rgba(0, 0, 139, 0.3), 0 0 40px rgba(0, 0, 139, 0.2)',
  },
} as const;

// Gradientes Sutis
export const gradients = {
  card: 'linear-gradient(to bottom, #2d2d2d, #252525)',
  heroOverlay: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))',
  button: {
    red: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
    blue: 'linear-gradient(135deg, #00008B 0%, #000066 100%)',
  },
} as const;

// Transições Padronizadas
export const transitions = {
  fast: '150ms ease-out',
  default: '250ms ease-out',
  slow: '350ms ease-out',
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Sistema de Espaçamento (base 4px)
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  full: '9999px',
} as const;

// Z-Index Scale
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// Breakpoints (Tailwind padrão - para referência)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Typography
export const typography = {
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.05em',      // Tracking largo para títulos
    wider: '0.1em',
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Exportar todos os tokens como objeto único
export const designTokens = {
  colors,
  elevation,
  gradients,
  transitions,
  spacing,
  borderRadius,
  zIndex,
  breakpoints,
  typography,
} as const;
