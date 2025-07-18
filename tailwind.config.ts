import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#3DA1C1', // Cor principal do gradiente
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        tech: {
          cyan: '#2B7A94',      // Escurecido de #3DA1C1
          green: '#7FB865',     // Escurecido de #CDFACE  
          darkGreen: '#5A8C4B', // Escurecido de #83C46B
          electric: '#2B7A94',
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      backgroundImage: {
        'tech-gradient': 'linear-gradient(135deg, #2B7A94 0%, #7FB865 50%, #5A8C4B 100%)',
        'tech-text': 'linear-gradient(90deg, #2B7A94, #7FB865, #5A8C4B)',
        'hero-tech': 'linear-gradient(135deg, #1e4a5a 0%, #6a9954 50%, #3e5a32 100%)',
        'tech-gradient-hover': 'linear-gradient(135deg, #1e4a5a 0%, #6a9954 30%, #3e5a32 70%, #2B7A94 100%)',
        'tech-gradient-reverse': 'linear-gradient(135deg, #5A8C4B 0%, #7FB865 50%, #2B7A94 100%)',
      },
      borderColor: {
        'tech-gradient': '#3DA1C1',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'gradient-hover': 'gradient-hover 0.3s ease-in-out',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'gradient-hover': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}

export default config