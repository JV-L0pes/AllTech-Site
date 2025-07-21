// src/components/ContactForm.tsx - SUBSTITUIR ARQUIVO COMPLETO
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Loader2, User, Building, Shield } from "lucide-react";

// Interfaces de domínio
interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  cnpj: string;
  numberOfEmployees: string;
  state: string;
  city: string;
  serviceOfInterest: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

type SubmissionStatus = 'idle' | 'loading_csrf' | 'submitting' | 'success' | 'error';

interface ApiResponse {
  success: boolean;
  message: string;
  salesRepresentative?: {
    name: string;
    email: string;
    region: string;
  };
  errors?: any[];
}

// Serviço de CSRF Token Seguro
class CSRFTokenService {
  private static token: string | null = null;
  private static tokenExpiry: number = 0;
  private static readonly TOKEN_VALIDITY_MS = 3600000; // 1 hora

  static async getToken(force = false): Promise<string> {
    const now = Date.now();
    
    // Retornar token válido se ainda não expirou
    if (!force && this.token && now < this.tokenExpiry) {
      return this.token;
    }

    try {
      console.log('🔄 Obtendo novo token CSRF...');
      
      const response = await fetch('/api/csrf', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`Falha ao obter token CSRF: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.csrfToken) {
        throw new Error('Resposta inválida do servidor para token CSRF');
      }

      this.token = data.csrfToken;
      this.tokenExpiry = now + this.TOKEN_VALIDITY_MS;
      
      console.log('✅ Token CSRF obtido com sucesso');
      return this.token as string;
      
    } catch (error) {
      console.error('❌ Erro ao obter token CSRF:', error);
      throw new Error('Falha na segurança: não foi possível obter token de proteção');
    }
  }

  static clearToken(): void {
    this.token = null;
    this.tokenExpiry = 0;
  }
}

// Formatadores
class FormatterUtils {
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
}

// Hook principal do formulário
function useSecureContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "", email: "", company: "", phone: "", cnpj: "",
    numberOfEmployees: "", state: "", city: "", serviceOfInterest: "", message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [securityInfo, setSecurityInfo] = useState({ csrfReady: false, attempts: 0 });
  
  // Refs para controle
  const submissionAttempts = useRef(0);
  const lastSubmissionTime = useRef(0);
  const isSubmitting = useRef(false);

  const updateField = useCallback((field: keyof ContactFormData, value: string) => {
    let formattedValue = value;
    
    // Auto-formatação
    if (field === 'phone') {
      formattedValue = FormatterUtils.formatPhone(value);
    } else if (field === 'cnpj') {
      formattedValue = FormatterUtils.formatCNPJ(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Limpar erro quando usuário digita
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  // Inicializar CSRF
  useEffect(() => {
    const initializeSecurity = async () => {
      try {
        await CSRFTokenService.getToken();
        setSecurityInfo(prev => ({ ...prev, csrfReady: true }));
      } catch (error) {
        console.error('Falha ao inicializar segurança:', error);
        setErrors({ security: 'Erro de segurança. Recarregue a página.' });
      }
    };

    initializeSecurity();
  }, []);

  const submitForm = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevenir submissões duplicadas
    if (isSubmitting.current) {
      console.log('⚠️ Submissão já em andamento...');
      return;
    }

    const now = Date.now();
    
    // Rate limiting local
    if (submissionAttempts.current >= 3 && now - lastSubmissionTime.current < 60000) {
      setErrors({ 
        submission: 'Muitas tentativas. Aguarde 1 minuto.' 
      });
      return;
    }

    // Validações básicas
    const basicErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      basicErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().split(' ').length < 2) {
      basicErrors.name = 'Digite nome e sobrenome';
    }
    
    if (!formData.email.trim()) {
      basicErrors.email = 'Email é obrigatório';
    }
    
    if (!formData.message.trim()) {
      basicErrors.message = 'Mensagem é obrigatória';
    } else if (formData.message.length < 10) {
      basicErrors.message = 'Mensagem deve ter pelo menos 10 caracteres';
    }

    if (!lgpdConsent) {
      basicErrors.lgpd = 'É necessário aceitar o consentimento LGPD';
    }

    if (Object.keys(basicErrors).length > 0) {
      setErrors(basicErrors);
      return;
    }

    isSubmitting.current = true;
    setStatus('submitting');
    setErrors({});
    setApiResponse(null);
    
    try {
      submissionAttempts.current++;
      lastSubmissionTime.current = now;

      // Obter token CSRF
      const csrfToken = await CSRFTokenService.getToken(true);

      console.log('📤 Enviando formulário...');
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        // CSRF falhou, limpar token
        if (response.status === 403) {
          CSRFTokenService.clearToken();
          setSecurityInfo(prev => ({ ...prev, csrfReady: false }));
        }
        
        throw new Error(result.message || `Erro HTTP ${response.status}`);
      }

      if (result.success) {
        // Reset form
        setFormData({
          name: "", email: "", company: "", phone: "", cnpj: "",
          numberOfEmployees: "", state: "", city: "", serviceOfInterest: "", message: "",
        });
        setLgpdConsent(false);
        setStatus('success');
        setApiResponse(result);
        
        // Reset tentativas
        submissionAttempts.current = 0;
        
        // Auto-hide após 15s
        setTimeout(() => {
          setStatus('idle');
          setApiResponse(null);
        }, 15000);
        
        console.log('✅ Formulário enviado com sucesso!');
      } else {
        throw new Error('Resposta inválida');
      }
    } catch (error) {
      console.error('❌ Erro ao enviar:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setErrors({ 
        submission: errorMessage.includes('CSRF') 
          ? 'Erro de segurança. Recarregue a página.' 
          : errorMessage 
      });
      setStatus('error');
      
      setTimeout(() => setStatus('idle'), 8000);
    } finally {
      isSubmitting.current = false;
    }
  }, [formData, lgpdConsent, status]);

  return {
    formData, errors, status, apiResponse, lgpdConsent, securityInfo,
    updateField, submitForm, setLgpdConsent, setErrors,
  };
}

// Componente de Input
interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  maxLength?: number;
}

function InputField({
  id, label, type = "text", value, onChange, error, placeholder, required = false, icon, maxLength
}: InputFieldProps) {
  const inputClass = [
    "w-full px-4 py-3 border rounded-lg transition-all bg-white",
    "focus:ring-2 focus:ring-tech-cyan focus:border-transparent",
    error ? "border-2 border-red-600 ring-2 ring-red-100" : "border-gray-300 hover:border-tech-cyan/50",
    icon ? "pl-12" : "pl-4",
  ].join(" ");

  return (
    <div className="relative mb-2">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
            {icon}
          </div>
        )}
        {type === 'textarea' ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
            placeholder={placeholder}
            rows={5}
            maxLength={maxLength}
          />
        ) : type === 'select' ? (
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          >
            <option value="">Selecione um serviço</option>
            <option value="Migração para Microsoft 365">Migração para Microsoft 365</option>
            <option value="Treinamentos Microsoft">Treinamentos Microsoft</option>
            <option value="Consultoria em Cloud">Consultoria em Cloud</option>
            <option value="Automação de Processos">Automação de Processos</option>
            <option value="Diagnóstico Gratuito">Diagnóstico Gratuito</option>
            <option value="Outros">Outros</option>
          </select>
        ) : (
          <input
            type={type}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        )}
      </div>
      {error && (
        <p className="text-red-600 text-sm mt-2 font-semibold" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Status de segurança
function SecurityStatus({ csrfReady, attempts }: { csrfReady: boolean; attempts: number }) {
  if (!csrfReady) {
    return (
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />
        <div className="text-sm text-yellow-800">
          <strong>Inicializando proteções...</strong>
          <p className="text-xs mt-1">Configurando proteção CSRF.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
      <Shield className="w-4 h-4 text-green-600" />
      <div className="text-sm text-green-800">
        <strong>🔒 Formulário protegido</strong>
        <p className="text-xs mt-1">
          CSRF, Rate Limiting, Validação
          {attempts > 0 && ` • Tentativas: ${attempts}/3`}
        </p>
      </div>
    </div>
  );
}

// Mensagens de status
function StatusMessage({ status, apiResponse, errors }: { 
  status: SubmissionStatus; 
  apiResponse: ApiResponse | null;
  errors: FormErrors;
}) {
  if (status === 'success' && apiResponse) {
    return (
      <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start">
          <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-green-800 mb-2">
              🎉 Mensagem enviada com sucesso!
            </h4>
            <p className="text-green-700 text-sm mb-3">{apiResponse.message}</p>
            
            {apiResponse.salesRepresentative && (
              <div className="bg-green-100 p-3 rounded-md">
                <p className="text-green-800 text-sm font-medium mb-1">
                  👤 Seu contato será direcionado para:
                </p>
                <div className="text-green-700 text-sm">
                  <p><strong>{apiResponse.salesRepresentative.name}</strong></p>
                  <p>📧 {apiResponse.salesRepresentative.email}</p>
                  <p>🌎 Região: {apiResponse.salesRepresentative.region}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error' || errors.submission || errors.security) {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <div>
            <h4 className="font-semibold text-red-800">Erro ao enviar</h4>
            <p className="text-red-700 text-sm">
              {errors.submission || errors.security || 
               'Erro interno. Use nosso email: ulysses.lima@alltechbr.solutions'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Contact Info
function ContactInfo() {
  const contactItems = [
    {
      icon: Mail,
      title: "Email",
      value: "ulysses.lima@alltechbr.solutions",
      href: "mailto:ulysses.lima@alltechbr.solutions",
    },
    {
      icon: Phone,
      title: "WhatsApp", 
      value: "(12) 99236-7544",
      href: "https://wa.me/5512992367544",
    },
    {
      icon: MapPin,
      title: "Atendimento",
      value: "Mundial • Seg-Sex: 9h-18h",
      href: null,
    },
  ];

  return (
    <div>
      <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
        Pronto para <span className="text-gradient">migrar</span>?
      </h2>
      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        Especialistas em migração para Microsoft 365 com metodologia PDCA.
      </p>

      <div className="space-y-6 mb-8">
        {contactItems.map((item, index) => {
          const IconComponent = item.icon;
          const content = (
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-tech-gradient rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <span className="text-gray-600">{item.value}</span>
              </div>
            </div>
          );

          return (
            <div key={index}>
              {item.href ? (
                <a href={item.href} className="block" target={item.href.includes('wa.me') ? '_blank' : undefined}>
                  {content}
                </a>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Componente principal
export default function ContactForm() {
  const {
    formData, errors, status, apiResponse, lgpdConsent, securityInfo,
    updateField, submitForm, setLgpdConsent,
  } = useSecureContactForm();

  const estadosBrasileiros = [
    { code: 'AC', name: 'Acre' }, { code: 'AL', name: 'Alagoas' }, { code: 'AP', name: 'Amapá' },
    { code: 'AM', name: 'Amazonas' }, { code: 'BA', name: 'Bahia' }, { code: 'CE', name: 'Ceará' },
    { code: 'DF', name: 'Distrito Federal' }, { code: 'ES', name: 'Espírito Santo' },
    { code: 'GO', name: 'Goiás' }, { code: 'MA', name: 'Maranhão' }, { code: 'MT', name: 'Mato Grosso' },
    { code: 'MS', name: 'Mato Grosso do Sul' }, { code: 'MG', name: 'Minas Gerais' },
    { code: 'PA', name: 'Pará' }, { code: 'PB', name: 'Paraíba' }, { code: 'PR', name: 'Paraná' },
    { code: 'PE', name: 'Pernambuco' }, { code: 'PI', name: 'Piauí' }, { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'RN', name: 'Rio Grande do Norte' }, { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'RO', name: 'Rondônia' }, { code: 'RR', name: 'Roraima' }, { code: 'SC', name: 'Santa Catarina' },
    { code: 'SP', name: 'São Paulo' }, { code: 'SE', name: 'Sergipe' }, { code: 'TO', name: 'Tocantins' }
  ];

  return (
    <section id="contato" className="section-padding bg-gray-100">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <ContactInfo />

          <div className="bg-gray-50 rounded-2xl p-8 tech-border-hover tech-shadow">
            <SecurityStatus csrfReady={securityInfo.csrfReady} attempts={securityInfo.attempts} />
            <StatusMessage status={status} apiResponse={apiResponse} errors={errors} />

            <form onSubmit={submitForm} className="space-y-6">
              {/* Informações Pessoais */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-tech-cyan" />
                  Informações Pessoais
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    id="name" label="Nome Completo" value={formData.name}
                    onChange={(value) => updateField("name", value)}
                    error={errors.name} placeholder="Seu nome completo"
                    required maxLength={100}
                  />
                  <InputField
                    id="email" label="Email" type="email" value={formData.email}
                    onChange={(value) => updateField("email", value)}
                    error={errors.email} placeholder="seu@email.com"
                    required maxLength={255}
                  />
                </div>
                <div className="mt-6">
                  <InputField
                    id="phone" label="Telefone" type="tel" value={formData.phone}
                    onChange={(value) => updateField("phone", value)}
                    error={errors.phone} placeholder="(11) 9 9999-9999"
                    icon={<Phone className="w-5 h-5 text-tech-cyan" />}
                    maxLength={15} required
                  />
                </div>
              </div>

              {/* Informações da Empresa */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-tech-cyan" />
                  Informações da Empresa (Opcional)
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    id="company" label="Nome da Empresa" value={formData.company}
                    onChange={(value) => updateField("company", value)}
                    placeholder="Nome da sua empresa" maxLength={100}
                  />
                  <InputField
                    id="cnpj" label="CNPJ" value={formData.cnpj}
                    onChange={(value) => updateField("cnpj", value)}
                    error={errors.cnpj} placeholder="00.000.000/0000-00"
                    maxLength={18}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <label htmlFor="numberOfEmployees" className="block text-sm font-semibold text-gray-700 mb-2">
                      Funcionários
                    </label>
                    <select
                      id="numberOfEmployees"
                      value={formData.numberOfEmployees}
                      onChange={(e) => updateField("numberOfEmployees", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-tech-cyan"
                    >
                      <option value="">Selecione</option>
                      <option value="1-10">1 a 10</option>
                      <option value="11-50">11 a 50</option>
                      <option value="51-100">51 a 100</option>
                      <option value="101-500">101 a 500</option>
                      <option value="500+">Mais de 500</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      id="state"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-tech-cyan"
                    >
                      <option value="">Selecione</option>
                      {estadosBrasileiros.map((estado) => (
                        <option key={estado.code} value={estado.code}>
                          {estado.code} - {estado.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <InputField
                    id="city" label="Cidade" value={formData.city}
                    onChange={(value) => updateField("city", value)}
                    placeholder="Sua cidade" maxLength={50}
                  />
                </div>
              </div>

              {/* Serviço */}
              <InputField
                id="serviceOfInterest" label="Serviço de Interesse"
                type="select" value={formData.serviceOfInterest}
                onChange={(value) => updateField("serviceOfInterest", value)}
              />

              {/* Mensagem */}
              <InputField
                id="message" label="Mensagem" type="textarea" value={formData.message}
                onChange={(value) => updateField("message", value)}
                error={errors.message}
                placeholder="Conte sobre seu projeto, número de usuários, sistemas atuais..."
                required maxLength={1000}
              />

              {/* LGPD */}
              <div className="flex items-start gap-2">
                <input
                  id="lgpdConsent" type="checkbox" 
                  checked={lgpdConsent}
                  onChange={e => setLgpdConsent(e.target.checked)}
                  required className="mt-1"
                />
                <label htmlFor="lgpdConsent" className="text-sm text-gray-700">
                  Concordo com a <a href="/politica-de-privacidade" target="_blank" className="underline text-tech-cyan">Política de Privacidade</a>.
                </label>
              </div>
              {errors.lgpd && (
                <p className="text-red-600 text-sm font-semibold">{errors.lgpd}</p>
              )}

              {/* Botão */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!securityInfo.csrfReady || status === 'submitting'}
                  className={`w-full btn-primary text-lg py-4 transition-all duration-300 ${
                    !securityInfo.csrfReady || status === 'submitting'
                      ? 'opacity-70 cursor-not-allowed' 
                      : 'animate-gradient hover:scale-105'
                  }`}
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center justify-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </span>
                  ) : !securityInfo.csrfReady ? (
                    <span className="flex items-center justify-center gap-2">
                      <Shield className="w-5 h-5" />
                      Carregando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      Enviar Mensagem
                    </span>
                  )}
                </button>
              </div>

              {/* Info de segurança */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  🔒 Formulário protegido por CSRF e Rate Limiting.<br />
                  Dados protegidos conforme LGPD.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}