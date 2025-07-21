// src/components/ContactForm.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Loader2, User, Building } from "lucide-react";

// Adicionar declaração global para evitar erro TS
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare global {
  interface Window {
    onRecaptchaSuccess?: (token: string) => void;
  }
}

// Domain Types
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

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

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

// Validation Service
class ValidationService {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly PHONE_REGEX = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  private static readonly CNPJ_REGEX = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

  static validateForm(data: ContactFormData): FormErrors {
    const errors: FormErrors = {};

    // Nome obrigatório
    if (!data.name.trim()) {
      errors.name = "Nome é obrigatório";
    } else if (data.name.length < 2) {
      errors.name = "Nome deve ter pelo menos 2 caracteres";
    } else if (data.name.trim().split(' ').length < 2) {
      errors.name = "Por favor, insira seu nome completo (nome e sobrenome)";
    } else if (data.name.includes('  ')) {
      errors.name = "Nome não pode conter espaços duplos";
    }

    // Email obrigatório
    if (!data.email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!this.EMAIL_REGEX.test(data.email)) {
      errors.email = "Email inválido";
    }

    // Mensagem obrigatória
    if (!data.message.trim()) {
      errors.message = "Mensagem é obrigatória";
    } else if (data.message.length < 10) {
      errors.message = "Mensagem deve ter pelo menos 10 caracteres";
    }

    // Telefone: só valida se preenchido
    if (data.phone && !this.PHONE_REGEX.test(data.phone)) {
      errors.phone = "Formato: (11) 99999-9999";
    }

    // CNPJ: só valida se preenchido
    if (data.cnpj && !this.CNPJ_REGEX.test(data.cnpj)) {
      errors.cnpj = "Formato: 00.000.000/0000-00";
    }

    return errors;
  }
}

// Formatting utilities
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

// Contact Form Hook
function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    cnpj: "",
    numberOfEmployees: "",
    state: "",
    city: "",
    serviceOfInterest: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  const updateField = useCallback((field: keyof ContactFormData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-format certain fields
      if (field === 'phone') {
        newData.phone = FormatterUtils.formatPhone(value);
      } else if (field === 'cnpj') {
        newData.cnpj = FormatterUtils.formatCNPJ(value);
      }
      
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  const submitForm = useCallback(async (e: React.FormEvent, csrfToken: string) => {
    e.preventDefault();

    const validationErrors = ValidationService.validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('submitting');
    setApiResponse(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, // Adiciona o token CSRF ao header
        },
        body: JSON.stringify({ ...formData }), // Adiciona o token do reCAPTCHA ao body
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao enviar formulário');
      }

      if (result.success) {
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          cnpj: "",
          numberOfEmployees: "",
          state: "",
          city: "",
          serviceOfInterest: "",
          message: "",
        });
        setErrors({});
        setStatus('success');
        setApiResponse(result);
        
        // Reset success message after 15 seconds
        setTimeout(() => {
          setStatus('idle');
          setApiResponse(null);
        }, 15000);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 8000);
    }
  }, [formData]);

  return {
    formData,
    errors,
    status,
    apiResponse,
    updateField,
    submitForm,
    setErrors,
  };
}

// Input Component
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
  labelClassName?: string;
}

function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = false,
  icon,
  maxLength,
  labelClassName = "",
  inputClassName = ""
}: InputFieldProps & { labelClassName?: string; inputClassName?: string }) {
  const inputClass = [
    "w-full px-4 py-3 border rounded-lg transition-all bg-white",
    "focus:ring-2 focus:ring-tech-cyan focus:border-transparent",
    error ? "border-2 border-red-600 ring-2 ring-red-100" : "border-gray-300 hover:border-tech-cyan/50",
    icon ? "pl-12" : "pl-4",
    inputClassName
  ].join(" ");

  return (
    <div className="relative mb-2">
      <label htmlFor={id} className={`block text-sm font-semibold text-gray-700 mb-2 ${labelClassName}`}>
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
            aria-describedby={error ? `${id}-error` : undefined}
          />
        ) : type === 'select' ? (
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
            aria-describedby={error ? `${id}-error` : undefined}
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
            aria-describedby={error ? `${id}-error` : undefined}
          />
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-red-600 text-sm mt-2 font-semibold" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Contact Info Component
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

  const benefits = [
    "✅ Resposta em até 24 horas",
    "🆓 Diagnóstico gratuito sem compromisso",
    "🏆 Especialistas Microsoft certificados",
    "🔄 Metodologia PDCA comprovada",
    "🌍 Atendimento mundial em português",
    "🔒 Dados protegidos e seguros",
  ];

  return (
    <div>
      <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
        Pronto para <span className="text-gradient">migrar</span>?
      </h2>
      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        Especialistas em migração para Microsoft 365 com metodologia PDCA. 
        Entre em contato e descubra como modernizar sua infraestrutura 
        com segurança total e zero downtime.
      </p>

      {/* Contact Details */}
      <div className="space-y-6 mb-8">
        {contactItems.map((item, index) => {
          const IconComponent = item.icon;
          const content = (
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-tech-gradient rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 group-hover:text-tech-cyan transition-all duration-300">
                  {item.title}
                </h4>
                <span className="text-gray-600 group-hover:text-tech-cyan transition-colors">
                  {item.value}
                </span>
              </div>
            </div>
          );

          return (
            <div key={index}>
              {item.href ? (
                <a href={item.href} className="block" target={item.href.startsWith('https://wa.me') ? '_blank' : undefined} rel={item.href.startsWith('https://wa.me') ? 'noopener noreferrer' : undefined}>
                  {content}
                </a>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>

      {/* Benefits */}
      <div className="p-6 bg-gray-50 rounded-xl tech-border-hover tech-shadow">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-xl">🎯</span>
          Por que nos escolher?
        </h4>
        <ul className="space-y-3 text-sm text-gray-600">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className="flex items-center hover:text-gray-800 transition-colors"
            >
              <span className="mr-2">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Status Message Component
function StatusMessage({ status, apiResponse }: { 
  status: SubmissionStatus; 
  apiResponse: ApiResponse | null; 
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
            <p className="text-green-700 text-sm mb-3">
              {apiResponse.message}
            </p>
            
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

  if (status === 'error') {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <div>
            <h4 className="font-semibold text-red-800">
              Erro ao enviar mensagem
            </h4>
            <p className="text-red-700 text-sm">
              Tente novamente ou use nosso email diretamente: ulysses.lima@alltechbr.solutions
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Main Component
export default function ContactForm() {
  const { formData, errors, status, apiResponse, updateField, submitForm, setErrors } = useContactForm();
  const [csrfToken, setCsrfToken] = useState("");
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [lgpdError, setLgpdError] = useState("");

  useEffect(() => {
    setCsrfToken(
      Math.random().toString(36).substring(2) + Date.now().toString(36)
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLgpdError("");
    const validationErrors = ValidationService.validateForm(formData);
    let hasError = false;
    if (!lgpdConsent) {
      setLgpdError("É necessário aceitar o consentimento de dados (LGPD)");
      hasError = true;
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      hasError = true;
    } else {
      setErrors({});
    }
    if (hasError) return;
    submitForm(e, csrfToken);
  };

  const estadosBrasileiros = [
    { code: 'AC', name: 'Acre' },
    { code: 'AL', name: 'Alagoas' },
    { code: 'AP', name: 'Amapá' },
    { code: 'AM', name: 'Amazonas' },
    { code: 'BA', name: 'Bahia' },
    { code: 'CE', name: 'Ceará' },
    { code: 'DF', name: 'Distrito Federal' },
    { code: 'ES', name: 'Espírito Santo' },
    { code: 'GO', name: 'Goiás' },
    { code: 'MA', name: 'Maranhão' },
    { code: 'MT', name: 'Mato Grosso' },
    { code: 'MS', name: 'Mato Grosso do Sul' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'PA', name: 'Pará' },
    { code: 'PB', name: 'Paraíba' },
    { code: 'PR', name: 'Paraná' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'PI', name: 'Piauí' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'RN', name: 'Rio Grande do Norte' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'RO', name: 'Rondônia' },
    { code: 'RR', name: 'Roraima' },
    { code: 'SC', name: 'Santa Catarina' },
    { code: 'SP', name: 'São Paulo' },
    { code: 'SE', name: 'Sergipe' },
    { code: 'TO', name: 'Tocantins' }
  ];

  return (
    <section id="contato" className="section-padding bg-gray-100">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <ContactInfo />

          <div className="bg-gray-50 rounded-2xl p-8 tech-border-hover tech-shadow">
            <StatusMessage status={status} apiResponse={apiResponse} />

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Pessoais */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-tech-cyan" />
                  Informações Pessoais
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    id="name"
                    label="Nome Completo"
                    value={formData.name}
                    onChange={(value) => updateField("name", value)}
                    error={errors.name}
                    placeholder="Seu nome completo"
                    required
                    maxLength={100}
                  />

                  <InputField
                    id="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(value) => updateField("email", value)}
                    error={errors.email}
                    placeholder="seu@email.com"
                    required
                    maxLength={255}
                  />
                </div>

                <div className="mt-6">
                  <InputField
                    id="phone"
                    label="Telefone"
                    type="tel"
                    value={formData.phone}
                    onChange={(value) => updateField("phone", value)}
                    error={errors.phone}
                    placeholder="(11) 9 9999-9999"
                    icon={<Phone className="w-5 h-5 text-tech-cyan" />}
                    maxLength={15}
                    required
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
                    id="company"
                    label="Nome da Empresa"
                    value={formData.company}
                    onChange={(value) => updateField("company", value)}
                    placeholder="Nome da sua empresa"
                    maxLength={100}
                  />

                  <InputField
                    id="cnpj"
                    label="CNPJ"
                    value={formData.cnpj}
                    onChange={(value) => updateField("cnpj", value)}
                    error={errors.cnpj}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div>
                    <label htmlFor="numberOfEmployees" className="block text-sm font-semibold text-gray-700 mb-2 min-h-[40px]">
                      Número de Funcionários
                    </label>
                    <select
                      id="numberOfEmployees"
                      value={formData.numberOfEmployees}
                      onChange={(e) => updateField("numberOfEmployees", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all bg-white focus:ring-2 focus:ring-tech-cyan focus:border-transparent hover:border-tech-cyan/50"
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
                    <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2 min-h-[40px] pt-2">
                      Estado
                    </label>
                    <select
                      id="state"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all bg-white focus:ring-2 focus:ring-tech-cyan focus:border-transparent hover:border-tech-cyan/50 pt-3"
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
                    id="city"
                    label="Cidade"
                    value={formData.city}
                    onChange={(value) => updateField("city", value)}
                    placeholder="Sua cidade"
                    maxLength={50}
                    labelClassName="min-h-[40px] mb-2 pt-2"
                    inputClassName="pt-2"
                  />
                </div>
              </div>

              {/* Serviço de Interesse */}
              <div>
                <InputField
                  id="serviceOfInterest"
                  label="Serviço de Interesse"
                  type="select"
                  value={formData.serviceOfInterest}
                  onChange={(value) => updateField("serviceOfInterest", value)}
                />
              </div>

              {/* Mensagem */}
              <div>
                <InputField
                  id="message"
                  label="Mensagem"
                  type="textarea"
                  value={formData.message}
                  onChange={(value) => updateField("message", value)}
                  error={errors.message}
                  placeholder="Conte-nos sobre seu projeto de migração, número de usuários, sistemas atuais (Google Workspace, Slack, etc.) e urgência do projeto..."
                  required
                  maxLength={1000}
                />
                <div className="mt-1 text-xs text-gray-500 text-right">
                  {formData.message.length}/1000 caracteres
                </div>
              </div>

              {/* Checkbox LGPD obrigatório */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  id="lgpdConsent"
                  type="checkbox"
                  checked={lgpdConsent}
                  onChange={e => setLgpdConsent(e.target.checked)}
                  required
                  className="mt-1"
                />
                <label htmlFor="lgpdConsent" className="text-sm text-gray-700">
                  Concordo com a coleta e uso dos meus dados conforme a <a href="/politica-de-privacidade" target="_blank" rel="noopener noreferrer" className="underline text-tech-cyan">Política de Privacidade</a>.
                </label>
              </div>
              {lgpdError && (
                <p className="text-red-600 text-sm mt-2 font-semibold" role="alert">{lgpdError}</p>
              )}

              {/* Botão de Envio */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className={`
                    w-full btn-primary text-lg py-4 transition-all duration-300 relative overflow-hidden
                    ${status === 'submitting' 
                      ? 'opacity-70 cursor-not-allowed' 
                      : 'animate-gradient hover:scale-105'
                    }
                  `}
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center justify-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando sua mensagem...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      Enviar Mensagem
                    </span>
                  )}
                </button>
              </div>

              {/* Política de Privacidade */}
              <div className="text-center">
                <p className="text-xs text-gray-500 leading-relaxed">
                  🔒 Ao enviar este formulário, você concorda com nossa política de privacidade.<br />
                  Seus dados serão utilizados apenas para entrarmos em contato e são protegidos com criptografia.
                </p>
              </div>

              {/* Informações Adicionais */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  💡 Dica para uma resposta mais rápida
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Mencione se usa Google Workspace, Slack ou outro tenant Microsoft</li>
                  <li>• Descreva o número aproximado de usuários a migrar</li>
                  <li>• Indique se há urgência no projeto de migração</li>
                  <li>• Mencione se já tentou migrar anteriormente</li>
                </ul>
              </div>
              <input type="hidden" name="csrfToken" value={csrfToken} />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}