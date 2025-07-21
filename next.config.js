/** @type {import('next').NextConfig} */

// Configurações de segurança baseadas em OWASP 2024
const SECURITY_CONFIG = {
  // CSP mais rigorosa
  CONTENT_SECURITY_POLICY: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js precisa
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: *.imgur.com",
    "font-src 'self' https://fonts.gstatic.com", 
    "connect-src 'self' https://api.emailjs.com",
    "object-src 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
    "block-all-mixed-content",
  ].join('; '),

  // Permissions Policy restritiva
  PERMISSIONS_POLICY: [
    "accelerometer=()",
    "camera=()",
    "geolocation=()",
    "gyroscope=()",
    "magnetometer=()",
    "microphone=()",
    "payment=()",
    "usb=()",
    "clipboard-write=(self)"
  ].join(', ')
};

const nextConfig = {
  // Desabilitar header X-Powered-By
  poweredByHeader: false,
  reactStrictMode: true,
  // swcMinify removido - é padrão no Next.js 15

  // Configuração segura de imagens
  images: {
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: false, // Desabilitar SVG por segurança
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      }
    ],
  },

  // Headers de segurança rigorosos
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return [
      {
        // Aplicar para todas as rotas
        source: '/:path*',
        headers: [
          // CSP rigorosa
          {
            key: 'Content-Security-Policy',
            value: SECURITY_CONFIG.CONTENT_SECURITY_POLICY,
          },
          
          // HSTS - apenas em produção HTTPS
          ...(isDevelopment ? [] : [{
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          }]),

          // Proteção contra clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },

          // Prevenção de MIME sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },

          // Referrer policy segura
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },

          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: SECURITY_CONFIG.PERMISSIONS_POLICY,
          },

          // Cross-Origin Policies
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },

          // Prevenção de cache
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, max-age=0',
          },
        ],
      },

      // Headers específicos para API routes
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'none'; frame-ancestors 'none';",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options', 
            value: 'DENY',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, max-age=0',
          },
        ],
      },

      // Headers para arquivos estáticos
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },

  // Redirects de segurança
  async redirects() {
    return [
      // Redirecionar www para non-www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.alltechdigital.com',
          },
        ],
        destination: 'https://alltechdigital.com/:path*',
        permanent: true,
      },
    ];
  },

  // Configuração do webpack para segurança
  webpack: (config, { buildId, dev, isServer, webpack }) => {
    if (!dev && !isServer) {
      // Remover source maps em produção
      config.devtool = false;
      
      // Configurar produção segura
      config.optimization = {
        ...config.optimization,
        minimize: true,
        sideEffects: false,
      };

      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production'),
          'process.env.NEXT_PUBLIC_BUILD_ID': JSON.stringify(buildId),
        })
      );
    }

    return config;
  },

  // Configuração rigorosa
  typescript: {
    ignoreBuildErrors: false, // Falhar se houver erros
  },

  eslint: {
    ignoreDuringBuilds: false, // Falhar se houver erros de lint
    dirs: ['src'],
  },

  // Configurações adicionais
  compress: true,
  trailingSlash: false,
  generateEtags: false,
};

// Validação de segurança para produção
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = [
    'DATABASE_URL',
    'SENDGRID_API_KEY',
    'SENDGRID_FROM_EMAIL',
    'CSRF_SECRET',
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ ERRO: Variáveis de ambiente obrigatórias não definidas:', missingVars);
    throw new Error(`Variáveis de ambiente faltando: ${missingVars.join(', ')}`);
  }

  console.log('✅ Configuração de segurança validada para produção');
}

module.exports = nextConfig;