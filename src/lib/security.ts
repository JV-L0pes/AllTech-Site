// src/lib/security.ts
import { NextRequest } from 'next/server';

// Rate Limiting em memória (para produção use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number;  // Janela de tempo em ms
  maxRequests: number;  // Máximo de requests por janela
}

export class SecurityService {
  private static readonly DEFAULT_CONFIG: RateLimitConfig = {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'), // 1 minuto
    maxRequests: parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '10')
  };

  // Rate Limiting
  static checkRateLimit(request: NextRequest, config: RateLimitConfig = this.DEFAULT_CONFIG): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const ip = this.getClientIP(request);
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Limpar entradas expiradas
    this.cleanupExpiredEntries(windowStart);

    // Verificar rate limit para este IP
    const clientData = rateLimitMap.get(ip);
    
    if (!clientData || clientData.resetTime < now) {
      // Primeira requisição ou janela expirada
      const resetTime = now + config.windowMs;
      rateLimitMap.set(ip, { count: 1, resetTime });
      
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime
      };
    }

    if (clientData.count >= config.maxRequests) {
      // Limite excedido
      return {
        allowed: false,
        remaining: 0,
        resetTime: clientData.resetTime
      };
    }

    // Incrementar contador
    clientData.count++;
    rateLimitMap.set(ip, clientData);

    return {
      allowed: true,
      remaining: config.maxRequests - clientData.count,
      resetTime: clientData.resetTime
    };
  }

  // Obter IP do cliente
  private static getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }

    // Fallback para desenvolvimento
    return 'localhost';
  }

  // Limpar entradas expiradas
  private static cleanupExpiredEntries(windowStart: number): void {
    for (const [ip, data] of rateLimitMap.entries()) {
      if (data.resetTime < windowStart) {
        rateLimitMap.delete(ip);
      }
    }
  }

  // Validar headers de segurança
  static validateSecurityHeaders(request: NextRequest): {
    valid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // Verificar Content-Type para POST
    if (request.method === 'POST') {
      const contentType = request.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        issues.push('Content-Type deve ser application/json');
      }
    }

    // Verificar User-Agent
    const userAgent = request.headers.get('user-agent');
    if (!userAgent || userAgent.length < 10) {
      issues.push('User-Agent suspeito ou ausente');
    }

    // Verificar se não é bot malicioso
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i
    ];

    if (userAgent && suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
      // Permitir bots legítimos
      const legitimateBots = [
        /googlebot/i,
        /bingbot/i,
        /slackbot/i,
        /facebookexternalhit/i
      ];

      if (!legitimateBots.some(pattern => pattern.test(userAgent))) {
        issues.push('Bot suspeito detectado');
      }
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }

  // Detectar tentativas de ataque
  static detectSuspiciousActivity(data: any): {
    suspicious: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    // Verificar tamanhos anômalos
    if (typeof data === 'object') {
      const jsonString = JSON.stringify(data);
      
      if (jsonString.length > 10000) {
        reasons.push('Payload muito grande');
      }

      // Verificar campos com conteúdo suspeito
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /vbscript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /data:text\/html/i,
        /union\s+select/i,
        /drop\s+table/i,
        /insert\s+into/i,
        /delete\s+from/i
      ];

      const checkValue = (value: any): void => {
        if (typeof value === 'string') {
          suspiciousPatterns.forEach(pattern => {
            if (pattern.test(value)) {
              reasons.push(`Conteúdo suspeito detectado: ${pattern.source}`);
            }
          });
        }
      };

      // Verificar todos os valores recursivamente
      const checkObject = (obj: any): void => {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === 'string') {
              checkValue(value);
            } else if (typeof value === 'object' && value !== null) {
              checkObject(value);
            }
          }
        }
      };

      checkObject(data);
    }

    return {
      suspicious: reasons.length > 0,
      reasons
    };
  }

  // Gerar token CSRF (se precisar no futuro)
  static generateCSRFToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Sanitizar input
  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>\"'&]/g, '') // Remove caracteres perigosos
      .replace(/\s+/g, ' ') // Normaliza espaços
      .substring(0, 1000); // Limita tamanho
  }

  // Log de segurança
  static logSecurityEvent(event: string, details: any, request: NextRequest): void {
    const logData = {
      timestamp: new Date().toISOString(),
      event,
      ip: this.getClientIP(request),
      userAgent: request.headers.get('user-agent'),
      url: request.url,
      method: request.method,
      details
    };

    console.log('🔒 SECURITY EVENT:', JSON.stringify(logData));
    
    // Em produção, enviar para serviço de monitoramento
    // await sendToSecurityMonitoring(logData);
  }
}

// Middleware de Rate Limiting para usar na API
export function withRateLimit(handler: Function) {
  return async (request: NextRequest, context: any) => {
    const rateLimit = SecurityService.checkRateLimit(request);
    
    if (!rateLimit.allowed) {
      SecurityService.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        remaining: rateLimit.remaining,
        resetTime: new Date(rateLimit.resetTime).toISOString()
      }, request);

      return new Response(
        JSON.stringify({
          success: false,
          message: 'Muitas tentativas. Tente novamente em alguns minutos.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '10',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }

    // Adicionar headers de rate limit na resposta
    const response = await handler(request, context);
    
    if (response instanceof Response) {
      response.headers.set('X-RateLimit-Limit', process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '10');
      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());
    }

    return response;
  };
}

// Middleware de Validação de Segurança
export function withSecurity(handler: Function) {
  return async (request: NextRequest, context: any) => {
    // Validar headers
    const headerValidation = SecurityService.validateSecurityHeaders(request);
    if (!headerValidation.valid) {
      SecurityService.logSecurityEvent('INVALID_HEADERS', {
        issues: headerValidation.issues
      }, request);

      return new Response(
        JSON.stringify({
          success: false,
          message: 'Requisição inválida'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validar payload se for POST
    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const suspiciousCheck = SecurityService.detectSuspiciousActivity(body);
        
        if (suspiciousCheck.suspicious) {
          SecurityService.logSecurityEvent('SUSPICIOUS_PAYLOAD', {
            reasons: suspiciousCheck.reasons,
            payload: body
          }, request);

          return new Response(
            JSON.stringify({
              success: false,
              message: 'Conteúdo bloqueado por segurança'
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

        // Recriar request com body validado
        const newRequest = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: JSON.stringify(body)
        });

        return handler(newRequest, context);
      } catch (error) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'JSON inválido'
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    return handler(request, context);
  };
}