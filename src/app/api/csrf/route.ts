// src/app/api/csrf/route.ts - NOVA IMPLEMENTAÇÃO SEGURA
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHash, timingSafeEqual } from 'crypto';

// Classe para gerenciar tokens CSRF seguros
class CSRFService {
  private static readonly SECRET = process.env.CSRF_SECRET || this.generateSecret();
  private static readonly TOKEN_LENGTH = 32;
  private static readonly TOKEN_EXPIRY = 3600000; // 1 hora em ms

  private static generateSecret(): string {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CSRF_SECRET deve estar definida em produção');
    }
    return randomBytes(64).toString('hex');
  }

  // Gerar token CSRF criptograficamente seguro
  static generateToken(): { token: string; hash: string; expires: number } {
    const token = randomBytes(this.TOKEN_LENGTH).toString('hex');
    const expires = Date.now() + this.TOKEN_EXPIRY;
    
    // Hash do token + secret + timestamp para validação
    const hash = createHash('sha256')
      .update(token + this.SECRET + expires.toString())
      .digest('hex');

    return { token, hash, expires };
  }

  // Validar token CSRF com timing attack protection
  static validateToken(token: string, hash: string, expires: number): boolean {
    try {
      // Verificar expiração
      if (Date.now() > expires) {
        return false;
      }

      // Recriar hash esperado
      const expectedHash = createHash('sha256')
        .update(token + this.SECRET + expires.toString())
        .digest('hex');

      // Comparação segura contra timing attacks
      const tokenBuffer = Buffer.from(hash, 'hex');
      const expectedBuffer = Buffer.from(expectedHash, 'hex');

      if (tokenBuffer.length !== expectedBuffer.length) {
        return false;
      }

      return timingSafeEqual(tokenBuffer, expectedBuffer);
    } catch (error) {
      console.error('Erro na validação CSRF:', error);
      return false;
    }
  }

  // Limpar tokens expirados (implementar com Redis em produção)
  static cleanupExpiredTokens(): void {
    // TODO: Implementar limpeza em storage distribuído
    console.log('Limpeza de tokens expirados executada');
  }
}

// Endpoint para obter token CSRF
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { token, hash, expires } = CSRFService.generateToken();
    
    const response = NextResponse.json({
      success: true,
      csrfToken: token
    });

    // Configurar cookie seguro com hash e expiração
    response.cookies.set('__csrf_hash', hash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hora
      path: '/',
    });

    response.cookies.set('__csrf_expires', expires.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });

    // Headers de segurança adicionais
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

    return response;
  } catch (error) {
    console.error('Erro ao gerar token CSRF:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

// Middleware para validação CSRF
export class CSRFMiddleware {
  static async validateRequest(request: NextRequest): Promise<{
    valid: boolean;
    error?: string;
  }> {
    try {
      // Extrair token do header
      const token = request.headers.get('x-csrf-token');
      if (!token) {
        return { valid: false, error: 'Token CSRF ausente' };
      }

      // Extrair hash e expiração dos cookies
      const cookies = request.cookies;
      const hash = cookies.get('__csrf_hash')?.value;
      const expiresStr = cookies.get('__csrf_expires')?.value;

      if (!hash || !expiresStr) {
        return { valid: false, error: 'Dados CSRF ausentes nos cookies' };
      }

      const expires = parseInt(expiresStr);
      if (isNaN(expires)) {
        return { valid: false, error: 'Expiração CSRF inválida' };
      }

      // Validar token
      const isValid = CSRFService.validateToken(token, hash, expires);
      if (!isValid) {
        return { valid: false, error: 'Token CSRF inválido ou expirado' };
      }

      return { valid: true };
    } catch (error) {
      console.error('Erro na validação CSRF middleware:', error);
      return { valid: false, error: 'Erro interno de validação' };
    }
  }
}

export { CSRFService };