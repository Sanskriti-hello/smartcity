/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        border: '#e2e8f0',
        input: '#cbd5e1',
        ring: '#3b82f6',
        background: '#f8fafc',
        foreground: '#0f172a',
        'primary-foreground': '#f8fafc',
        'secondary-foreground': '#0f172a',
        card: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172a',
        },
        muted: {
          DEFAULT: '#e2e8f0',
          foreground: '#64748b',
        },
        accent: {
          DEFAULT: '#dbeafe',
          foreground: '#1e3a8a',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#f8fafc',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
