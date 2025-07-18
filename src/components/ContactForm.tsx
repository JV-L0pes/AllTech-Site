"use client";

import { useState, useCallback } from "react";
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

// Domain Types
interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

// Validation Service
class ValidationService {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly PHONE_REGEX = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

  static validateForm(data: ContactFormData): FormErrors {
    const errors: FormErrors = {};

    if (!data.name.trim()) {
      errors.name = "Nome é obrigatório";
    } else if (data.name.length < 2) {
      errors.name = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!data.email.trim()) {
      errors.email = "Email é obrigatório";
    } else if (!this.EMAIL_REGEX.test(data.email)) {
      errors.email = "Email inválido";
    }

    if (data.phone && !this.PHONE_REGEX.test(data.phone)) {
      errors.phone = "Formato: (11) 99999-9999";
    }

    if (!data.message.trim()) {
      errors.message = "Mensagem é obrigatória";
    } else if (data.message.length < 10) {
      errors.message = "Mensagem deve ter pelo menos 10 caracteres";
    }

    return errors;
  }
}

// Contact Form Hook
function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>('idle');

  const updateField = useCallback((field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  const submitForm = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = ValidationService.validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao enviar formulário');
      }

      if (result.success) {
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          service: "",
          message: "",
        });
        setErrors({});
        setStatus('success');
        
        // Reset success message after 10 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 10000);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  }, [formData]);

  return {
    formData,
    errors,
    status,
    updateField,
    submitForm,
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
}: InputFieldProps) {
  const inputClassName = `
    w-full px-4 py-3 border rounded-lg transition-all bg-white
    focus:ring-2 focus:ring-tech-cyan focus:border-transparent
    ${error ? 'border-red-500' : 'border-gray-300 hover:border-tech-cyan/50'}
  `;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClassName}
          placeholder={placeholder}
          rows={5}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClassName}
          aria-describedby={error ? `${id}-error` : undefined}
        >
          <option value="">Selecione um serviço</option>
          <option value="Implementação de Software">Implementação de Software</option>
          <option value="Treinamentos Microsoft">Treinamentos Microsoft</option>
          <option value="Cloud Service">Cloud Service</option>
          <option value="Inteligência Artificial">Inteligência Artificial</option>
          <option value="Diagnóstico Gratuito">Diagnóstico Gratuito</option>
        </select>
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClassName}
          placeholder={placeholder}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="text-red-500 text-xs mt-1" role="alert">
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
      value: "contato@alltechdigital.com",
      href: "mailto:contato@alltechdigital.com",
    },
    {
      icon: Phone,
      title: "Telefone",
      value: "(11) 9 9999-9999",
      href: "tel:+5511999999999",
    },
    {
      icon: MapPin,
      title: "Localização",
      value: "São Paulo, SP - Brasil",
      href: null,
    },
  ];

  const benefits = [
    "Resposta em até 24 horas",
    "Diagnóstico gratuito sem compromisso",
    "Parceria Microsoft Gold",
    "+150 projetos entregues com sucesso",
  ];

  return (
    <div>
      <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
        Vamos <span className="text-gradient">conversar</span>?
      </h2>
      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        Pronto para transformar sua empresa com tecnologia? Entre em contato
        conosco e descubra como podemos ajudar seu negócio a alcançar o próximo
        nível.
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
                <a href={item.href} className="block">
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
        <ul className="space-y-2 text-sm text-gray-600">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className="flex items-center hover:text-gray-800 transition-colors"
            >
              <span
                className="w-2 h-2 bg-tech-gradient rounded-full mr-3 animate-pulse"
                style={{ animationDelay: `${index * 200}ms` }}
              ></span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Status Message Component
function StatusMessage({ status }: { status: SubmissionStatus }) {
  if (status === 'success') {
    return (
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
          <div>
            <h4 className="font-semibold text-green-800">
              Mensagem enviada com sucesso!
            </h4>
            <p className="text-green-700 text-sm">
              Entraremos em contato em breve.
            </p>
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
              Tente novamente ou use nosso email diretamente.
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
  const { formData, errors, status, updateField, submitForm } = useContactForm();

  return (
    <section id="contato" className="section-padding bg-gray-100">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <ContactInfo />

          <div className="bg-gray-50 rounded-2xl p-8 tech-border-hover tech-shadow">
            <StatusMessage status={status} />

            <form onSubmit={submitForm} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  id="name"
                  label="Nome Completo"
                  value={formData.name}
                  onChange={(value) => updateField("name", value)}
                  error={errors.name}
                  placeholder="Seu nome completo"
                  required
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
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  id="company"
                  label="Empresa"
                  value={formData.company}
                  onChange={(value) => updateField("company", value)}
                  placeholder="Nome da sua empresa"
                />

                <InputField
                  id="phone"
                  label="Telefone"
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => updateField("phone", value)}
                  error={errors.phone}
                  placeholder="(11) 9 9999-9999"
                />
              </div>

              <InputField
                id="service"
                label="Serviço de Interesse"
                type="select"
                value={formData.service}
                onChange={(value) => updateField("service", value)}
              />

              <InputField
                id="message"
                label="Mensagem"
                type="textarea"
                value={formData.message}
                onChange={(value) => updateField("message", value)}
                error={errors.message}
                placeholder="Conte-nos sobre seu projeto ou necessidade..."
                required
              />

              <button
                type="submit"
                disabled={status === 'submitting'}
                className={`
                  w-full btn-primary text-lg py-4 transition-all duration-300
                  ${status === 'submitting' 
                    ? 'opacity-70 cursor-not-allowed' 
                    : 'animate-gradient hover:scale-105'
                  }
                `}
              >
                {status === 'submitting' ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  "Solicitar Contato"
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Ao enviar este formulário, você concorda com nossa política de
                privacidade. Seus dados serão utilizados apenas para entrarmos
                em contato.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}