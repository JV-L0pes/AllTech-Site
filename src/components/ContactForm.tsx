"use client";

import { useState, useCallback } from "react";

interface FormData {
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

// Validações mais robustas
const validateForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  // Nome
  if (!data.name.trim()) {
    errors.name = "Nome é obrigatório";
  } else if (data.name.length < 2) {
    errors.name = "Nome deve ter pelo menos 2 caracteres";
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) {
    errors.email = "Email é obrigatório";
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Email inválido";
  }

  // Telefone (opcional, mas se preenchido deve estar correto)
  if (data.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(data.phone)) {
    errors.phone = "Formato: (11) 99999-9999";
  }

  // Mensagem
  if (!data.message.trim()) {
    errors.message = "Mensagem é obrigatória";
  } else if (data.message.length < 10) {
    errors.message = "Mensagem deve ter pelo menos 10 caracteres";
  }

  return errors;
};

// Hook personalizado para gerenciar o formulário
const useContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Limpar erro quando usuário começar a digitar
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validar formulário
      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);
      setSubmitStatus("idle");

      try {
        // Simular envio (aqui você integraria com sua API)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Resetar formulário em caso de sucesso
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          service: "",
          message: "",
        });
        setErrors({});
        setSubmitStatus("success");
      } catch (error) {
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  return {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    handleChange,
    handleSubmit,
  };
};

export default function ContactForm() {
  const {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    handleChange,
    handleSubmit,
  } = useContactForm();

  const services = [
    "Implementação de Software",
    "Treinamentos Microsoft",
    "Cloud Service",
    "Inteligência Artificial",
    "Diagnóstico Gratuito",
  ];

  const getInputClassName = (fieldName: string) => {
    const baseClasses =
      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white";
    const errorClasses = errors[fieldName]
      ? "border-red-500"
      : "border-gray-300";
    return `${baseClasses} ${errorClasses}`;
  };

  return (
    <section id="contato" className="section-padding bg-gray-100">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Informações de contato */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Vamos <span className="text-gradient">conversar</span>?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Pronto para transformar sua empresa com tecnologia? Entre em
              contato conosco e descubra como podemos ajudar seu negócio a
              alcançar o próximo nível.
            </p>

            {/* Informações de contato */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tech-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">📧</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <a
                    href="mailto:contato@alltechdigital.com"
                    className="text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    contato@alltechdigital.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tech-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">📱</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Telefone</h4>
                  <a
                    href="tel:+5511999999999"
                    className="text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    (11) 9 9999-9999
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tech-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl">📍</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Localização</h4>
                  <p className="text-gray-600">São Paulo, SP - Brasil</p>
                </div>
              </div>
            </div>

            {/* Benefícios */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-300">
              <h4 className="font-bold text-gray-900 mb-4">
                🎯 Por que nos escolher?
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-tech-gradient rounded-full mr-3"></span>
                  Resposta em até 24 horas
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-tech-gradient rounded-full mr-3"></span>
                  Diagnóstico gratuito sem compromisso
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-tech-gradient rounded-full mr-3"></span>
                  Parceria Microsoft Gold
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-tech-gradient rounded-full mr-3"></span>
                  +150 projetos entregues com sucesso
                </li>
              </ul>
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-300 shadow-lg">
            {/* Mensagem de sucesso */}
            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-green-500 text-xl mr-3">✓</span>
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
            )}

            {/* Mensagem de erro */}
            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <span className="text-red-500 text-xl mr-3">✗</span>
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
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={getInputClassName("name")}
                    placeholder="Seu nome completo"
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p
                      id="name-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={getInputClassName("email")}
                    placeholder="seu@email.com"
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Empresa
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    className={getInputClassName("company")}
                    placeholder="Nome da sua empresa"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={getInputClassName("phone")}
                    placeholder="(11) 9 9999-9999"
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                  {errors.phone && (
                    <p
                      id="phone-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Serviço de Interesse
                </label>
                <select
                  id="service"
                  value={formData.service}
                  onChange={(e) => handleChange("service", e.target.value)}
                  className={getInputClassName("service")}
                >
                  <option value="">Selecione um serviço</option>
                  {services.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Mensagem *
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  rows={5}
                  className={getInputClassName("message")}
                  placeholder="Conte-nos sobre seu projeto ou necessidade..."
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                />
                {errors.message && (
                  <p
                    id="message-error"
                    className="text-red-500 text-xs mt-1"
                    role="alert"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full btn-primary text-lg py-4 ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "animate-gradient hover:scale-105"
                }`}
                aria-describedby="submit-status"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
