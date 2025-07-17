"use client";

import { useState, useEffect } from "react";

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Maria Santos",
      position: "Diretora de TI",
      company: "TechCorp Solutions",
      avatar: "MS",
      rating: 5,
      testimonial:
        "Excelente equipe, nos ajudou muito na migração para Office 365. Tivemos resultados excelentes na produtividade da nossa equipe. O suporte é sempre rápido e eficiente.",
      result: "↗️ 40% aumento na produtividade",
    },
    {
      id: 2,
      name: "Carlos Oliveira",
      position: "CEO",
      company: "Innovate Solutions",
      avatar: "CO",
      rating: 5,
      testimonial:
        "A AllTech desde o início nos deu todo suporte necessário na implementação do Azure. Sempre que me perguntam sobre consultoria em tecnologia, eu indico sem hesitar.",
      result: "💰 35% redução de custos",
    },
    {
      id: 3,
      name: "Ana Silva",
      position: "Gerente de Projetos",
      company: "DataFlow Systems",
      avatar: "AS",
      rating: 5,
      testimonial:
        "É uma excelente empresa, com pessoas altamente capacitadas. Gosto do cuidado com o atendimento e do serviço que conseguem prestar. O comprometimento da equipe se solidifica com os ótimos resultados.",
      result: "⚡ 60% automação de processos",
    },
    {
      id: 4,
      name: "Roberto Lima",
      position: "CTO",
      company: "SmartBusiness Ltd",
      avatar: "RL",
      rating: 5,
      testimonial:
        "O treinamento em Power Platform foi fundamental para nossa equipe. Agora conseguimos criar soluções internas sem depender de terceiros. ROI fantástico!",
      result: "🚀 50% mais agilidade",
    },
  ];

  const stats = [
    {
      number: "99.9%",
      label: "Uptime",
      description: "Disponibilidade garantida",
    },
    {
      number: "150+",
      label: "Projetos",
      description: "Entregues com sucesso",
    },
    {
      number: "50+",
      label: "Empresas",
      description: "Atendidas em todo Brasil",
    },
  ];

  // Auto-slide a cada 6 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
  };

  return (
    <section id="depoimentos" className="section-padding bg-gray-100">
      <div className="container mx-auto">
        {/* Título da seção */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            O que nossos <span className="text-gradient">clientes dizem</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veja os resultados reais que nossos clientes conquistaram com nossas
            soluções tecnológicas
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-gray-50 rounded-xl p-6 border border-gray-300 shadow-sm"
            >
              <div className="text-4xl lg:text-5xl font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-xl font-semibold text-gray-900 mb-2">
                {stat.label}
              </div>
              <div className="text-gray-500 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Carrossel de depoimentos */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 border border-gray-300 shadow-lg">
            {/* Aspas decorativas */}
            <div className="text-6xl text-blue-500/30 mb-6">"</div>

            {/* Conteúdo do depoimento */}
            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`transition-opacity duration-500 ${
                    index === currentTestimonial
                      ? "opacity-100"
                      : "opacity-0 absolute inset-0"
                  }`}
                >
                  {/* Estrelas */}
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Texto do depoimento */}
                  <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed text-center mb-8 italic">
                    {testimonial.testimonial}
                  </blockquote>

                  {/* Resultado destacado */}
                  <div className="text-center mb-8">
                    <div className="inline-block bg-tech-gradient text-white px-6 py-2 rounded-full font-semibold">
                      {testimonial.result}
                    </div>
                  </div>

                  {/* Informações do autor */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-14 h-14 bg-tech-gradient rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-600">
                        {testimonial.position}
                      </div>
                      <div className="text-blue-600 text-sm">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controles de navegação */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() =>
                goToTestimonial(
                  (currentTestimonial - 1 + testimonials.length) %
                    testimonials.length
                )
              }
              className="w-12 h-12 bg-gray-50 hover:bg-white rounded-full flex items-center justify-center text-gray-600 transition-colors duration-200 border border-gray-300 shadow-sm"
            >
              ‹
            </button>
            <button
              onClick={() =>
                goToTestimonial((currentTestimonial + 1) % testimonials.length)
              }
              className="w-12 h-12 bg-gray-50 hover:bg-white rounded-full flex items-center justify-center text-gray-600 transition-colors duration-200 border border-gray-300 shadow-sm"
            >
              ›
            </button>
          </div>

          {/* Indicadores */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "bg-tech-gradient w-8"
                    : "bg-gray-400 hover:bg-gray-500 w-3"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Logos de clientes (simulados) */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm mb-8">
            Empresas que confiam na AllTech Digital
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[
              "TechCorp",
              "Innovate",
              "DataFlow",
              "SmartBiz",
              "CloudFirst",
              "NextGen",
            ].map((company, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 h-16 flex items-center justify-center border border-gray-300"
              >
                <span className="text-gray-500 font-semibold text-sm">
                  {company}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Quer ser nosso próximo case de sucesso?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Solicite um diagnóstico gratuito e descubra como podemos transformar
            sua empresa com tecnologia
          </p>
          <button className="btn-primary text-lg px-8 py-4 animate-gradient">
            Começar Minha Transformação Digital
          </button>
        </div>
      </div>
    </section>
  );
}
