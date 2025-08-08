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
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        tech: {
          // Azul Ciano Brilhante - Inovação
          cyan: '#06b6d4',
          // Azul Elétrico - Energia e Modernidade  
          electric: '#0ea5e9',
          // Azul Profundo - Confiança e Estabilidade
          deep: '#1e40af',
          // Azul Índigo - Tecnologia Avançada
          indigo: '#4f46e5',
          // Azul Violeta - Futuro e Inovação
          violet: '#7c3aed',
          // Azul Escuro - Profissionalismo
          dark: '#1e3a8a',
        },
        dark: {
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
        }
      },
      backgroundImage: {
        // Gradiente Principal - Azul Ciano para Índigo
        'tech-gradient': 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 25%, #1e40af 50%, #4f46e5 75%, #7c3aed 100%)',
        
        // Gradiente Alternativo - Azul Elétrico para Violeta
        'tech-gradient-alt': 'linear-gradient(135deg, #0ea5e9 0%, #1e40af 30%, #4f46e5 60%, #7c3aed 100%)',
        
        // Gradiente Reverso - Para efeitos especiais
        'tech-gradient-reverse': 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 25%, #1e40af 50%, #0ea5e9 75%, #06b6d4 100%)',
        
        // Gradiente Sutil - Para fundos
        'tech-gradient-subtle': 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #e0e7ff 100%)',
        
        // Gradiente Hero - Para seções principais
        'hero-tech': 'linear-gradient(135deg, #0c4a6e 0%, #1e40af 25%, #4f46e5 50%, #7c3aed 75%, #581c87 100%)',
        
        // Gradiente Hover - Para interações
        'tech-gradient-hover': 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 25%, #4338ca 50%, #6d28d9 75%, #5b21b6 100%)',
        
        // Gradiente Texto - Para textos especiais
        'tech-text': 'linear-gradient(90deg, #06b6d4, #0ea5e9, #1e40af, #4f46e5, #7c3aed)',
        
        // Gradiente Radial - Para efeitos de foco
        'tech-radial': 'radial-gradient(circle at center, #06b6d4 0%, #1e40af 50%, #4f46e5 100%)',
      },
      borderColor: {
        'tech-gradient': '#0ea5e9',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'gradient-shift': 'gradient-shift 6s ease-in-out infinite',
        'gradient-hover': 'gradient-hover 0.3s ease-in-out',
        'tech-pulse': 'tech-pulse 2s ease-in-out infinite',
        'tech-glow': 'tech-glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
            backgroundSize: '200% 200%' 
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            backgroundSize: '200% 200%' 
          },
        },
        'gradient-hover': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'tech-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(14, 165, 233, 0.7)' 
          },
          '70%': { 
            boxShadow: '0 0 0 10px rgba(14, 165, 233, 0)' 
          },
        },
        'tech-glow': {
          '0%': { 
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(79, 70, 229, 0.3)' 
          },
          '100%': { 
            boxShadow: '0 0 30px rgba(79, 70, 229, 0.6), 0 0 60px rgba(124, 58, 237, 0.4)' 
          },
        },
      },
      dropShadow: {
        'tech': '0 4px 20px rgba(14, 165, 233, 0.25)',
        'tech-lg': '0 8px 30px rgba(79, 70, 229, 0.3)',
      },
    },
  },
  plugins: [],
}

export default config