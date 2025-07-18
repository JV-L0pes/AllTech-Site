 // src/lib/email-service.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
  private static readonly FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@alltechdigital.com';
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
      
      await resend.emails.send({
        to: salesRep.email,
        from: this.FROM_EMAIL,
        subject: `🚀 Novo Lead: ${leadData.name} - ${leadData.company || 'Pessoa Física'}`,
        html: emailContent.html,
        text: emailContent.text
      });
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
      
      await resend.emails.send({
        to: leadData.email,
        from: this.FROM_EMAIL,
        subject: `✅ Recebemos seu contato - AllTech Digital`,
        html: emailContent.html,
        text: emailContent.text
      });
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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2B7A94, #7FB865); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #2B7A94; }
          .priority { background: #ff6b6b; color: white; padding: 5px 10px; border-radius: 20px; font-size: 12px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="${this.BANNER_URL}" alt="AllTech Digital" style="width: 100%; display: block; border-radius: 8px 8px 0 0; margin-bottom: 0;" />
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
              <div style="background: white; padding: 15px; border-left: 4px solid #2B7A94; margin-top: 10px;">
                ${(leadData.message || '').replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="mailto:${leadData.email}?subject=Re: Seu contato na AllTech Digital" 
                 style="background: #2B7A94; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2B7A94, #7FB865); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .highlight { background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="${this.BANNER_URL}" alt="AllTech Digital" style="width: 100%; display: block; border-radius: 8px 8px 0 0; margin-bottom: 0;" />
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
            
            <div class="highlight">
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
            
            <p>Enquanto isso, você pode conhecer mais sobre nossas soluções em nosso site: <a href="https://alltechdigital.com">alltechdigital.com</a></p>
            
            <p>Atenciosamente,<br>
            <strong>Equipe AllTech Digital</strong></p>
          </div>
          
          <div class="footer">
            <p>Este email foi gerado automaticamente. Se precisar de algo urgente, responda este email.</p>
            <p>AllTech Digital - Inovação que respeita e conecta</p>
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

  // Verificar se Resend está configurado
  static isConfigured(): boolean {
    return !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
  }
}