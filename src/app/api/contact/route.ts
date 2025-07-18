import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Database from '@/lib/database';
import { contactFormSchema } from '@/lib/validations';
import type { ContactFormResponse, SalesRepresentative } from '@/types/database';
import type { ContactFormData } from '@/lib/validations';

// Service para processamento do formulário
class ContactFormService {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async getSalesRepByState(state: string): Promise<SalesRepresentative | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM get_sales_rep_by_state($1)',
        [state]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar vendedor por estado:', error);
      return null;
    }
  }

  async getDefaultSalesRep(): Promise<SalesRepresentative> {
    const result = await this.db.query(`
      SELECT id, name, email, phone, region 
      FROM sales_representatives 
      WHERE region = 'Sudeste' 
      AND is_active = TRUE 
      LIMIT 1
    `);
    
    if (!result.rows[0]) {
      throw new Error('Nenhum vendedor padrão encontrado');
    }
    
    return result.rows[0];
  }

  async createOrUpdateCompany(data: ContactFormData): Promise<string> {
    const client = await this.db.getClient();
    try {
      // Verificar se empresa já existe
      let result = await client.query(
        'SELECT id FROM companies WHERE cnpj = $1',
        [data.cnpj]
      );

      if (result.rows.length > 0) {
        // Atualizar empresa existente
        await client.query(`
          UPDATE companies 
          SET name = $1, number_of_employees = $2, state = $3, city = $4, updated_at = CURRENT_TIMESTAMP
          WHERE cnpj = $5
        `, [data.company, data.numberOfEmployees, data.state, data.city, data.cnpj]);
        
        return result.rows[0].id;
      } else {
        // Criar nova empresa
        result = await client.query(`
          INSERT INTO companies (name, cnpj, number_of_employees, state, city)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id
        `, [data.company, data.cnpj, data.numberOfEmployees, data.state, data.city]);
        
        return result.rows[0].id;
      }
    } finally {
      client.release();
    }
  }

  async createOrUpdateContact(companyId: string, data: ContactFormData): Promise<string> {
    const client = await this.db.getClient();
    try {
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
        `, [data.name, data.phone, result.rows[0].id]);
        
        return result.rows[0].id;
      } else {
        // Criar novo contato
        result = await client.query(`
          INSERT INTO contacts (company_id, name, email, phone, is_primary)
          VALUES ($1, $2, $3, $4, TRUE)
          RETURNING id
        `, [companyId, data.name, data.email, data.phone]);
        
        return result.rows[0].id;
      }
    } finally {
      client.release();
    }
  }

  async createLead(
    companyId: string, 
    contactId: string, 
    salesRepId: string, 
    data: ContactFormData
  ): Promise<string> {
    const result = await this.db.query(`
      INSERT INTO leads (
        company_id, contact_id, sales_rep_id, service_of_interest, 
        message, status, source, priority
      )
      VALUES ($1, $2, $3, $4, $5, 'new', 'website_contact_form', 2)
      RETURNING id
    `, [companyId, contactId, salesRepId, data.serviceOfInterest, data.message]);
    
    return result.rows[0].id;
  }

  async recordInteraction(leadId: string, salesRepId: string): Promise<void> {
    try {
      await this.db.query(`
        INSERT INTO interactions (
          lead_id, sales_rep_id, interaction_type, subject, 
          description, interaction_date
        )
        VALUES ($1, $2, 'form_submission', 'Novo contato via site', 
                'Lead gerado através do formulário de contato do site', CURRENT_TIMESTAMP)
      `, [leadId, salesRepId]);
    } catch (error) {
      console.error('Erro ao registrar interação:', error);
      // Não falhar o processo principal
    }
  }

  async processContactForm(data: ContactFormData): Promise<SalesRepresentative> {
    const client = await this.db.getClient();
    try {
      await client.query('BEGIN');

      // 1. Determinar vendedor responsável
      const salesRep = await this.getSalesRepByState(data.state) || await this.getDefaultSalesRep();

      // 2. Criar/atualizar empresa
      const companyId = await this.createOrUpdateCompany(data);

      // 3. Criar/atualizar contato
      const contactId = await this.createOrUpdateContact(companyId, data);

      // 4. Criar lead
      const leadId = await this.createLead(companyId, contactId, salesRep.id, data);

      // 5. Registrar interação inicial
      await this.recordInteraction(leadId, salesRep.id);

      await client.query('COMMIT');
      
      console.log(`✅ Lead criado com sucesso - ID: ${leadId}, Vendedor: ${salesRep.name}`);
      
      return salesRep;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao processar formulário:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

// Handler da API
export async function POST(request: NextRequest) {
  try {
    console.log('📨 Recebendo solicitação de contato...');
    
    const body = await request.json();
    
    // Validar dados de entrada
    const validatedData = contactFormSchema.parse(body);
    console.log('✅ Dados validados para empresa:', validatedData.company);
    
    // Processar formulário
    const contactService = new ContactFormService();
    const salesRep = await contactService.processContactForm(validatedData);
    
    const response: ContactFormResponse = {
      success: true,
      message: 'Formulário enviado com sucesso',
      salesRepresentative: {
        name: salesRep.name,
        email: salesRep.email,
        region: salesRep.region
      }
    };
    
    console.log(`✅ Formulário processado - Vendedor: ${salesRep.name} (${salesRep.region})`);
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('❌ Erro no formulário de contato:', error);
    
    if (error instanceof z.ZodError) {
      const response: ContactFormResponse = {
        success: false,
        message: 'Dados inválidos',
        errors: error.issues
      };
      return NextResponse.json(response, { status: 400 });
    }
    
    const response: ContactFormResponse = {
      success: false,
      message: 'Erro interno do servidor'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

// Health check
export async function GET() {
  try {
    const db = Database.getInstance();
    await db.testConnection();
    
    return NextResponse.json({
      status: 'healthy',
      message: 'API e banco funcionando',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      message: 'Erro na conexão com banco',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 503 });
  }
}