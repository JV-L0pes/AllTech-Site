import { z } from 'zod';

// Regex patterns
const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

// Função para validar CNPJ
function validateCNPJ(cnpj: string): boolean {
  // Remove caracteres especiais
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
  
  if (cleanCNPJ.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
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

// Schema principal do formulário
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(255, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  
  email: z
    .string()
    .email('Email inválido')
    .max(255, 'Email muito longo')
    .toLowerCase(),
  
  phone: z
    .string()
    .regex(phoneRegex, 'Formato de telefone inválido. Use: (11) 99999-9999'),
  
  company: z
    .string()
    .min(1, 'Nome da empresa é obrigatório')
    .max(255, 'Nome da empresa muito longo'),
  
  cnpj: z
    .string()
    .regex(cnpjRegex, 'CNPJ inválido. Formato: 00.000.000/0000-00')
    .refine(validateCNPJ, 'CNPJ inválido'),
  
  numberOfEmployees: z
    .string()
    .min(1, 'Número de funcionários é obrigatório'),
  
  state: z
    .string()
    .length(2, 'Estado deve ter 2 caracteres')
    .toUpperCase(),
  
  city: z
    .string()
    .min(1, 'Cidade é obrigatória')
    .max(100, 'Nome da cidade muito longo'),
  
  serviceOfInterest: z
    .string()
    .optional(),
  
  message: z
    .string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(1000, 'Mensagem muito longa')
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

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

// Estados brasileiros válidos
export const VALID_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

// Função para formatar CNPJ
export function formatCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

// Função para formatar telefone
export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 11) {
    return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    return numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  return value;
}