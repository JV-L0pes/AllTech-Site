/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configuração para origens de desenvolvimento permitidas
    allowedDevOrigins: [
      'c5c652e50d6a.ngrok-free.app', // Seu domínio ngrok específico
      '*.ngrok-free.app',
      '*.ngrok.app', 
      '*.ngrok.io',
      '*.loca.lt',
      '*.localhost.run'
    ],
    
    // Otimizações de performance
    images: {
      formats: ['image/webp', 'image/avif'],
      dangerouslyAllowSVG: true,
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    
    // Compressão automática
    compress: true,
    
    // Headers de segurança
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; connect-src 'self'; frame-ancestors 'none';"
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
          ],
        },
      ];
    },
  }
  
  module.exports = nextConfig