// src/lib/validations.ts - VERSÃO CORRIGIDA
import { z } from 'zod';

// Regex patterns mais robustos
const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const nameRegex = /^[a-zA-ZÀ-ÿ\u00C0-\u017F\s]+$/;

/**
 * Validador CNPJ robusto
 * Aceita CNPJ vazio (opcional) ou CNPJ válido
 */
function validateCNPJ(cnpj: string): boolean {
  // Se vazio, é válido (campo opcional)
  if (!cnpj || cnpj.trim() === '') return true;
  
  // Remove formatação
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
  
  // Verifica tamanho
  if (cleanCNPJ.length !== 14) return false;
  
  // Rejeita CNPJs com todos os dígitos iguais
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;
  
  // Em desenvolvimento, aceitar alguns CNPJs de teste
  if (process.env.NODE_ENV === 'development') {
    const testCNPJs = [
      '99999999999999', // CNPJ de teste comum
      '12345678000195', // CNPJ de teste válido
      '11222333000181'  // Outro CNPJ de teste
    ];
    
    if (testCNPJs.includes(cleanCNPJ)) {
      console.log('⚠️ CNPJ de teste aceito em desenvolvimento:', cnpj);
      return true;
    }
  }
  
  // Rejeita CNPJs claramente falsos/sequenciais apenas em produção
  const invalidCNPJs = [
    '11111111111111',
    '22222222222222', 
    '33333333333333',
    '44444444444444',
    '55555555555555',
    '66666666666666',
    '77777777777777',
    '88888888888888',
    '00000000000000',
    '12345678901234'
  ];
  
  if (invalidCNPJs.includes(cleanCNPJ)) {
    return false;
  }
  
  try {
    // Algoritmo de validação do CNPJ
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
    
  } catch (error) {
    console.warn('Erro na validação do CNPJ:', error);
    return false;
  }
}

// Estados brasileiros válidos
export const VALID_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

// Serviços válidos
const VALID_SERVICES = [
  'Migração para Microsoft 365',
  'Treinamentos Microsoft', 
  'Consultoria em Cloud',
  'Automação de Processos',
  'Diagnóstico Gratuito',
  'Outros'
] as const;

/**
 * Schema principal de validação
 * Aplicando princípios DDD: Domain-driven validation
 */
export const contactFormSchema = z.object({
  // Dados pessoais obrigatórios
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(nameRegex, 'Nome deve conter apenas letras, espaços e acentos')
    .refine(
      (name) => name.trim().split(/\s+/).length >= 2, 
      'Digite nome e sobrenome completos'
    )
    .transform((name) => name.trim().replace(/\s+/g, ' ')),
  
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido')
    .max(254, 'Email muito longo')
    .refine(
      (email) => !email.includes('..') && !email.startsWith('.') && !email.endsWith('.'),
      'Formato de email inválido'
    )
    .transform((email) => email.toLowerCase().trim()),
  
  // Dados opcionais com validação condicional
  phone: z
    .string()
    .default('')
    .transform((phone) => phone?.trim() || '')
    .refine(
      (phone) => phone === '' || phoneRegex.test(phone),
      'Formato de telefone inválido. Use: (11) 99999-9999'
    ),
  
  company: z
    .string()
    .default('')
    .transform((company) => company?.trim() || '')
    .refine(
      (company) => company === '' || (company.length >= 2 && company.length <= 100),
      'Nome da empresa deve ter entre 2 e 100 caracteres'
    ),
  
  // CNPJ com validação simplificada mas robusta
  cnpj: z
    .string()
    .default('')
    .transform((cnpj) => cnpj?.trim() || '')
    .refine(
      (cnpj) => {
        // Se vazio, é válido
        if (cnpj === '') return true;
        
        // Se preenchido, deve ter formato correto
        if (!cnpjRegex.test(cnpj)) return false;
        
        // E deve passar na validação de dígitos
        return validateCNPJ(cnpj);
      },
      // Mensagem de erro contextual
      process.env.NODE_ENV === 'development' 
        ? 'CNPJ inválido. Para testes use: 11.222.333/0001-81 ou deixe em branco'
        : 'CNPJ inválido. Verifique os dígitos ou deixe em branco se não tiver empresa'
    ),
  
  numberOfEmployees: z
    .string()
    .default('')
    .transform((employees) => employees?.trim() || ''),
  
  state: z
    .string()
    .default('')
    .transform((state) => state?.trim().toUpperCase() || '')
    .refine(
      (state) => state === '' || (state.length === 2 && VALID_STATES.includes(state as any)),
      'Estado inválido'
    ),
  
  city: z
    .string()
    .default('')
    .transform((city) => city?.trim() || '')
    .refine(
      (city) => city === '' || (city.length >= 2 && city.length <= 50),
      'Nome da cidade deve ter entre 2 e 50 caracteres'
    ),
  
  serviceOfInterest: z
    .string()
    .default('')
    .transform((service) => service?.trim() || '')
    .refine(
      (service) => service === '' || VALID_SERVICES.includes(service as any),
      'Serviço de interesse inválido'
    ),
  
  // Mensagem obrigatória
  message: z
    .string()
    .min(1, 'Mensagem é obrigatória')
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(1000, 'Mensagem muito longa (máximo 1000 caracteres)')
    .transform((message) => message.trim())
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Schema simplificado para casos especiais
 */
export const contactFormSchemaSimplified = z.object({
  name: contactFormSchema.shape.name,
  email: contactFormSchema.shape.email,
  message: contactFormSchema.shape.message,
  company: contactFormSchema.shape.company,
  phone: contactFormSchema.shape.phone,
  serviceOfInterest: contactFormSchema.shape.serviceOfInterest
});

export type ContactFormDataSimplified = z.infer<typeof contactFormSchemaSimplified>;

/**
 * Schema para resposta da API
 */
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

/**
 * Utilitários de formatação
 * Aplicando Single Responsibility Principle
 */
export class FormatterUtils {
  static formatCNPJ(value: string): string {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 14) {
      // Aplicar máscara gradualmente conforme digita
      if (numbers.length <= 2) return numbers;
      if (numbers.length <= 5) return numbers.replace(/^(\d{2})(\d+)/, '$1.$2');
      if (numbers.length <= 8) return numbers.replace(/^(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
      if (numbers.length <= 12) return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
      if (numbers.length <= 14) return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, '$1.$2.$3/$4-$5');
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
    
    // Formatação progressiva enquanto digita
    if (numbers.length >= 2) {
      if (numbers.length <= 2) return `(${numbers}`;
      if (numbers.length <= 6) return `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
      if (numbers.length <= 10) return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
      if (numbers.length <= 11) return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
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

/**
 * Validador de segurança
 * Aplicando Security by Design
 */
export class SecurityValidator {
  private static readonly SUSPICIOUS_PATTERNS = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /data:text\/html/i,
    /eval\s*\(/i,
    /document\./i,
    /window\./i
  ];

  static isSuspiciousContent(content: string): boolean {
    return this.SUSPICIOUS_PATTERNS.some(pattern => pattern.test(content));
  }

  static validateFormSecurity(data: ContactFormData): string[] {
    const issues: string[] = [];
    
    // Verificar conteúdo suspeito em campos de texto
    const textFields = [
      { field: data.name, name: 'nome' },
      { field: data.company, name: 'empresa' },
      { field: data.message, name: 'mensagem' },
      { field: data.city, name: 'cidade' }
    ];
    
    textFields.forEach(({ field, name }) => {
      if (field && this.isSuspiciousContent(field)) {
        issues.push(`Conteúdo suspeito detectado no campo ${name}`);
      }
    });

    // Verificar se email parece ser real
    if (data.email && (
      data.email.includes('test') || 
      data.email.includes('example') ||
      data.email.includes('fake') ||
      data.email.includes('spam')
    )) {
      issues.push('Email parece ser de teste ou spam');
    }

    return issues;
  }
}

/**
 * Validador de regras de negócio
 * Aplicando Domain Rules
 */
export class BusinessValidator {
  static validateBusinessRules(data: ContactFormData): string[] {
    const issues: string[] = [];

    // Regra: Se forneceu CNPJ, deve fornecer empresa
    if (data.cnpj && data.cnpj.trim() !== '' && (!data.company || data.company.trim() === '')) {
      issues.push('Nome da empresa é obrigatório quando CNPJ é fornecido');
    }

    // Regra: Se forneceu estado, deve fornecer cidade
    if (data.state && data.state.trim() !== '' && (!data.city || data.city.trim() === '')) {
      issues.push('Cidade é obrigatória quando estado é fornecido');
    }

    // Regra: Verificar coerência dos dados empresariais
    if (data.company && data.company.trim() !== '' && data.numberOfEmployees === '') {
      // Apenas um aviso, não bloqueia o envio
      console.log('ℹ️ Empresa informada sem número de funcionários');
    }

    return issues;
  }
}

/**
 * Função principal de validação
 * Aplicando Facade Pattern para simplificar uso
 */
export function validateContactForm(data: unknown): { 
  success: boolean; 
  data?: ContactFormData; 
  errors?: string[] 
} {
  try {
    console.log('🔍 Iniciando validação dos dados do formulário...');
    
    // 1. Validação de schema (estrutura e tipos)
    const validatedData = contactFormSchema.parse(data);
    console.log('✅ Validação de schema passou');
    
    // 2. Validação de segurança
    const securityIssues = SecurityValidator.validateFormSecurity(validatedData);
    if (securityIssues.length > 0) {
      console.log('❌ Falha na validação de segurança:', securityIssues);
      return { success: false, errors: securityIssues };
    }
    console.log('✅ Validação de segurança passou');
    
    // 3. Validação de regras de negócio
    const businessIssues = BusinessValidator.validateBusinessRules(validatedData);
    if (businessIssues.length > 0) {
      console.log('❌ Falha nas regras de negócio:', businessIssues);
      return { success: false, errors: businessIssues };
    }
    console.log('✅ Validação de regras de negócio passou');
    
    console.log('🎉 Todas as validações passaram com sucesso');
    return { success: true, data: validatedData };
    
  } catch (error) {
    console.error('❌ Erro na validação:', error);
    
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(issue => {
        // Melhorar mensagens de erro para o usuário
        if (issue.path.includes('cnpj')) {
          return 'CNPJ inválido. Verifique os dígitos ou deixe em branco se não tiver empresa';
        }
        return issue.message;
      });
      
      console.log('📋 Erros de validação:', errors);
      return { success: false, errors };
    }
    
    return { 
      success: false, 
      errors: ['Erro interno de validação. Tente novamente ou entre em contato conosco.'] 
    };
  }
}