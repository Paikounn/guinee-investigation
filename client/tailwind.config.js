/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        police: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gendarmerie: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
          800: '#1e293b',
          900: '#0f172a',
        },
        douane: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}