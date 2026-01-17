import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#081F5C',
          800: '#0A2E8A',
          500: '#1F6FFF',
          400: '#3B7BFF'
        },
        accent: {
          500: '#F4B000'
        },
        surface: {
          50: '#F4F6FA',
          0: '#FFFFFF'
        }
      },
      boxShadow: {
        card: '0 10px 30px rgba(10, 46, 138, 0.12)'
      }
    }
  },
  plugins: []
} satisfies Config;
