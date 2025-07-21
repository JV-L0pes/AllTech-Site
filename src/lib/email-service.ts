// src/lib/email-service.ts - VERSÃO MODERNIZADA 2025 - REBUILD COMPLETO
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
 * Serviço de Email Modernizado - Design Premium 2025
 * Aplicando princípios de Clean Code e DDD
 */
export class EmailService {
  private static readonly FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@alltechbr.solutions';
  private static readonly COMPANY_NAME = 'AllTech Digital';
  
  // Brand Colors - Consistentes com o site
  private static readonly BRAND_COLORS = {
    primary: '#06b6d4',      // tech-cyan
    secondary: '#0ea5e9',    // tech-electric  
    accent: '#1e40af',       // tech-deep
    success: '#10b981',      // green-500
    warning: '#f59e0b',      // amber-500
    dark: '#1e293b',         // slate-800
    light: '#f8fafc'         // slate-50
  };

  /**
   * Enviar email moderno para Sales Representative
   */
  static async sendToSalesRep(
    leadData: ContactFormData, 
    salesRep: SalesRepresentative,
    leadId: string
  ): Promise<boolean> {
    try {
      console.log(`📧 Enviando email moderno para vendedor: ${salesRep.email}`);

      const emailContent = this.generateModernSalesRepEmail(leadData, salesRep, leadId);
      
      const msg = {
        to: salesRep.email,
        from: {
          email: this.FROM_EMAIL,
          name: this.COMPANY_NAME
        },
        subject: `🚀 Novo Lead: ${leadData.name} - ${leadData.company || 'Pessoa Física'}`,
        html: emailContent.html,
        text: emailContent.text
      };

      await sgMail.send(msg);
      console.log(`✅ Email moderno enviado para vendedor: ${salesRep.email}`);
      return true;

    } catch (error) {
      console.error(`❌ Erro ao enviar email para vendedor:`, error);
      return false;
    }
  }

  /**
   * Enviar email premium para cliente
   */
  static async sendToClient(
    leadData: ContactFormData,
    salesRep: SalesRepresentative
  ): Promise<boolean> {
    try {
      console.log(`📧 Enviando confirmação premium para cliente: ${leadData.email}`);

      const emailContent = this.generatePremiumClientEmail(leadData, salesRep);
      
      const msg = {
        to: leadData.email,
        from: {
          email: this.FROM_EMAIL,
          name: this.COMPANY_NAME
        },
        subject: `✅ Obrigado pelo contato, ${leadData.name.split(' ')[0]}! - AllTech Digital`,
        html: emailContent.html,
        text: emailContent.text
      };

      await sgMail.send(msg);
      console.log(`✅ Email premium enviado para cliente: ${leadData.email}`);
      return true;

    } catch (error) {
      console.error(`❌ Erro ao enviar confirmação para cliente:`, error);
      return false;
    }
  }

  /**
   * Gera email moderno para Sales Rep - SIMPLIFICADO SEM URGÊNCIA
   */
  private static generateModernSalesRepEmail(
    leadData: ContactFormData, 
    salesRep: SalesRepresentative,
    leadId: string
  ) {
    const firstName = leadData.name.split(' ')[0];
    const serviceIcon = this.getServiceIcon(leadData.serviceOfInterest);

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Novo Lead - AllTech Digital</title>
        <style>
          /* Reset e Base */
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6; 
            color: #1e293b; 
            background: #f8fafc;
          }
          
          /* Container Principal */
          .email-container { 
            max-width: 680px; 
            margin: 0 auto; 
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }
          
          /* Header Moderno */
          .header {
            background: linear-gradient(135deg, ${this.BRAND_COLORS.primary} 0%, ${this.BRAND_COLORS.secondary} 50%, ${this.BRAND_COLORS.accent} 100%);
            padding: 40px 24px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.3;
          }
          
          .header-content { position: relative; z-index: 1; }
          
          .logo { 
            width: 80px; 
            height: 80px; 
            background: rgba(255,255,255,0.2);
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            margin-bottom: 20px;
            backdrop-filter: blur(10px);
          }
          
          .header h1 { 
            color: white; 
            font-size: 32px; 
            font-weight: 700; 
            margin-bottom: 12px;
            text-shadow: 0 4px 6px rgba(0,0,0,0.3);
          }
          
          .header .subtitle { 
            color: rgba(255,255,255,0.95); 
            font-size: 18px; 
            font-weight: 500;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          /* Content */
          .content { padding: 40px 24px; }
          
          /* Lead Info */
          .lead-info {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 32px;
            border-left: 6px solid ${this.BRAND_COLORS.primary};
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          
          .lead-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
          }
          
          .lead-avatar {
            width: 64px;
            height: 64px;
            background: ${this.BRAND_COLORS.primary};
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: 700;
            box-shadow: 0 4px 6px -1px rgba(6, 182, 212, 0.3);
          }
          
          .lead-name {
            font-size: 24px;
            font-weight: 700;
            color: #1e293b;
            margin: 0;
          }
          
          .lead-company {
            font-size: 16px;
            color: #64748b;
            margin: 4px 0 0 0;
          }
          
          .lead-id {
            font-size: 13px;
            color: #64748b;
            background: #e2e8f0;
            padding: 6px 12px;
            border-radius: 6px;
            margin-left: auto;
            font-weight: 600;
          }
          
          /* Info Grid */
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin: 32px 0;
          }
          
          .info-card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            border: 2px solid #e2e8f0;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
          .info-card:hover {
            border-color: ${this.BRAND_COLORS.primary};
            transform: translateY(-2px);
            box-shadow: 0 8px 25px -8px rgba(6, 182, 212, 0.3);
          }
          
          .info-label {
            font-size: 13px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            font-weight: 700;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .info-value {
            font-size: 17px;
            color: #1e293b;
            font-weight: 600;
            line-height: 1.4;
          }
          
          .info-value a {
            color: ${this.BRAND_COLORS.primary};
            text-decoration: none;
          }
          
          /* Message Box */
          .message-box {
            background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%);
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 32px;
            margin: 32px 0;
            position: relative;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.06);
          }
          
          .message-box::before {
            content: '"';
            position: absolute;
            top: -15px;
            left: 24px;
            font-size: 56px;
            color: ${this.BRAND_COLORS.primary};
            font-weight: 700;
            background: white;
            padding: 0 12px;
            line-height: 1;
          }
          
          .message-text {
            font-size: 17px;
            line-height: 1.7;
            color: #374151;
            font-style: italic;
          }
          
          /* Action Buttons */
          .actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
            margin: 40px 0;
          }
          
          .btn {
            display: inline-block;
            padding: 18px 28px;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
            text-align: center;
            transition: all 0.3s ease;
            font-size: 16px;
          }
          
          .btn-primary {
            background: linear-gradient(135deg, ${this.BRAND_COLORS.primary} 0%, ${this.BRAND_COLORS.secondary} 100%);
            color: white;
            box-shadow: 0 4px 6px -1px rgba(6, 182, 212, 0.3);
          }
          
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 15px -3px rgba(6, 182, 212, 0.4);
          }
          
          .btn-secondary {
            background: white;
            color: ${this.BRAND_COLORS.primary};
            border: 2px solid ${this.BRAND_COLORS.primary};
            box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
          .btn-secondary:hover {
            background: ${this.BRAND_COLORS.primary};
            color: white;
            transform: translateY(-2px);
          }
          
          /* Insights Box */
          .insights-box {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-radius: 16px;
            padding: 24px;
            margin: 32px 0;
            border-left: 6px solid ${this.BRAND_COLORS.warning};
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.06);
          }
          
          .insights-title {
            color: #92400e;
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .insights-content {
            color: #92400e;
            margin: 0;
            padding-left: 20px;
          }
          
          .insights-content li {
            margin-bottom: 8px;
            line-height: 1.5;
          }
          
          /* Footer */
          .footer {
            background: #f8fafc;
            padding: 32px 24px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          
          .footer-content {
            color: #64748b;
            font-size: 15px;
            line-height: 1.6;
          }
          
          .footer-tips {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
            border-left: 4px solid ${this.BRAND_COLORS.primary};
            box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
          /* Mobile Responsive */
          @media (max-width: 600px) {
            .email-container { margin: 0; border-radius: 0; }
            .header, .content { padding: 32px 20px; }
            .lead-info { padding: 24px; }
            .info-grid { grid-template-columns: 1fr; }
            .actions { grid-template-columns: 1fr; }
            .lead-header { flex-direction: column; text-align: center; }
            .lead-id { margin-left: 0; margin-top: 12px; }
            .message-box { padding: 24px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Header -->
          <div class="header">
            <div class="header-content">
              <div class="logo">🚀</div>
              <h1>Novo Lead Recebido</h1>
              <p class="subtitle">Sistema AllTech Digital</p>
            </div>
          </div>

          <!-- Content -->
          <div class="content">
            <!-- Lead Information -->
            <div class="lead-info">
              <div class="lead-header">
                <div class="lead-avatar">${firstName[0].toUpperCase()}</div>
                <div>
                  <h2 class="lead-name">${leadData.name}</h2>
                  <p class="lead-company">${leadData.company || 'Pessoa Física'}</p>
                </div>
                <div class="lead-id">ID: ${leadId}</div>
              </div>

              <!-- Info Grid -->
              <div class="info-grid">
                <div class="info-card">
                  <div class="info-label">📧 Email de Contato</div>
                  <div class="info-value">
                    <a href="mailto:${leadData.email}">${leadData.email}</a>
                  </div>
                </div>

                ${leadData.phone ? `
                <div class="info-card">
                  <div class="info-label">📱 Telefone</div>
                  <div class="info-value">
                    <a href="tel:${leadData.phone}">${leadData.phone}</a>
                  </div>
                </div>
                ` : ''}

                ${leadData.state ? `
                <div class="info-card">
                  <div class="info-label">📍 Localização</div>
                  <div class="info-value">${leadData.city || ''}, ${leadData.state}</div>
                </div>
                ` : ''}

                ${leadData.serviceOfInterest ? `
                <div class="info-card">
                  <div class="info-label">${serviceIcon} Serviço de Interesse</div>
                  <div class="info-value">${leadData.serviceOfInterest}</div>
                </div>
                ` : ''}

                ${leadData.numberOfEmployees ? `
                <div class="info-card">
                  <div class="info-label">👥 Número de Funcionários</div>
                  <div class="info-value">${leadData.numberOfEmployees}</div>
                </div>
                ` : ''}
              </div>
            </div>

            <!-- Message -->
            <div class="message-box">
              <div class="message-text">${(leadData.message || '').replace(/\n/g, '<br>')}</div>
            </div>

            <!-- Action Buttons -->
            <div class="actions">
              <a href="mailto:${leadData.email}?subject=Re: Seu interesse na AllTech Digital - ${leadData.serviceOfInterest || 'Soluções Microsoft'}" class="btn btn-primary">
                📧 Responder por Email
              </a>
              <a href="https://wa.me/5512992367544?text=Olá ${firstName}! Recebemos seu contato sobre ${leadData.serviceOfInterest || 'nossas soluções'}. Vamos conversar?" class="btn btn-secondary">
                💬 WhatsApp Direto
              </a>
            </div>

            <!-- Lead Insights -->
            <div class="insights-box">
              <h3 class="insights-title">
                💡 Informações do Lead
              </h3>
              <ul class="insights-content">
                <li><strong>Perfil:</strong> ${this.getLeadProfile(leadData)}</li>
                <li><strong>Origem:</strong> Formulário de contato do site</li>
                <li><strong>Tipo:</strong> ${leadData.company ? 'Lead empresarial' : 'Lead pessoa física'}</li>
              </ul>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-content">
              <p><strong>📋 Dados registrados no sistema AllTech Digital</strong></p>
              <div class="footer-tips">
                <p><strong>💡 Dica:</strong> ${this.getSalesTip(leadData)}</p>
              </div>
              <p style="margin-top: 20px; font-size: 13px;">
                Este email foi gerado automaticamente pelo sistema AllTech Digital<br>
                <strong>AllTech Digital</strong> - Inovação que respeita e conecta
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
🚀 NOVO LEAD RECEBIDO - AllTech Digital

👤 ${leadData.name} (${leadData.company || 'Pessoa Física'})
🆔 Lead ID: ${leadId}

📧 Email: ${leadData.email}
${leadData.phone ? `📱 Telefone: ${leadData.phone}` : ''}
${leadData.state ? `📍 Localização: ${leadData.city || ''}, ${leadData.state}` : ''}
${leadData.serviceOfInterest ? `${serviceIcon} Serviço: ${leadData.serviceOfInterest}` : ''}
${leadData.numberOfEmployees ? `👥 Funcionários: ${leadData.numberOfEmployees}` : ''}

💬 MENSAGEM:
${leadData.message}

💡 INFORMAÇÕES:
• Perfil: ${this.getLeadProfile(leadData)}
• Origem: Formulário de contato do site
• Tipo: ${leadData.company ? 'Lead empresarial' : 'Lead pessoa física'}

💡 DICA: ${this.getSalesTip(leadData)}

---
AllTech Digital - Sistema Automático
    `;

    return { html, text };
  }

  /**
   * Gera email premium para cliente
   */
  private static generatePremiumClientEmail(
    leadData: ContactFormData,
    salesRep: SalesRepresentative
  ) {
    const firstName = leadData.name.split(' ')[0];

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Obrigado pelo contato - AllTech Digital</title>
        <style>
          /* Estilos similares ao email do vendedor, mas focado no cliente */
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6; 
            color: #1e293b; 
            background: #f8fafc;
          }
          
          .email-container { 
            max-width: 680px; 
            margin: 0 auto; 
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          }
          
          .hero {
            background: linear-gradient(135deg, ${this.BRAND_COLORS.primary} 0%, ${this.BRAND_COLORS.secondary} 100%);
            padding: 48px 24px;
            text-align: center;
            color: white;
          }
          
          .success-icon {
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            margin-bottom: 24px;
            backdrop-filter: blur(10px);
          }
          
          .hero h1 { 
            font-size: 32px; 
            font-weight: 700; 
            margin-bottom: 12px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .content { padding: 40px 24px; }
          
          .timeline {
            background: #f8fafc;
            border-radius: 16px;
            padding: 32px 24px;
            margin: 32px 0;
          }
          
          .timeline-title {
            text-align: center;
            font-size: 24px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 32px;
          }
          
          .timeline-steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 24px;
          }
          
          .step {
            background: white;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            border: 2px solid #e2e8f0;
          }
          
          .step-number {
            width: 40px;
            height: 40px;
            background: ${this.BRAND_COLORS.primary};
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            margin: 0 auto 16px;
          }
          
          .consultant-card {
            background: white;
            border: 2px solid ${this.BRAND_COLORS.primary};
            border-radius: 16px;
            padding: 32px 24px;
            margin: 32px 0;
          }
          
          .footer {
            background: #1e293b;
            color: white;
            padding: 32px 24px;
            text-align: center;
          }
          
          @media (max-width: 600px) {
            .email-container { margin: 0; border-radius: 0; }
            .timeline-steps { grid-template-columns: 1fr; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <!-- Hero -->
          <div class="hero">
            <div class="success-icon">✅</div>
            <h1>Mensagem Recebida!</h1>
            <p>Obrigado por escolher a AllTech Digital</p>
            <p style="margin-top: 16px;"><strong>Olá, ${firstName}! 👋</strong></p>
          </div>

          <!-- Content -->
          <div class="content">
            <p style="font-size: 18px; margin-bottom: 24px; text-align: center;">
              Recebemos sua mensagem sobre <strong>${leadData.serviceOfInterest || 'nossas soluções Microsoft'}</strong> 
              e ficamos muito felizes com seu interesse!
            </p>

            <!-- Timeline -->
            <div class="timeline">
              <h2 class="timeline-title">🎯 Próximos Passos</h2>
              <div class="timeline-steps">
                <div class="step">
                  <div class="step-number">1</div>
                  <h3>Análise Recebida</h3>
                  <p>Sua mensagem foi direcionada para nossa equipe especializada</p>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <h3>Contato em 24h</h3>
                  <p>Nosso consultor entrará em contato para entender suas necessidades</p>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <h3>Diagnóstico Gratuito</h3>
                  <p>Oferecemos análise completa da sua infraestrutura</p>
                </div>
                <div class="step">
                  <div class="step-number">4</div>
                  <h3>Proposta Personalizada</h3>
                  <p>Receba roadmap completo com cronograma</p>
                </div>
              </div>
            </div>

            <!-- Consultant Card -->
            <div class="consultant-card">
              <h3>👤 Seu Consultor Responsável</h3>
              <h4 style="margin: 16px 0 8px 0;">${salesRep.name}</h4>
              <p>📧 ${salesRep.email}</p>
              <p>🌎 Região: ${salesRep.region}</p>
              <p style="margin-top: 16px;">
                Especialista certificado Microsoft com experiência em projetos de migração.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <h3>AllTech Digital</h3>
            <p style="margin: 16px 0;">Inovação que respeita e conecta</p>
            <p style="font-size: 12px;">© 2025 AllTech Digital - Sistema Automático</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
✅ MENSAGEM RECEBIDA COM SUCESSO!

Olá ${firstName}!

Recebemos sua mensagem sobre ${leadData.serviceOfInterest || 'nossas soluções Microsoft'}!

🎯 PRÓXIMOS PASSOS:
1. ✅ Análise Recebida
2. 📞 Contato em 24h  
3. 🎁 Diagnóstico Gratuito
4. 📋 Proposta Personalizada

👤 SEU CONSULTOR:
${salesRep.name}
📧 ${salesRep.email}
🌎 Região: ${salesRep.region}

---
AllTech Digital - Inovação que respeita e conecta
    `;

    return { html, text };
  }

  // Helper Methods
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
    if (!leadData.company) return 'Pessoa Física - Potencial consultor independente';
    
    const employees = leadData.numberOfEmployees;
    if (!employees || employees.trim() === '') return 'Empresa (tamanho não informado)';
    
    const profiles: { [key: string]: string } = {
      '1-10': 'Micro empresa - Ideal para Microsoft 365 Basic',
      '11-50': 'Pequena empresa - Perfect fit para nossos serviços',
      '51-100': 'Média empresa - Alto potencial de migração complexa',
      '101-500': 'Grande empresa - Projeto estratégico de alta complexidade',
      '500+': 'Enterprise - Necessita consultoria especializada'
    };
    
    return profiles[employees] || 'Empresa (perfil a definir)';
  }

  private static getSalesTip(leadData: ContactFormData): string {
    const tips = [
      'Foque na segurança e continuidade do negócio durante a conversa',
      'Destaque cases similares ao perfil do cliente para gerar confiança',
      'Ofereça o diagnóstico gratuito como primeiro passo sem compromisso',
      'Mencione a metodologia PDCA e garantia de zero downtime',
      'Enfatize as certificações Microsoft da equipe para credibilidade'
    ];
    
    if (leadData.serviceOfInterest === 'Migração para Microsoft 365') {
      return 'Cliente interessado em migração - focar em cases de sucesso e garantias de preservação total dos dados';
    }
    
    if (leadData.company && leadData.numberOfEmployees) {
      return 'Lead empresarial qualificado - agendar demo personalizada e apresentar ROI esperado';
    }
    
    return tips[Math.floor(Math.random() * tips.length)];
  }

  // Métodos de verificação e teste
  static isConfigured(): boolean {
    return !!(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL);
  }

  static async testConfiguration(): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'SendGrid não configurado. Verifique SENDGRID_API_KEY e SENDGRID_FROM_EMAIL no .env.local'
      };
    }

    try {
      const testMsg = {
        to: 'test-validation@sendgrid.com',
        from: {
          email: this.FROM_EMAIL,
          name: this.COMPANY_NAME
        },
        subject: 'Teste de Configuração AllTech Digital - Design Moderno',
        html: '<p>Este é um teste da nova versão modernizada do sistema de emails</p>',
        text: 'Este é um teste da nova versão modernizada do sistema de emails'
      };

      await sgMail.send(testMsg);
      
      return {
        success: true,
        message: 'SendGrid configurado e funcionando com design modernizado'
      };
      
    } catch (error: any) {
      if (error.code === 400 && error.response?.body?.errors) {
        const errorMessage = error.response.body.errors[0]?.message || '';
        if (errorMessage.includes('does not contain a valid address')) {
          return {
            success: true,
            message: 'SendGrid configurado corretamente (API key válida) - Design modernizado aplicado'
          };
        }
      }
      
      console.error('❌ Erro no teste do SendGrid:', error);
      return {
        success: false,
        message: `Erro na configuração do SendGrid: ${error.message || 'Erro desconhecido'}`
      };
    }
  }

  static async sendTestEmail(toEmail: string): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'SendGrid não configurado'
      };
    }

    try {
      const testData: ContactFormData = {
        name: 'João Silva Santos',
        email: toEmail,
        company: 'Empresa Teste LTDA',
        phone: '(11) 99999-9999',
        state: 'SP',
        city: 'São Paulo',
        serviceOfInterest: 'Migração para Microsoft 365',
        message: 'Este é um teste do novo design premium dos emails da AllTech Digital. O layout está muito mais moderno e profissional!'
      };

      const testSalesRep: SalesRepresentative = {
        name: 'João Rosa',
        email: 'joao.rosa@alltechbr.solutions',
        region: 'Nacional'
      };

      // Enviar email de teste com design moderno
      const success = await this.sendToClient(testData, testSalesRep);
      
      return {
        success,
        message: success 
          ? `Email modernizado enviado para ${toEmail}` 
          : 'Falha ao enviar email de teste'
      };
      
    } catch (error: any) {
      console.error('❌ Erro ao enviar email de teste:', error);
      return {
        success: false,
        message: `Erro ao enviar email de teste: ${error.message || 'Erro desconhecido'}`
      };
    }
  }
}