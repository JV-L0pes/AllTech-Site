// src/lib/security-logger.ts - SISTEMA DE LOGGING DE SEGURANÇA
import { NextRequest } from 'next/server';

// Enum para níveis de severidade
enum SecurityEventLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

// Enum para categorias de eventos de segurança
enum SecurityEventCategory {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  INPUT_VALIDATION = 'INPUT_VALIDATION',
  CSRF_PROTECTION = 'CSRF_PROTECTION',
  RATE_LIMITING = 'RATE_LIMITING',
  CORS_VIOLATION = 'CORS_VIOLATION',
  SQL_INJECTION_ATTEMPT = 'SQL_INJECTION_ATTEMPT',
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  DATA_ACCESS = 'DATA_ACCESS',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY'
}

// Interface para evento de segurança estruturado
interface SecurityEvent {
  id: string;
  timestamp: string;
  level: SecurityEventLevel;
  category: SecurityEventCategory;
  event: string;
  message: string;
  clientInfo: {
    ip: string;
    userAgent: string;
    origin?: string;
    referer?: string;
  };
  requestInfo: {
    method: string;
    url: string;
    path: string;
    headers: Record<string, string>;
  };
  context: Record<string, any>;
  risk_score: number; // 1-10
  actionRequired: boolean;
}

// Rate limiter para logs (evitar spam de logs)
class LogRateLimiter {
  private static logCounts = new Map<string, { count: number; resetTime: number }>();
  private static readonly WINDOW_MS = 60000; // 1 minuto
  private static readonly MAX_LOGS_PER_WINDOW = 100;

  static shouldLog(key: string): boolean {
    const now = Date.now();
    const logData = this.logCounts.get(key);

    if (!logData || logData.resetTime < now) {
      this.logCounts.set(key, { count: 1, resetTime: now + this.WINDOW_MS });
      return true;
    }

    if (logData.count >= this.MAX_LOGS_PER_WINDOW) {
      return false;
    }

    logData.count++;
    return true;
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, data] of this.logCounts.entries()) {
      if (data.resetTime < now) {
        this.logCounts.delete(key);
      }
    }
  }
}

// Sistema principal de logging de segurança
export class SecurityLogger {
  private static formatEvent(event: SecurityEvent): string {
    return JSON.stringify({
      ...event,
      // Adicionar campos para SIEM
      '@timestamp': event.timestamp,
      '@version': '1',
      host: process.env.HOSTNAME || 'unknown',
      service: 'alltech-digital-api',
      environment: process.env.NODE_ENV || 'development'
    }, null, 2);
  }

  private static calculateRiskScore(
    category: SecurityEventCategory,
    level: SecurityEventLevel,
    context: Record<string, any>
  ): number {
    let baseScore = 1;

    // Score por categoria
    switch (category) {
      case SecurityEventCategory.SQL_INJECTION_ATTEMPT:
      case SecurityEventCategory.XSS_ATTEMPT:
        baseScore = 9;
        break;
      case SecurityEventCategory.AUTHENTICATION:
      case SecurityEventCategory.AUTHORIZATION:
        baseScore = 7;
        break;
      case SecurityEventCategory.CSRF_PROTECTION:
      case SecurityEventCategory.CORS_VIOLATION:
        baseScore = 6;
        break;
      case SecurityEventCategory.RATE_LIMITING:
        baseScore = 4;
        break;
      case SecurityEventCategory.INPUT_VALIDATION:
        baseScore = 3;
        break;
      default:
        baseScore = 2;
    }

    // Ajustar por nível
    switch (level) {
      case SecurityEventLevel.CRITICAL:
        baseScore = Math.min(10, baseScore + 3);
        break;
      case SecurityEventLevel.ERROR:
        baseScore = Math.min(10, baseScore + 1);
        break;
      case SecurityEventLevel.WARNING:
        // mantém score base
        break;
      case SecurityEventLevel.INFO:
        baseScore = Math.max(1, baseScore - 1);
        break;
    }

    return Math.min(10, Math.max(1, baseScore));
  }

  private static extractClientInfo(request: NextRequest): SecurityEvent['clientInfo'] {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0].trim() || realIP || 'unknown';

    return {
      ip,
      userAgent: request.headers.get('user-agent') || 'unknown',
      origin: request.headers.get('origin') || undefined,
      referer: request.headers.get('referer') || undefined,
    };
  }

  private static extractRequestInfo(request: NextRequest): SecurityEvent['requestInfo'] {
    const headers: Record<string, string> = {};
    
    // Capturar apenas headers relevantes para segurança
    const relevantHeaders = [
      'content-type', 'content-length', 'authorization', 
      'x-csrf-token', 'x-requested-with', 'accept',
      'accept-encoding', 'accept-language', 'cache-control'
    ];

    for (const header of relevantHeaders) {
      const value = request.headers.get(header);
      if (value) {
        headers[header] = value;
      }
    }

    return {
      method: request.method,
      url: request.url,
      path: new URL(request.url).pathname,
      headers,
    };
  }

  static async logSecurityEvent(
    category: SecurityEventCategory,
    event: string,
    message: string,
    level: SecurityEventLevel,
    request: NextRequest,
    context: Record<string, any> = {}
  ): Promise<void> {
    try {
      const clientInfo = this.extractClientInfo(request);
      
      // Rate limiting para evitar spam de logs
      const rateLimitKey = `${clientInfo.ip}-${category}-${event}`;
      if (!LogRateLimiter.shouldLog(rateLimitKey)) {
        return;
      }

      const riskScore = this.calculateRiskScore(category, level, context);
      const actionRequired = riskScore >= 7;

      const securityEvent: SecurityEvent = {
        id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        level,
        category,
        event,
        message,
        clientInfo,
        requestInfo: this.extractRequestInfo(request),
        context,
        risk_score: riskScore,
        actionRequired,
      };

      const formattedEvent = this.formatEvent(securityEvent);

      // Log estruturado para diferentes destinos
      if (process.env.NODE_ENV === 'production') {
        // Em produção, enviar para SIEM/sistemas de monitoramento
        await this.sendToSIEM(securityEvent);
        
        // Log crítico no console sempre
        if (level === SecurityEventLevel.CRITICAL || actionRequired) {
          console.error(`🚨 SECURITY ALERT: ${formattedEvent}`);
        } else {
          console.log(`🔒 SECURITY LOG: ${formattedEvent}`);
        }
      } else {
        // Em desenvolvimento, log detalhado no console
        const emoji = this.getEmojiForLevel(level);
        console.log(`${emoji} SECURITY [${category}]: ${message}`, {
          event: securityEvent.event,
          risk_score: riskScore,
          client_ip: clientInfo.ip,
          context
        });
      }

      // Alertas automáticos para eventos críticos
      if (actionRequired) {
        await this.triggerSecurityAlert(securityEvent);
      }

    } catch (error) {
      // Nunca falhar silenciosamente em logging de segurança
      console.error('❌ Falha no sistema de logging de segurança:', error);
    }
  }

  private static getEmojiForLevel(level: SecurityEventLevel): string {
    switch (level) {
      case SecurityEventLevel.CRITICAL: return '🚨';
      case SecurityEventLevel.ERROR: return '❌';
      case SecurityEventLevel.WARNING: return '⚠️';
      case SecurityEventLevel.INFO: return '🔒';
      default: return '📝';
    }
  }

  private static async sendToSIEM(event: SecurityEvent): Promise<void> {
    // TODO: Integrar com sistemas de SIEM como Splunk, ELK, etc.
    if (process.env.SIEM_WEBHOOK_URL) {
      try {
        const response = await fetch(process.env.SIEM_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SIEM_TOKEN || ''}`,
          },
          body: JSON.stringify(event),
        });

        if (!response.ok) {
          console.error('Falha ao enviar evento para SIEM:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao enviar para SIEM:', error);
      }
    }
  }

  private static async triggerSecurityAlert(event: SecurityEvent): Promise<void> {
    try {
      // Alerta por email para eventos críticos
      if (process.env.SECURITY_ALERT_EMAIL) {
        // TODO: Implementar alerta por email usando EmailService
        console.log(`🚨 ALERTA DE SEGURANÇA CRÍTICO: ${event.message}`);
      }

      // Webhook para sistemas de monitoramento
      if (process.env.SECURITY_ALERT_WEBHOOK) {
        await fetch(process.env.SECURITY_ALERT_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            alert_type: 'security_incident',
            severity: event.level,
            risk_score: event.risk_score,
            event: event.event,
            message: event.message,
            client_ip: event.clientInfo.ip,
            timestamp: event.timestamp,
          }),
        });
      }
    } catch (error) {
      console.error('Falha ao enviar alerta de segurança:', error);
    }
  }

  // Métodos de conveniência para diferentes tipos de eventos
  static async logAuthenticationFailure(request: NextRequest, context: Record<string, any> = {}) {
    await this.logSecurityEvent(
      SecurityEventCategory.AUTHENTICATION,
      'AUTHENTICATION_FAILURE',
      'Falha na autenticação detectada',
      SecurityEventLevel.WARNING,
      request,
      context
    );
  }

  static async logCSRFViolation(request: NextRequest, context: Record<string, any> = {}) {
    await this.logSecurityEvent(
      SecurityEventCategory.CSRF_PROTECTION,
      'CSRF_TOKEN_INVALID',
      'Tentativa de bypass de proteção CSRF detectada',
      SecurityEventLevel.ERROR,
      request,
      context
    );
  }

  static async logRateLimitExceeded(request: NextRequest, context: Record<string, any> = {}) {
    await this.logSecurityEvent(
      SecurityEventCategory.RATE_LIMITING,
      'RATE_LIMIT_EXCEEDED',
      'Limite de requisições excedido',
      SecurityEventLevel.WARNING,
      request,
      context
    );
  }

  static async logSuspiciousActivity(request: NextRequest, context: Record<string, any> = {}) {
    await this.logSecurityEvent(
      SecurityEventCategory.SUSPICIOUS_ACTIVITY,
      'SUSPICIOUS_BEHAVIOR',
      'Atividade suspeita detectada',
      SecurityEventLevel.ERROR,
      request,
      context
    );
  }

  static async logSQLInjectionAttempt(request: NextRequest, context: Record<string, any> = {}) {
    await this.logSecurityEvent(
      SecurityEventCategory.SQL_INJECTION_ATTEMPT,
      'SQL_INJECTION_DETECTED',
      'Tentativa de SQL Injection detectada',
      SecurityEventLevel.CRITICAL,
      request,
      context
    );
  }

  static async logXSSAttempt(request: NextRequest, context: Record<string, any> = {}) {
    await this.logSecurityEvent(
      SecurityEventCategory.XSS_ATTEMPT,
      'XSS_PAYLOAD_DETECTED',
      'Tentativa de XSS detectada',
      SecurityEventLevel.CRITICAL,
      request,
      context
    );
  }

  // Limpeza periódica
  static startPeriodicCleanup(): void {
    setInterval(() => {
      LogRateLimiter.cleanup();
    }, 60000); // Limpeza a cada minuto
  }
}

// Auto-inicializar limpeza em ambientes de produção
if (process.env.NODE_ENV === 'production') {
  SecurityLogger.startPeriodicCleanup();
}

export { SecurityEventLevel, SecurityEventCategory };