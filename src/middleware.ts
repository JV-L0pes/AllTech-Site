// src/middleware.ts - SUBSTITUIR ARQUIVO COMPLETO
import { NextRequest, NextResponse } from 'next/server';

// Rate Limiter em memória para desenvolvimento (usar Redis em produção)
class RateLimiter {
  private static requests = new Map<string, {
    count: number;
    windowStart: number;
  }>();

  static checkRateLimit(request: NextRequest): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const ip = this.getClientIP(request);
    const now = Date.now();
    const windowMs = 60000; // 1 minuto
    const maxRequests = 60;

    const clientData = this.requests.get(ip) || {
      count: 0,
      windowStart: now,
    };

    // Reset window se necessário
    if (now - clientData.windowStart >= windowMs) {
      clientData.count = 0;
      clientData.windowStart = now;
    }

    // Verificar limite
    if (clientData.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: clientData.windowStart + windowMs,
      };
    }

    // Incrementar contador
    clientData.count++;
    this.requests.set(ip, clientData);

    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - clientData.count),
      resetTime: clientData.windowStart + windowMs,
    };
  }

  private static getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfIP = request.headers.get('cf-connecting-ip'); // Cloudflare
    
    if (cfIP) return cfIP;
    if (forwarded) return forwarded.split(',')[0].trim();
    if (realIP) return realIP;
    
    return 'localhost';
  }

  static cleanup(): void {
    const now = Date.now();
    const windowMs = 60000;

    for (const [ip, data] of this.requests.entries()) {
      if (now - data.windowStart > windowMs * 2) {
        this.requests.delete(ip);
      }
    }
  }
}

// Detector de ameaças básico
class ThreatDetector {
  private static readonly SUSPICIOUS_PATTERNS = [
    /(\bunion\b.*\bselect\b)|(\bselect\b.*\bunion\b)/i,
    /(\bdrop\s+table\b)|(\bdelete\s+from\b)|(\binsert\s+into\b)/i,
    /<script[^>]*>.*?<\/script>/i,
    /javascript:/i,
    /vbscript:/i,
    /on\w+\s*=/i,
  ];

  static analyzeRequest(request: NextRequest): {
    threats: string[];
    riskScore: number;
    shouldBlock: boolean;
  } {
    const threats: string[] = [];
    let riskScore = 0;

    const url = request.nextUrl.toString();
    const userAgent = request.headers.get('user-agent') || '';
    
    // Analisar URL
    for (const pattern of this.SUSPICIOUS_PATTERNS) {
      if (pattern.test(url)) {
        threats.push('SUSPICIOUS_URL_PATTERN');
        riskScore += 8;
      }
    }

    // Analisar User-Agent suspeito
    const suspiciousUserAgents = [
      /sqlmap/i, /nikto/i, /nmap/i, /burpsuite/i, /python-requests/i, /curl/i, /wget/i,
    ];

    for (const pattern of suspiciousUserAgents) {
      if (pattern.test(userAgent)) {
        threats.push('SUSPICIOUS_USER_AGENT');
        riskScore += 7;
        break;
      }
    }

    return {
      threats,
      riskScore: Math.min(riskScore, 100),
      shouldBlock: riskScore >= 15,
    };
  }
}

// Validador CSRF básico
class CSRFValidator {
  private static readonly EXEMPT_PATHS = [
    '/api/health',
    '/api/csrf',
    '/_next',
    '/images',
    '/favicon.ico',
  ];

  static shouldValidate(request: NextRequest): boolean {
    const method = request.method;
    const pathname = request.nextUrl.pathname;

    // Só validar métodos que modificam estado
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return false;
    }

    // Pular paths isentos
    return !this.EXEMPT_PATHS.some(path => pathname.startsWith(path));
  }

  static validate(request: NextRequest): boolean {
    if (!this.shouldValidate(request)) {
      return true;
    }

    const token = request.headers.get('x-csrf-token');
    const cookieHash = request.cookies.get('__csrf_hash')?.value;

    // Validação básica (validação completa será feita na API)
    return !!(token && cookieHash);
  }
}

// Middleware principal
export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const response = NextResponse.next();

  try {
    // 1. Análise de ameaças
    const threatAnalysis = ThreatDetector.analyzeRequest(request);
    
    if (threatAnalysis.shouldBlock) {
      console.log('🚨 Requisição bloqueada por análise de ameaças:', {
        threats: threatAnalysis.threats,
        riskScore: threatAnalysis.riskScore,
        url: request.url,
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      });

      return new NextResponse('Acesso negado por política de segurança', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    // 2. Rate Limiting
    const rateLimit = RateLimiter.checkRateLimit(request);
    
    if (!rateLimit.allowed) {
      console.log('⚠️ Rate limit excedido:', {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        remaining: rateLimit.remaining,
        path: request.nextUrl.pathname
      });

      return new NextResponse('Muitas requisições. Tente novamente em alguns momentos.', {
        status: 429,
        headers: {
          'Content-Type': 'text/plain',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          'Retry-After': '60',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    // 3. Validação CSRF básica
    if (!CSRFValidator.validate(request)) {
      console.log('🔒 CSRF validation failed:', {
        method: request.method,
        path: request.nextUrl.pathname,
        hasToken: !!request.headers.get('x-csrf-token'),
        hasCookie: !!request.cookies.get('__csrf_hash')?.value,
      });

      return new NextResponse('Token CSRF ausente ou inválido', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          'X-Content-Type-Options': 'nosniff',
        },
      });
    }

    // 4. Headers de segurança
    const securityHeaders = {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      'X-RateLimit-Reset': rateLimit.resetTime.toString(),
      'X-Response-Time': `${Date.now() - startTime}ms`,
    };

    // Aplicar headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;

  } catch (error) {
    console.error('❌ Erro no middleware de segurança:', error);
    return response;
  }
}

// Configuração de paths para o middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// Limpeza periódica
if (typeof window === 'undefined') {
  setInterval(() => {
    RateLimiter.cleanup();
  }, 300000); // 5 minutos
}