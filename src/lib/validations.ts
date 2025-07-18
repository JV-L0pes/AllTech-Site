// src/lib/validations.ts
import { z } from 'zod';

// Regex patterns mais robustos
const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const nameRegex = /^[a-zA-ZÀ-ÿ\u00C0-\u017F\s]+$/;

// Validador CNPJ mais robusto
function validateCNPJ(cnpj: string): boolean {
  if (!cnpj) return false;
  
  // Remove caracteres especiais
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
  
  if (cleanCNPJ.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais (CNPJ inválido)
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  let pos = 5;
  
  // Primeiro dígito verificador
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (digit !== parseInt(cleanCNPJ.charAt(12))) return false;
  
  // Segundo dígito verificador
  sum = 0;
  pos = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return digit === parseInt(cleanCNPJ.charAt(13));
}

// Validador de email mais rigoroso
const emailSchema = z
  .string()
  .email('Email inválido')
  .max(254, 'Email muito longo')
  .refine((email) => {
    // Verificações adicionais de segurança
    const domain = email.split('@')[1];
    return domain && !domain.includes('..') && !domain.startsWith('-') && !domain.endsWith('-');
  }, 'Formato de email inválido')
  .transform((email) => email.toLowerCase().trim());

// Estados brasileiros válidos
export const VALID_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

// Schema principal do formulário com validações melhoradas
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(10, 'Nome deve ter pelo menos 10 caracteres (nome e sobrenome)')
    .max(100, 'Nome muito longo')
    .regex(nameRegex, 'Nome deve conter apenas letras, espaços e acentos')
    .refine((name) => name.trim().split(' ').length >= 2, 'Digite nome e sobrenome')
    .transform((name) => name.trim().replace(/\s+/g, ' ')), // Normaliza espaços
  
  email: emailSchema,
  
  phone: z
    .string()
    .regex(phoneRegex, 'Formato inválido. Use: (11) 99999-9999')
    .optional()
    .or(z.literal(''))
    .transform((phone) => phone || undefined),
  
  company: z
    .string()
    .min(5, 'Nome da empresa deve ter pelo menos 5 caracteres')
    .max(100, 'Nome da empresa muito longo')
    .transform((company) => company.trim())
    .optional()
    .or(z.literal(''))
    .transform((company) => company || undefined),
  
  cnpj: z
    .string()
    .regex(cnpjRegex, 'CNPJ inválido. Formato: 00.000.000/0000-00')
    .refine(validateCNPJ, 'CNPJ inválido')
    .optional()
    .or(z.literal(''))
    .transform((cnpj) => cnpj || undefined),
  
  numberOfEmployees: z
    .string()
    .min(1, 'Número de funcionários é obrigatório')
    .optional()
    .or(z.literal(''))
    .transform((employees) => employees || undefined),
  
  state: z
    .string()
    .length(2, 'Estado deve ter 2 caracteres')
    .toUpperCase()
    .refine((state) => VALID_STATES.includes(state as any), 'Estado inválido')
    .optional()
    .or(z.literal(''))
    .transform((state) => state || undefined),
  
  city: z
    .string()
    .min(3, 'Nome da cidade deve ter pelo menos 3 caracteres')
    .max(50, 'Nome da cidade muito longo')
    .transform((city) => city.trim())
    .optional()
    .or(z.literal(''))
    .transform((city) => city || undefined),
  
  serviceOfInterest: z
    .enum([
      'Implementação de Software',
      'Treinamentos Microsoft', 
      'Cloud Service',
      'Inteligência Artificial',
      'Diagnóstico Gratuito',
      'Outros'
    ])
    .optional()
    .or(z.literal(''))
    .transform((service) => service || undefined),
  
  message: z
    .string()
    .min(20, 'Mensagem deve ter pelo menos 20 caracteres (seja mais específico)')
    .max(1000, 'Mensagem muito longa')
    .transform((message) => message.trim())
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Schema para validação simplificada (quando alguns campos são opcionais)
export const contactFormSchemaSimplified = z.object({
  name: contactFormSchema.shape.name,
  email: contactFormSchema.shape.email,
  message: contactFormSchema.shape.message,
  company: contactFormSchema.shape.company,
  phone: contactFormSchema.shape.phone,
  serviceOfInterest: contactFormSchema.shape.serviceOfInterest
});

export type ContactFormDataSimplified = z.infer<typeof contactFormSchemaSimplified>;

// Schema para resposta da API
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  salesRepresentative: z.object({
    name: z.string(),
    email: z.string(),
    region: z.string()
  }).optional(),
  errors: z.array(z.any()).optional()
});

// Utilitários de formatação
export class FormatterUtils {
  static formatCNPJ(value: string): string {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }
    return value;
  }

  static formatPhone(value: string): string {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (numbers.length === 10) {
      return numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }
    return value;
  }

  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/\s+/g, ' ') // Normaliza espaços múltiplos
      .replace(/[<>\"'&]/g, ''); // Remove caracteres potencialmente perigosos
  }

  static formatName(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase()) // Capitaliza primeira letra de cada palavra
      .replace(/\s+/g, ' '); // Normaliza espaços
  }
}

// Validador de segurança adicional
export class SecurityValidator {
  private static readonly SUSPICIOUS_PATTERNS = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /data:text\/html/i
  ];

  static isSuspiciousContent(content: string): boolean {
    return this.SUSPICIOUS_PATTERNS.some(pattern => pattern.test(content));
  }

  static validateFormSecurity(data: ContactFormData): string[] {
    const issues: string[] = [];
    
    // Verificar conteúdo suspeito em campos de texto
    const textFields = [data.name, data.company, data.message];
    textFields.forEach((field, index) => {
      if (field && this.isSuspiciousContent(field)) {
        const fieldNames = ['nome', 'empresa', 'mensagem'];
        issues.push(`Conteúdo suspeito detectado no campo ${fieldNames[index]}`);
      }
    });

    // Verificar se email parece ser real
    if (data.email && (data.email.includes('test') || data.email.includes('example'))) {
      issues.push('Email parece ser de teste');
    }

    return issues;
  }
}

// Validador de negócio
export class BusinessValidator {
  static validateBusinessRules(data: ContactFormData): string[] {
    const issues: string[] = [];

    // Se forneceu CNPJ, deve fornecer empresa
    if (data.cnpj && !data.company) {
      issues.push('Empresa é obrigatória quando CNPJ é fornecido');
    }

    // Se forneceu estado, deve fornecer cidade
    if (data.state && !data.city) {
      issues.push('Cidade é obrigatória quando estado é fornecido');
    }

    // Validar combinação de campos opcionais
    const hasContactInfo = data.phone || data.email;
    if (!hasContactInfo) {
      issues.push('Pelo menos telefone ou email deve ser fornecido');
    }

    return issues;
  }
}

// Função de validação completa
export function validateContactForm(data: unknown): { 
  success: boolean; 
  data?: ContactFormData; 
  errors?: string[] 
} {
  try {
    // 1. Validação de schema básica
    const validatedData = contactFormSchema.parse(data);
    
    // 2. Validação de segurança
    const securityIssues = SecurityValidator.validateFormSecurity(validatedData);
    if (securityIssues.length > 0) {
      return { success: false, errors: securityIssues };
    }
    
    // 3. Validação de regras de negócio
    const businessIssues = BusinessValidator.validateBusinessRules(validatedData);
    if (businessIssues.length > 0) {
      return { success: false, errors: businessIssues };
    }
    
    return { success: true, data: validatedData };
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(issue => issue.message);
      return { success: false, errors };
    }
    
    return { success: false, errors: ['Erro de validação desconhecido'] };
  }
}