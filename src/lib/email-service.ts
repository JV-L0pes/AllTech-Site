// src/lib/email-service.ts
import sgMail from '@sendgrid/mail';

// Configurar SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
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

export class EmailService {
  private static readonly FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@alltechdigital.com';
  private static readonly COMPANY_NAME = 'AllTech Digital';
  private static readonly BANNER_URL = 'https://i.imgur.com/0wQF5Qy.jpeg';

  // Enviar email para o vendedor (chefe)
  static async sendToSalesRep(
    leadData: ContactFormData, 
    salesRep: SalesRepresentative,
    leadId: string
  ): Promise<boolean> {
    try {
      console.log(`📧 Enviando email para vendedor: ${salesRep.email}`);

      const emailContent = this.generateSalesRepEmail(leadData, leadId);
      
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
      console.log(`✅ Email enviado para vendedor: ${salesRep.email}`);
      return true;

    } catch (error) {
      console.error(`❌ Erro ao enviar email para vendedor:`, error);
      return false;
    }
  }

  // Enviar email de confirmação para o cliente
  static async sendToClient(
    leadData: ContactFormData,
    salesRep: SalesRepresentative
  ): Promise<boolean> {
    try {
      console.log(`📧 Enviando confirmação para cliente: ${leadData.email}`);

      const emailContent = this.generateClientEmail(leadData, salesRep);
      
      const msg = {
        to: leadData.email,
        from: {
          email: this.FROM_EMAIL,
          name: this.COMPANY_NAME
        },
        subject: `✅ Recebemos seu contato - AllTech Digital`,
        html: emailContent.html,
        text: emailContent.text
      };

      await sgMail.send(msg);
      console.log(`✅ Email de confirmação enviado para: ${leadData.email}`);
      return true;

    } catch (error) {
      console.error(`❌ Erro ao enviar confirmação para cliente:`, error);
      return false;
    }
  }

  // Gerar conteúdo do email para vendedor
  private static generateSalesRepEmail(leadData: ContactFormData, leadId: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 0; }
          .banner { width: 100%; display: block; border-radius: 8px 8px 0 0; margin-bottom: 0; }
          .header { background: linear-gradient(135deg, #2B7A94, #7FB865); color: white; padding: 20px; border-radius: 0 0 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #2B7A94; }
          .priority { background: #ff6b6b; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          .btn { background: #2B7A94; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; }
          .message-box { background: white; padding: 15px; border-left: 4px solid #2B7A94; margin-top: 10px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="${this.BANNER_URL}" alt="AllTech Digital" class="banner" />
          <div class="header">
            <h1>🚀 Novo Lead Recebido!</h1>
            <p><strong>ID do Lead:</strong> ${leadId}</p>
            <span class="priority">ALTA PRIORIDADE</span>
          </div>
          
          <div class="content">
            <div class="field">
              <span class="label">👤 Nome:</span> ${leadData.name}
            </div>
            
            <div class="field">
              <span class="label">📧 Email:</span> 
              <a href="mailto:${leadData.email}">${leadData.email}</a>
            </div>
            
            ${leadData.phone ? `
              <div class="field">
                <span class="label">📱 Telefone:</span> 
                <a href="tel:${leadData.phone}">${leadData.phone}</a>
              </div>
            ` : ''}
            
            ${leadData.company ? `
              <div class="field">
                <span class="label">🏢 Empresa:</span> ${leadData.company}
              </div>
            ` : ''}
            
            ${leadData.state ? `
              <div class="field">
                <span class="label">📍 Localização:</span> ${leadData.city || ''}, ${leadData.state}
              </div>
            ` : ''}
            
            ${leadData.serviceOfInterest ? `
              <div class="field">
                <span class="label">🎯 Serviço de Interesse:</span> ${leadData.serviceOfInterest}
              </div>
            ` : ''}
            
            <div class="field">
              <span class="label">💬 Mensagem:</span>
              <div class="message-box">
                ${(leadData.message || '').replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="mailto:${leadData.email}?subject=Re: Seu contato na AllTech Digital" class="btn">
                📧 Responder Cliente
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>⏰ Ação Recomendada:</strong> Entrar em contato em até 2 horas para maximizar conversão</p>
            <p>Este email foi gerado automaticamente pelo sistema AllTech Digital</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
🚀 NOVO LEAD RECEBIDO - ID: ${leadId}

👤 Nome: ${leadData.name}
📧 Email: ${leadData.email}
${leadData.phone ? `📱 Telefone: ${leadData.phone}` : ''}
${leadData.company ? `🏢 Empresa: ${leadData.company}` : ''}
${leadData.state ? `📍 Localização: ${leadData.city || ''}, ${leadData.state}` : ''}
${leadData.serviceOfInterest ? `🎯 Serviço: ${leadData.serviceOfInterest}` : ''}

💬 Mensagem:
${leadData.message}

⏰ AÇÃO RECOMENDADA: Entrar em contato em até 2 horas para maximizar conversão
    `;

    return { html, text };
  }

  // Gerar conteúdo do email para cliente
  private static generateClientEmail(leadData: ContactFormData, salesRep: SalesRepresentative) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 0; }
          .banner { width: 100%; display: block; border-radius: 8px 8px 0 0; margin-bottom: 0; }
          .header { background: linear-gradient(135deg, #2B7A94, #7FB865); color: white; padding: 20px; border-radius: 0 0 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .highlight { background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          .consultant-box { background: #fff; padding: 20px; border-radius: 8px; border: 2px solid #2B7A94; margin: 20px 0; }
          ul { padding-left: 20px; }
          li { margin: 8px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="${this.BANNER_URL}" alt="AllTech Digital" class="banner" />
          <div class="header">
            <h1>✅ Mensagem Recebida com Sucesso!</h1>
            <p>Obrigado por entrar em contato conosco</p>
          </div>
          
          <div class="content">
            <p>Olá <strong>${leadData.name}</strong>,</p>
            
            <p>Recebemos sua mensagem e ficamos muito felizes com seu interesse em nossas soluções tecnológicas!</p>
            
            <div class="highlight">
              <h3>🎯 Próximos Passos:</h3>
              <ul>
                <li>✅ Sua mensagem foi direcionada para nossa equipe especializada</li>
                <li>📞 Entraremos em contato em até <strong>24 horas</strong></li>
                <li>🎁 Você receberá um <strong>diagnóstico gratuito</strong> personalizado</li>
              </ul>
            </div>
            
            <div class="consultant-box">
              <h3>👤 Seu Consultor Responsável:</h3>
              <p><strong>${salesRep.name}</strong><br>
              📧 Email: <a href="mailto:${salesRep.email}">${salesRep.email}</a><br>
              🌎 Região: ${salesRep.region}</p>
            </div>
            
            <p><strong>🏆 Por que escolher a AllTech Digital?</strong></p>
            <ul>
              <li>✅ Parceiros Oficiais Microsoft Gold</li>
              <li>✅ +150 projetos entregues com sucesso</li>
              <li>✅ Suporte técnico especializado</li>
              <li>✅ Soluções personalizadas para sua empresa</li>
            </ul>
            
            <p>Enquanto isso, você pode conhecer mais sobre nossas soluções em nosso site: <a href="https://alltechdigital.com" style="color: #2B7A94; text-decoration: none; font-weight: bold;">alltechdigital.com</a></p>
            
            <p>Atenciosamente,<br>
            <strong>Equipe AllTech Digital</strong></p>
          </div>
          
          <div class="footer">
            <p>Este email foi gerado automaticamente. Se precisar de algo urgente, responda este email.</p>
            <p><strong>AllTech Digital</strong> - Inovação que respeita e conecta</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
✅ MENSAGEM RECEBIDA COM SUCESSO!

Olá ${leadData.name},

Recebemos sua mensagem e ficamos muito felizes com seu interesse em nossas soluções tecnológicas!

🎯 PRÓXIMOS PASSOS:
✅ Sua mensagem foi direcionada para nossa equipe especializada
📞 Entraremos em contato em até 24 horas
🎁 Você receberá um diagnóstico gratuito personalizado

👤 SEU CONSULTOR RESPONSÁVEL:
${salesRep.name}
📧 Email: ${salesRep.email}
🌎 Região: ${salesRep.region}

🏆 POR QUE ESCOLHER A ALLTECH DIGITAL?
✅ Parceiros Oficiais Microsoft Gold
✅ +150 projetos entregues com sucesso
✅ Suporte técnico especializado
✅ Soluções personalizadas para sua empresa

Atenciosamente,
Equipe AllTech Digital
    `;

    return { html, text };
  }

  // Verificar se SendGrid está configurado
  static isConfigured(): boolean {
    return !!(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL);
  }

  // Testar configuração do SendGrid
  static async testConfiguration(): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'SendGrid não configurado. Verifique SENDGRID_API_KEY e SENDGRID_FROM_EMAIL no .env.local'
      };
    }

    try {
      // Teste simples de validação da API key
      const testMsg = {
        to: 'test-validation@sendgrid.com', // Email específico para validação
        from: {
          email: this.FROM_EMAIL,
          name: this.COMPANY_NAME
        },
        subject: 'Teste de Configuração AllTech Digital',
        html: '<p>Este é um teste de configuração do SendGrid</p>',
        text: 'Este é um teste de configuração do SendGrid'
      };

      await sgMail.send(testMsg);
      
      return {
        success: true,
        message: 'SendGrid configurado e funcionando corretamente'
      };
      
    } catch (error: any) {
      // Verificar se é erro de email inválido (significa que API key está OK)
      if (error.code === 400 && error.response?.body?.errors) {
        const errorMessage = error.response.body.errors[0]?.message || '';
        if (errorMessage.includes('does not contain a valid address')) {
          return {
            success: true,
            message: 'SendGrid configurado corretamente (API key válida)'
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

  // Método para enviar email de teste
  static async sendTestEmail(toEmail: string): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'SendGrid não configurado'
      };
    }

    try {
      const msg = {
        to: toEmail,
        from: {
          email: this.FROM_EMAIL,
          name: this.COMPANY_NAME
        },
        subject: '🧪 Teste de Email - AllTech Digital',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2B7A94;">🧪 Teste de Email</h2>
            <p>Se você recebeu este email, significa que o SendGrid está configurado corretamente!</p>
            <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <p><strong>Sistema:</strong> AllTech Digital</p>
            <hr style="border: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">Este é um email de teste automático.</p>
          </div>
        `,
        text: `
🧪 TESTE DE EMAIL - AllTech Digital

Se você recebeu este email, significa que o SendGrid está configurado corretamente!

Data/Hora: ${new Date().toLocaleString('pt-BR')}
Sistema: AllTech Digital

Este é um email de teste automático.
        `
      };

      await sgMail.send(msg);
      
      return {
        success: true,
        message: `Email de teste enviado para ${toEmail}`
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