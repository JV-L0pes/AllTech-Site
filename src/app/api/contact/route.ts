// src/app/api/contact/route.ts - SUBSTITUIR ARQUIVO COMPLETO
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Database from '@/lib/database';
import { contactFormSchema } from '@/lib/validations';
import { EmailService } from '@/lib/email-service';
import { SecurityService, withRateLimit, withSecurity } from '@/lib/security';
import type { ContactFormData } from '@/lib/validations';

// Domain Models
interface SalesRepresentative {
  id: string;
  name: string;
  email: string;
  region: string;
}

interface ContactFormResponse {
  success: boolean;
  message: string;
  salesRepresentative?: {
    name: string;
    email: string;
    region: string;
  };
  errors?: any[];
}

// Middleware de segurança CSRF
function withCSRFProtection(handler: Function) {
  return async (request: NextRequest, context: any) => {
    const methodsToProtect = ['POST', 'PUT', 'PATCH', 'DELETE'];
    
    if (!methodsToProtect.includes(request.method)) {
      return handler(request, context);
    }

    // Validar CSRF token
    const token = request.headers.get('x-csrf-token');
    const cookieHash = request.cookies.get('__csrf_hash')?.value;
    const cookieExpires = request.cookies.get('__csrf_expires')?.value;

    if (!token || !cookieHash || !cookieExpires) {
      console.log('🔒 CSRF validation failed - missing data:', {
        hasToken: !!token,
        hasCookieHash: !!cookieHash,
        hasCookieExpires: !!cookieExpires
      });

      return NextResponse.json({
        success: false,
        message: 'Falha na validação de segurança. Recarregue a página e tente novamente.',
        error: 'CSRF_VALIDATION_FAILED'
      }, { 
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
        }
      });
    }

    // Verificar se token não expirou
    const expires = parseInt(cookieExpires);
    if (Date.now() > expires) {
      console.log('🔒 CSRF token expired');
      
      return NextResponse.json({
        success: false,
        message: 'Token de segurança expirado. Recarregue a página.',
        error: 'CSRF_TOKEN_EXPIRED'
      }, { status: 403 });
    }

    return handler(request, context);
  };
}

// Domain Services
class SalesRepresentativeService {
  private static readonly DEFAULT_SALES_REP: SalesRepresentative = {
    id: 'default-001',
    name: 'João Rosa',
    email: 'joao.rosa@alltechbr.solutions',
    region: 'Nacional'
  };

  static getDefaultSalesRep(): SalesRepresentative {
    return { ...this.DEFAULT_SALES_REP };
  }

  static createSalesRepFromState(state: string): SalesRepresentative {
    const regionMap = new Map([
      ['SP', 'Sudeste'], ['RJ', 'Sudeste'], ['MG', 'Sudeste'], ['ES', 'Sudeste'],
      ['RS', 'Sul'], ['SC', 'Sul'], ['PR', 'Sul'],
      ['GO', 'Centro-Oeste'], ['MT', 'Centro-Oeste'], ['MS', 'Centro-Oeste'], ['DF', 'Centro-Oeste'],
    ]);

    const region = regionMap.get(state?.toUpperCase()) || 'Nacional';
    
    return {
      ...this.DEFAULT_SALES_REP,
      region
    };
  }
}

// Repository Interface
interface ILeadRepository {
  createLead(leadData: ContactFormData): Promise<{ leadId: string; salesRep: SalesRepresentative }>;
}

// Application Service
class ContactFormApplicationService {
  constructor(private leadRepository: ILeadRepository) {}

  async processContactForm(data: ContactFormData, request: NextRequest): Promise<{
    leadId: string;
    salesRep: SalesRepresentative;
  }> {
    console.log(`🔄 Processando formulário para: ${data.name} (${data.company || 'Pessoa Física'})`);
    
    // Log de segurança para auditoria
    console.log('🔒 CONTACT_FORM_SUBMISSION:', {
      name: data.name,
      email: data.email,
      company: data.company,
      state: data.state,
      serviceOfInterest: data.serviceOfInterest,
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });
    
    // Criar lead no repositório
    const result = await this.leadRepository.createLead(data);

    // Enviar emails de forma assíncrona
    this.sendEmails(data, result.salesRep, result.leadId).catch(error => {
      console.error('❌ Erro no envio de emails (não crítico):', error);
    });

    console.log(`✅ Lead criado com sucesso - ID: ${result.leadId}, Vendedor: ${result.salesRep.name} (${result.salesRep.region})`);
    
    return result;
  }

  private async sendEmails(
    leadData: ContactFormData, 
    salesRep: SalesRepresentative, 
    leadId: string
  ): Promise<void> {
    if (!EmailService.isConfigured()) {
      console.log('⚠️ Email não configurado, pulando envio');
      return;
    }

    try {
      console.log('📧 Iniciando envio de emails...');

      // Enviar para vendedor (chefe) - PRIORIDADE
      const salesEmailSent = await EmailService.sendToSalesRep(leadData, salesRep, leadId);
      if (salesEmailSent) {
        console.log(`✅ Email enviado para vendedor: ${salesRep.email}`);
      } else {
        console.error(`❌ Falha ao enviar email para vendedor: ${salesRep.email}`);
      }

      // Enviar confirmação para cliente
      const clientEmailSent = await EmailService.sendToClient(leadData, salesRep);
      if (clientEmailSent) {
        console.log(`✅ Confirmação enviada para cliente: ${leadData.email}`);
      } else {
        console.error(`❌ Falha ao enviar confirmação para cliente: ${leadData.email}`);
      }

    } catch (error) {
      console.error('❌ Erro geral no envio de emails:', error);
    }
  }
}

// Infrastructure - Database Repository
class DatabaseLeadRepository implements ILeadRepository {
  private db: Database;

  constructor() {
    console.log('🏗️ Inicializando DatabaseLeadRepository...');
    this.db = Database.getInstance();
  }

  async createLead(leadData: ContactFormData): Promise<{ leadId: string; salesRep: SalesRepresentative }> {
    console.log(`💾 Iniciando salvamento no banco para: ${leadData.name}`);
    
    // Verificar se banco está funcionando
    const isHealthy = await this.db.testConnection();
    if (!isHealthy) {
      throw new Error('Banco de dados indisponível. Tente novamente em alguns minutos.');
    }
    
    const client = await this.db.getClient();
    
    try {
      await client.query('BEGIN');
      console.log(`🔄 Transação iniciada`);

      // 1. Criar/atualizar empresa
      const companyId = await this.upsertCompany(client, leadData);
      console.log(`🏢 Empresa processada - ID: ${companyId}`);

      // 2. Criar/atualizar contato
      const contactId = await this.upsertContact(client, companyId, leadData);
      console.log(`👤 Contato processado - ID: ${contactId}`);

      // 3. Determinar vendedor responsável
      const salesRepResult = await this.getSalesRepresentative(client, leadData.state);
      console.log(`👔 Vendedor atribuído: ${salesRepResult.name} (${salesRepResult.region})`);

      // 4. Criar lead
      const leadId = await this.createLeadRecord(client, {
        companyId,
        contactId,
        salesRepId: salesRepResult.id,
        leadData
      });
      console.log(`📋 Lead criado - ID: ${leadId}`);

      // 5. Registrar interação inicial
      await this.createInteraction(client, leadId, salesRepResult.id);
      console.log(`💬 Interação inicial registrada`);

      await client.query('COMMIT');
      console.log(`✅ Transação confirmada com sucesso`);
      
      return {
        leadId,
        salesRep: salesRepResult
      };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`❌ Erro na transação, rollback executado:`, error);
      throw new Error(`Falha ao salvar no banco de dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      client.release();
      console.log(`🔓 Conexão liberada`);
    }
  }

  private async upsertCompany(client: any, data: ContactFormData): Promise<string> {
    const companyName = data.company || 'Pessoa Física';
    const cnpj = data.cnpj || null;
    const employees = data.numberOfEmployees || 'Não informado';
    const state = data.state || 'SP';
    const city = data.city || 'Não informada';

    if (cnpj) {
      // Verificar se empresa já existe pelo CNPJ
      let result = await client.query(
        'SELECT id FROM companies WHERE cnpj = $1',
        [cnpj]
      );

      if (result.rows.length > 0) {
        // Atualizar empresa existente
        await client.query(`
          UPDATE companies 
          SET name = $1, number_of_employees = $2, state = $3, city = $4, updated_at = CURRENT_TIMESTAMP
          WHERE cnpj = $5
        `, [companyName, employees, state, city, cnpj]);
        
        console.log(`🔄 Empresa atualizada: ${companyName}`);
        return result.rows[0].id;
      }
    }

    // Criar nova empresa
    const result = await client.query(`
      INSERT INTO companies (name, cnpj, number_of_employees, state, city)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [companyName, cnpj, employees, state, city]);
    
    console.log(`🆕 Nova empresa criada: ${companyName}`);
    return result.rows[0].id;
  }

  private async upsertContact(client: any, companyId: string, data: ContactFormData): Promise<string> {
    // Verificar se contato já existe
    let result = await client.query(
      'SELECT id FROM contacts WHERE company_id = $1 AND email = $2',
      [companyId, data.email]
    );

    if (result.rows.length > 0) {
      // Atualizar contato existente
      await client.query(`
        UPDATE contacts 
        SET name = $1, phone = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
      `, [data.name, data.phone || null, result.rows[0].id]);
      
      console.log(`🔄 Contato atualizado: ${data.name}`);
      return result.rows[0].id;
    }

    // Criar novo contato
    result = await client.query(`
      INSERT INTO contacts (company_id, name, email, phone, is_primary)
      VALUES ($1, $2, $3, $4, TRUE)
      RETURNING id
    `, [companyId, data.name, data.email, data.phone || null]);
    
    console.log(`🆕 Novo contato criado: ${data.name}`);
    return result.rows[0].id;
  }

  private async getSalesRepresentative(client: any, state?: string): Promise<SalesRepresentative> {
    try {
      // Buscar vendedor ativo
      const result = await client.query(`
        SELECT id, name, email, region 
        FROM sales_representatives 
        WHERE is_active = TRUE 
        LIMIT 1
      `);
      
      if (result.rows.length > 0) {
        const rep = result.rows[0];
        console.log(`✅ Vendedor encontrado: ${rep.name}`);
        return {
          id: rep.id,
          name: rep.name,
          email: rep.email,
          region: rep.region
        };
      }

      // Fallback para vendedor padrão
      console.log('⚠️ Nenhum vendedor no banco, usando padrão');
      return SalesRepresentativeService.createSalesRepFromState(state || '');
      
    } catch (error) {
      console.error(`❌ Erro ao buscar vendedor, usando padrão:`, error);
      return SalesRepresentativeService.createSalesRepFromState(state || '');
    }
  }

  private async createLeadRecord(client: any, params: {
    companyId: string;
    contactId: string;
    salesRepId: string;
    leadData: ContactFormData;
  }): Promise<string> {
    const { companyId, contactId, salesRepId, leadData } = params;

    const result = await client.query(`
      INSERT INTO leads (
        company_id, contact_id, sales_rep_id, service_of_interest, 
        message, status, source, priority
      )
      VALUES ($1, $2, $3, $4, $5, 'new', 'website_contact_form', 2)
      RETURNING id
    `, [
      companyId, 
      contactId, 
      salesRepId, 
      leadData.serviceOfInterest || 'Não especificado', 
      leadData.message
    ]);
    
    return result.rows[0].id;
  }

  private async createInteraction(client: any, leadId: string, salesRepId: string): Promise<void> {
    try {
      await client.query(`
        INSERT INTO interactions (
          lead_id, sales_rep_id, interaction_type, subject, 
          description, interaction_date
        )
        VALUES ($1, $2, 'form_submission', 'Novo contato via site', 
                'Lead gerado através do formulário de contato do site', CURRENT_TIMESTAMP)
      `, [leadId, salesRepId]);
      
      console.log(`💬 Interação registrada para lead: ${leadId}`);
    } catch (error) {
      console.warn(`⚠️ Erro ao registrar interação (não crítico):`, error);
    }
  }
}

// Factory Pattern
class ContactFormServiceFactory {
  static createContactFormService(): ContactFormApplicationService {
    const leadRepository = new DatabaseLeadRepository();
    return new ContactFormApplicationService(leadRepository);
  }
}

// API Handler
async function handlePOST(request: NextRequest) {
  try {
    console.log('📨 Recebendo solicitação de contato...');
    
    // Validação CORS básica
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      'http://localhost:3000',
      'https://localhost:3000',
      process.env.NEXT_PUBLIC_DOMAIN || '',
    ].filter(Boolean);

    if (origin && !allowedOrigins.includes(origin) && !origin.includes('ngrok')) {
      console.log('🚫 CORS violation:', origin);
      return NextResponse.json({
        success: false,
        message: 'Origem não autorizada'
      }, { status: 403 });
    }
    
    const body = await request.json();
    
    // DEBUG: Vamos ver o que está sendo enviado
    console.log('📋 Dados recebidos:', JSON.stringify(body, null, 2));
    
    // Validar dados de entrada
    const validatedData = contactFormSchema.parse(body);
    console.log('✅ Dados validados para:', validatedData.name, '-', validatedData.company || 'Pessoa Física');
    
    // Processar formulário
    const contactService = ContactFormServiceFactory.createContactFormService();
    const result = await contactService.processContactForm(validatedData, request);
    
    const response: ContactFormResponse = {
      success: true,
      message: 'Formulário enviado com sucesso! Entraremos em contato em breve.',
      salesRepresentative: {
        name: result.salesRep.name,
        email: result.salesRep.email,
        region: result.salesRep.region
      }
    };
    
    console.log(`✅ Formulário processado com sucesso - Lead: ${result.leadId}`);
    
    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Cache-Control': 'no-store',
        ...(origin ? { 'Access-Control-Allow-Origin': origin } : {})
      }
    });
    
  } catch (error) {
    console.error('❌ Erro no formulário de contato:', error);
    
    if (error instanceof z.ZodError) {
      const response: ContactFormResponse = {
        success: false,
        message: 'Dados inválidos. Verifique os campos e tente novamente.',
        errors: error.issues
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    const response: ContactFormResponse = {
      success: false,
      message: error instanceof Error 
        ? `Erro no sistema: ${error.message}` 
        : 'Erro interno do servidor. Tente novamente.'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// Health check
async function handleGET() {
  try {
    console.log('🔍 Executando health check...');
    
    const db = Database.getInstance();
    const isHealthy = await db.testConnection();
    
    if (isHealthy) {
      return NextResponse.json({
        status: 'healthy',
        message: 'Sistema funcionando',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    } else {
      return NextResponse.json({
        status: 'unhealthy',
        message: 'Problemas de conectividade'
      }, { status: 503 });
    }
    
  } catch (error) {
    console.error('❌ Health check falhou:', error);
    return NextResponse.json({
      status: 'critical',
      message: 'Falha crítica no sistema',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 503 });
  }
}

// Exportar handlers com proteções
export const POST = withCSRFProtection(withRateLimit(withSecurity(handlePOST)));
export const GET = handleGET;

// OPTIONS para CORS
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-CSRF-Token',
      'Access-Control-Max-Age': '86400',
    },
  });
}