// ─── Design System / Theme ────────────────────────────────────────────────────
// Guinean national colors + professional palette

export const colors = {
  // Guinean flag colors
  guinea: {
    red: '#CE1126',
    redLight: '#E8192E',
    redDark: '#A50D1E',
    gold: '#FCD116',
    goldLight: '#FFE04D',
    goldDark: '#D4A800',
    green: '#007A5E',
    greenLight: '#009B77',
    greenDark: '#005A45',
  },

  // Neutral scale
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

  // Interactive / accent
  accent: {
    blue: '#2563EB',
    blueLight: '#3B82F6',
    blueDark: '#1D4ED8',
  },

  // Corps colors
  corps: {
    police: { bg: '#1D4ED8', text: '#DBEAFE', badge: '#2563EB' },
    gendarmerie: { bg: '#334155', text: '#E2E8F0', badge: '#475569' },
    douane: { bg: '#007A5E', text: '#D1FAE5', badge: '#009B77' },
  },

  // Status colors
  status: {
    open: { bg: '#DBEAFE', text: '#1E40AF' },
    active: { bg: '#FEF3C7', text: '#92400E' },
    closed: { bg: '#D1FAE5', text: '#065F46' },
    archived: { bg: '#F1F5F9', text: '#475569' },
  },
} as const

export const typography = {
  fontFamily: {
    sans: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const

export const spacing = {
  sidebar: '280px',
  header: '64px',
  maxWidth: '1400px',
  contentPadding: {
    desktop: '24px',
    mobile: '16px',
  },
} as const

export const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  full: '9999px',
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
  cardHover: '0 4px 12px 0 rgb(0 0 0 / 0.12)',
} as const
