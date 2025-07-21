// src/lib/email-service.ts - TEMPLATES CLEAN BASEADOS NO SERPSTAT
import sgMail from '@sendgrid/mail';
import type { ContactFormData as ValidatedContactFormData } from './validations';

// Configurar SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Interface local para compatibilidade
interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  cnpj?: string;
  numberOfEmployees?: string;
  state?: string;
  city?: string;
  serviceOfInterest?: string;
  message: string;
}

interface SalesRepresentative {
  name: string;
  email: string;
  region: string;
}

/**
 * Serviço de Email com Templates Clean - Inspirado no SerpStat
 * Design minimalista com cores da AllTech Digital
 */
export class EmailService {
  private static readonly FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@alltechbr.solutions';
  private static readonly COMPANY_NAME = 'AllTech Digital';

  // CSS Clean - Inspirado no SerpStat
  private static readonly CLEAN_STYLES = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        line-height: 1.6; 
        color: #374151;
        background: #f9fafb;
      }
      .container { 
        max-width: 600px; 
        margin: 0 auto; 
        background: #ffffff;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      .header { 
        background: linear-gradient(135deg, #06b6d4 0%, #1e40af 50%, #7c3aed 100%);
        padding: 24px;
        text-align: center;
      }
      .header-logo {
        color: #1f2937;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 8px;
      }
      .header-subtitle {
        color: #1f2937;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .content { 
        padding: 40px 32px;
        background: #ffffff;
      }
      .greeting {
        font-size: 28px;
        font-weight: bold;
        color: #1f2937;
        margin-bottom: 24px;
      }
      .text {
        font-size: 16px;
        color: #374151;
        margin-bottom: 16px;
        line-height: 1.6;
      }
      .highlight {
        color: #06b6d4;
        font-weight: 600;
      }
      .info-section {
        background: #f8fafc;
        border-left: 4px solid #06b6d4;
        padding: 20px;
        margin: 24px 0;
        border-radius: 0 8px 8px 0;
      }
      .info-title {
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 12px;
      }
      .info-item {
        margin-bottom: 8px;
        font-size: 15px;
        color: #4b5563;
      }
      .info-label {
        font-weight: 600;
        color: #374151;
        display: inline-block;
        min-width: 100px;
      }
      .message-box {
        background: #f3f4f6;
        padding: 20px;
        border-radius: 8px;
        margin: 24px 0;
        border-left: 4px solid #fbbf24;
      }
      .message-text {
        font-style: italic;
        color: #374151;
        line-height: 1.6;
      }
      .steps {
        margin: 32px 0;
      }
      .steps-title {
        font-size: 20px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 20px;
        text-align: center;
      }
      .step {
        display: flex;
        align-items: flex-start;
        margin-bottom: 12px;
        padding: 8px 0;
      }
      .step-bullet {
        background: #06b6d4;
        color: white;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 8px;
        margin-right: 12px;
        flex-shrink: 0;
        /* Novo: alinhar verticalmente ao centro do texto */
        margin-top: 6px;
      }
      .step-content h4 {
        font-size: 15px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 2px;
      }
      .step-content p {
        font-size: 13px;
        color: #6b7280;
      }
      .button {
        display: inline-block;
        background: #06b6d4;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        margin: 8px 8px 8px 0;
        transition: background-color 0.2s;
      }
      .button:hover {
        background: #0891b2;
      }
      .button-outline {
        background: transparent;
        color: #06b6d4;
        border: 2px solid #06b6d4;
      }
      .button-outline:hover {
        background: #06b6d4;
        color: white;
      }
      .consultant-card {
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 20px;
        margin: 24px 0;
      }
      .consultant-header {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
      }
      .consultant-avatar {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #4f46e5, #7c3aed);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 18px;
        margin-right: 16px;
        flex-shrink: 0;
      }
      .consultant-info h4 {
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 4px;
      }
      .consultant-info p {
        font-size: 14px;
        color: #6b7280;
      }
      .footer {
        background: #f9fafb;
        padding: 24px;
        text-align: center;
        border-top: 1px solid #e5e7eb;
      }
      .footer-text {
        font-size: 14px;
        color: #6b7280;
      }
      .footer-brand {
        font-weight: 600;
        color: #06b6d4;
      }
      @media (max-width: 600px) {
        .content { padding: 24px 20px; }
        .step { flex-direction: column; }
        .step-number { margin-bottom: 8px; margin-right: 0; }
        .consultant-header { flex-direction: column; text-align: center; }
        .consultant-avatar { margin-right: 0; margin-bottom: 12px; }
      }
    </style>
  `;

  /**
   * Enviar email para Sales Representative
   */
  static async sendToSalesRep(
    leadData: ContactFormData, 
    salesRep: SalesRepresentative,
    leadId: string
  ): Promise<boolean> {
    try {
      console.log(`📧 Enviando email para vendedor: ${salesRep.email}`);

      const html = this.generateSalesRepEmail(leadData, salesRep, leadId);
      
      const msg = {
        to: salesRep.email,
        from: { email: this.FROM_EMAIL, name: this.COMPANY_NAME },
        subject: `🚀 Novo Lead: ${leadData.name} - ${leadData.company || 'Pessoa Física'}`,
        html,
        text: this.generateSalesRepText(leadData, salesRep, leadId)
      };

      await sgMail.send(msg);
      console.log(`✅ Email enviado para vendedor: ${salesRep.email}`);
      return true;
    } catch (error) {
      console.error(`❌ Erro ao enviar email para vendedor:`, error);
      return false;
    }
  }

  /**
   * Enviar email para cliente
   */
  static async sendToClient(
    leadData: ContactFormData,
    salesRep: SalesRepresentative
  ): Promise<boolean> {
    try {
      console.log(`📧 Enviando confirmação para cliente: ${leadData.email}`);

      const html = this.generateClientEmail(leadData, salesRep);
      
      const msg = {
        to: leadData.email,
        from: { email: this.FROM_EMAIL, name: this.COMPANY_NAME },
        subject: `✅ Obrigado pelo contato, ${leadData.name.split(' ')[0]}! - AllTech Digital`,
        html,
        text: this.generateClientText(leadData, salesRep)
      };

      await sgMail.send(msg);
      console.log(`✅ Email enviado para cliente: ${leadData.email}`);
      return true;
    } catch (error) {
      console.error(`❌ Erro ao enviar confirmação para cliente:`, error);
      return false;
    }
  }

  /**
   * Email para Sales Rep - Estilo Clean
   */
  private static generateSalesRepEmail(leadData: ContactFormData, salesRep: SalesRepresentative, leadId: string): string {
    const firstName = leadData.name.split(' ')[0];
    const serviceIcon = this.getServiceIcon(leadData.serviceOfInterest);

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Novo Lead - AllTech Digital</title>
        ${this.CLEAN_STYLES}
      </head>
      <body>
        <div class="container">
          <!-- Header Clean -->
          <div class="header">
            <div class="header-logo" style="color: #1f2937; text-align: center;">AllTech Digital</div>
            <div class="header-subtitle">Sistema de Leads</div>
          </div>

          <!-- Content -->
          <div class="content">
            <h1 class="greeting">Novo Lead Recebido!</h1>
            
            <p class="text">
              Você tem um novo lead interessado em 
              <span class="highlight">${leadData.serviceOfInterest || 'nossos serviços'}</span>.
            </p>

            <!-- Lead Information -->
            <div class="info-section">
              <h3 class="info-title">📋 Informações do Lead</h3>
              <div class="info-item">
                <span class="info-label">Nome:</span> ${leadData.name}
              </div>
              <div class="info-item">
                <span class="info-label">Empresa:</span> ${leadData.company || 'Pessoa Física'}
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span> <a href="mailto:${leadData.email}" style="color: #06b6d4;">${leadData.email}</a>
              </div>
              ${leadData.phone ? `
              <div class="info-item">
                <span class="info-label">Telefone:</span> <a href="tel:${leadData.phone}" style="color: #06b6d4;">${leadData.phone}</a>
              </div>` : ''}
              ${leadData.state || leadData.city ? `
              <div class="info-item">
                <span class="info-label">Local:</span> ${[leadData.city, leadData.state].filter(Boolean).join(', ')}
              </div>` : ''}
              ${leadData.serviceOfInterest ? `
              <div class="info-item">
                <span class="info-label">Serviço:</span> ${serviceIcon} ${leadData.serviceOfInterest}
              </div>` : ''}
              ${leadData.numberOfEmployees ? `
              <div class="info-item">
                <span class="info-label">Funcionários:</span> ${leadData.numberOfEmployees}
              </div>` : ''}
              <div class="info-item">
                <span class="info-label">Lead ID:</span> ${leadId}
              </div>
            </div>

            ${leadData.message ? `
            <!-- Message -->
            <div class="message-box">
              <strong>💬 Mensagem do cliente:</strong>
              <div class="message-text">${leadData.message.replace(/\n/g, '<br>')}</div>
            </div>` : ''}

            <!-- Quick Actions -->
            <p class="text">Próximas ações recomendadas:</p>
            
            <a href="mailto:${leadData.email}?subject=Re: Seu interesse na AllTech Digital - ${leadData.serviceOfInterest || 'Soluções Microsoft'}&body=Olá ${firstName}!%0A%0ARecebemos seu contato sobre ${encodeURIComponent(leadData.serviceOfInterest || 'nossas soluções')} e ficamos muito felizes com seu interesse.%0A%0AVamos agendar uma conversa?" class="button">
              📧 Responder por Email
            </a>
            
            ${leadData.phone ? `
            <a href="https://wa.me/55${leadData.phone.replace(/\D/g, '')}?text=Olá ${firstName}! Recebemos seu contato sobre ${encodeURIComponent(leadData.serviceOfInterest || 'nossas soluções')}. Vamos conversar?" class="button button-outline">
              💬 WhatsApp
            </a>
            ` : ''}

            <!-- Lead Profile -->
            <div class="info-section">
              <h3 class="info-title">💡 Perfil do Lead</h3>
              <div class="info-item">
                <span class="info-label">Categoria:</span> ${this.getLeadProfile(leadData)}
              </div>
              <div class="info-item">
                <span class="info-label">Origem:</span> Formulário de contato do site
              </div>
              <div class="info-item">
                <span class="info-label">Data:</span> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">
              <span class="footer-brand">AllTech Digital</span> - Inovação que respeita e conecta<br>
              Este email foi gerado automaticamente pelo sistema
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Email para Cliente - Estilo Clean
   */
  private static generateClientEmail(leadData: ContactFormData, salesRep: SalesRepresentative): string {
    const firstName = leadData.name.split(' ')[0];

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Obrigado pelo contato - AllTech Digital</title>
        ${this.CLEAN_STYLES}
      </head>
      <body>
        <div class="container">
          <!-- Header Clean -->
          <div class="header">
            <div class="header-logo" style="color: white;">✅ AllTech Digital</div>
            <div class="header-subtitle" style="color: white;">Confirmação de Contato</div>
          </div>

          <!-- Content -->
          <div class="content">
            <h1 class="greeting">Olá, ${firstName}!</h1>
            
            <p class="text">
              Obrigado por entrar em contato sobre 
              <span class="highlight">${leadData.serviceOfInterest || 'nossas soluções Microsoft'}</span>.
            </p>

            <p class="text">
              Sua mensagem foi recebida e direcionada para nossa equipe especializada.
              Em breve você receberá uma resposta detalhada.
            </p>

            <!-- Next Steps -->
            <div class="steps">
              <h3 class="steps-title">🎯 Próximos Passos</h3>
              
              <div class="step">
                <div class="step-bullet"></div>
                <div class="step-content">
                  <h4>Análise do seu perfil</h4>
                  <p>Nossa equipe irá analisar suas necessidades específicas</p>
                </div>
              </div>

              <div class="step">
                <div class="step-bullet"></div>
                <div class="step-content">
                  <h4>Contato em até 24 horas</h4>
                  <p>Nosso consultor especializado entrará em contato para conversar</p>
                </div>
              </div>

              <div class="step">
                <div class="step-bullet"></div>
                <div class="step-content">
                  <h4>Diagnóstico gratuito</h4>
                  <p>Oferecemos análise completa da sua infraestrutura atual</p>
                </div>
              </div>

              <div class="step">
                <div class="step-bullet"></div>
                <div class="step-content">
                  <h4>Proposta personalizada</h4>
                  <p>Você receberá um roadmap detalhado com cronograma e valores</p>
                </div>
              </div>
            </div>

            <!-- Consultant Information -->
            <div class="consultant-card">
              <div class="consultant-header">
                <div class="consultant-info">
                  <h4>👤 Seu consultor responsável</h4>
                  <p>Especialista certificado Microsoft com experiência em projetos de migração</p>
                </div>
              </div>
              
              <div class="info-item">
                <span class="info-label">Nome:</span> ${salesRep.name}
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span> <a href="mailto:${salesRep.email}" style="color: #06b6d4;">${salesRep.email}</a>
              </div>
              <div class="info-item">
                <span class="info-label">Região:</span> ${salesRep.region}
              </div>
            </div>

            <!-- What to Expect -->
            <div class="info-section">
              <h3 class="info-title">🎯 O que esperar da AllTech Digital</h3>
              <div class="info-item">• Metodologia PDCA para migração segura</div>
              <div class="info-item">• Preservação de 100% dos seus dados</div>
              <div class="info-item">• Suporte completo durante todo o processo</div>
              <div class="info-item">• Equipe certificada Microsoft</div>
              <div class="info-item">• Zero downtime durante a migração</div>
              <div class="info-item">• Diagnóstico gratuito da infraestrutura</div>
            </div>

            <p class="text">
              Enquanto isso, fique à vontade para entrar em contato conosco pelo WhatsApp 
              <a href="https://wa.me/5512992367544" style="color: #06b6d4; font-weight: 600;">(12) 99236-7544</a> 
              se tiver alguma dúvida urgente.
            </p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p class="footer-text">
              <span class="footer-brand">AllTech Digital</span> - Inovação que respeita e conecta<br>
              Este email foi enviado automaticamente em resposta ao seu contato
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Versão texto para Sales Rep
   */
  private static generateSalesRepText(leadData: ContactFormData, salesRep: SalesRepresentative, leadId: string): string {
    return `
🚀 NOVO LEAD RECEBIDO - AllTech Digital

👤 ${leadData.name} (${leadData.company || 'Pessoa Física'})
🆔 Lead ID: ${leadId}

📧 Email: ${leadData.email}
${leadData.phone ? `📱 Telefone: ${leadData.phone}` : ''}
${leadData.state ? `📍 Local: ${[leadData.city, leadData.state].filter(Boolean).join(', ')}` : ''}
${leadData.serviceOfInterest ? `🎯 Serviço: ${leadData.serviceOfInterest}` : ''}
${leadData.numberOfEmployees ? `👥 Funcionários: ${leadData.numberOfEmployees}` : ''}

${leadData.message ? `💬 MENSAGEM:\n${leadData.message}\n` : ''}

💡 PERFIL: ${this.getLeadProfile(leadData)}
📅 DATA: ${new Date().toLocaleString('pt-BR')}

📞 AÇÕES RÁPIDAS:
• Email: ${leadData.email}
• WhatsApp: https://wa.me/5512992367544

---
AllTech Digital - Sistema Automático
    `;
  }

  /**
   * Versão texto para Cliente
   */
  private static generateClientText(leadData: ContactFormData, salesRep: SalesRepresentative): string {
    const firstName = leadData.name.split(' ')[0];
    return `
✅ MENSAGEM RECEBIDA - AllTech Digital

Olá ${firstName}!

Obrigado por entrar em contato sobre ${leadData.serviceOfInterest || 'nossas soluções Microsoft'}.

🎯 PRÓXIMOS PASSOS:
1. ✅ Análise do seu perfil
2. 📞 Contato em até 24 horas  
3. 🎁 Diagnóstico gratuito
4. 📋 Proposta personalizada

👤 SEU CONSULTOR:
${salesRep.name}
📧 ${salesRep.email}
🌎 ${salesRep.region}

🎯 O QUE ESPERAR:
• Metodologia PDCA para migração segura
• Preservação de 100% dos dados
• Suporte completo durante o processo
• Equipe certificada Microsoft
• Zero downtime durante migração

📱 WhatsApp: (12) 99236-7544

---
AllTech Digital - Inovação que respeita e conecta
    `;
  }

  // Helper Methods (sem classificação de prioridade)
  private static getServiceIcon(service?: string): string {
    const icons: { [key: string]: string } = {
      'Migração para Microsoft 365': '🔄',
      'Treinamentos Microsoft': '🎓',
      'Consultoria em Cloud': '☁️',
      'Automação de Processos': '🤖',
      'Diagnóstico Gratuito': '🔍',
      'Outros': '💼'
    };
    return icons[service || 'Outros'] || '💼';
  }

  private static getLeadProfile(leadData: ContactFormData): string {
    if (!leadData.company) return 'Pessoa Física';
    
    const employees = leadData.numberOfEmployees;
    if (!employees) return 'Empresa';
    
    const profiles: { [key: string]: string } = {
      '1-10': 'Micro empresa',
      '11-50': 'Pequena empresa', 
      '51-100': 'Média empresa',
      '101-500': 'Grande empresa',
      '500+': 'Enterprise'
    };
    
    return profiles[employees] || 'Empresa';
  }

  // Métodos de teste
  static isConfigured(): boolean {
    return !!(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL);
  }

  static async testConfiguration(): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured()) {
      return { success: false, message: 'SendGrid não configurado' };
    }

    try {
      const testMsg = {
        to: 'test-validation@sendgrid.com',
        from: { email: this.FROM_EMAIL, name: this.COMPANY_NAME },
        subject: 'Teste AllTech Digital - Templates Clean',
        html: '<p>Templates clean funcionando!</p>',
        text: 'Templates clean funcionando!'
      };

      await sgMail.send(testMsg);
      return { success: true, message: 'SendGrid funcionando com templates clean' };
    } catch (error: any) {
      return { success: false, message: `Erro: ${error.message}` };
    }
  }

  static async sendTestEmail(toEmail: string): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured()) return { success: false, message: 'SendGrid não configurado' };

    try {
      const testData: ContactFormData = {
        name: 'João Silva Santos',
        email: toEmail,
        company: 'Empresa Teste LTDA',
        phone: '(11) 99999-9999',
        state: 'SP',
        city: 'São Paulo',
        numberOfEmployees: '51-100',
        serviceOfInterest: 'Migração para Microsoft 365',
        message: 'Teste dos templates clean da AllTech Digital!'
      };

      const testSalesRep: SalesRepresentative = {
        name: 'João Rosa',
        email: 'joao.rosa@alltechbr.solutions',
        region: 'Nacional'
      };

      const success = await this.sendToClient(testData, testSalesRep);
      return {
        success,
        message: success ? `Email clean enviado para ${toEmail}` : 'Falha ao enviar'
      };
    } catch (error: any) {
      return { success: false, message: `Erro: ${error.message}` };
    }
  }
}