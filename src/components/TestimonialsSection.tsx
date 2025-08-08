"use client";

import { useState, useEffect } from "react";
import { navigationService } from "@/lib/navigation-service";

export default function TestimonialsSection() {
  const [activePartner, setActivePartner] = useState(0);

  // Parcerias estratégicas reais
  const partnerships = [
    {
      id: 1,
      name: "Buysoft",
      category: "Soluções Microsoft Integradas",
      description: "Parceria estratégica para fornecimento de licenças Microsoft e soluções integradas para nossos clientes.",
      services: ["Licenças Microsoft 365", "Consultoria especializada", "Suporte técnico avançado"],
      established: "2023"
    },
    {
      id: 2,
      name: "Dedalus Prime",
      category: "Consultoria Especializada", 
      description: "Colaboração em projetos de consultoria complexa e implementação de soluções empresariais Microsoft.",
      services: ["Consultoria estratégica", "Implementação Azure", "Migração complexa"],
      established: "2023"
    },
    {
      id: 3,
      name: "Dione Solutions",
      category: "Tecnologia e Inovação",
      description: "Parceria em desenvolvimento de soluções inovadoras e automação de processos empresariais.",
      services: ["Power Platform", "Automação", "Soluções customizadas"],
      established: "2024"
    }
  ];

  const stats = [
    {
      number: "99.9%",
      label: "Taxa de Sucesso",
      description: "Em projetos de migração",
    },
    {
      number: "2-6",
      label: "Semanas",
      description: "Tempo médio de migração",
    },
    {
      number: "50-500",
      label: "Colaboradores",
      description: "Nosso público especializado",
    },
  ];

  // Cases de sucesso baseados no perfil da empresa
  const successCases = [
    {
      id: 1,
      sector: "Tecnologia",
      size: "120 colaboradores",
      challenge: "Migração do Google Workspace para Microsoft 365",
      solution: "Migração completa com preservação de 100% dos dados e zero downtime",
      result: "⚡ Migração concluída em 3 semanas",
      timeframe: "3 semanas"
    },
    {
      id: 2,
      sector: "Consultoria",
      size: "85 colaboradores", 
      challenge: "Unificação de múltiplos tenants Microsoft 365",
      solution: "Cross-tenant migration com reestruturação organizacional",
      result: "🔗 Unificação total com melhoria na colaboração",
      timeframe: "4 semanas"
    },
    {
      id: 3,
      sector: "Serviços",
      size: "200 colaboradores",
      challenge: "Migração Slack para Microsoft Teams + SharePoint",
      solution: "Migração completa de comunicação e documentos",
      result: "📈 40% de melhoria na produtividade",
      timeframe: "5 semanas"
    }
  ];

  // Auto-slide a cada 8 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePartner((prev) => (prev + 1) % partnerships.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [partnerships.length]);

  const goToPartner = (index: number) => {
    setActivePartner(index);
  };

  return (
    <section id="depoimentos" className="section-padding bg-gray-100">
      <div className="container mx-auto">
        {/* Título da seção */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-gradient">Parcerias</span> e Cases de Sucesso
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conheça nossos parceiros estratégicos e alguns casos reais de migração 
            bem-sucedida para Microsoft 365
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center bg-gray-50 rounded-xl p-6 tech-border-hover tech-shadow group hover:scale-105 transition-all duration-300"
            >
              <div className="text-4xl lg:text-5xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-tech-cyan transition-all duration-300">
                {stat.label}
              </div>
              <div className="text-gray-500 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Parcerias Estratégicas */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Nossos <span className="text-gradient">Parceiros Estratégicos</span>
          </h3>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 tech-border-hover tech-shadow overflow-hidden">
              
              {/* Conteúdo da parceria */}
              <div className="relative min-h-[300px]">
                {partnerships.map((partner, index) => (
                  <div
                    key={partner.id}
                    className={`transition-all duration-700 transform ${
                      index === activePartner
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 absolute inset-0 translate-x-full"
                    }`}
                  >
                    <div className="text-center mb-6">
                      <h4 className="text-3xl font-bold text-gray-900 mb-2">{partner.name}</h4>
                      <span className="inline-block bg-tech-gradient text-white px-4 py-1 rounded-full text-sm font-semibold">
                        {partner.category}
                      </span>
                    </div>

                    <p className="text-lg text-gray-700 text-center mb-6 leading-relaxed">
                      {partner.description}
                    </p>

                    {/* Serviços da parceria */}
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      {partner.services.map((service, serviceIndex) => (
                        <div key={serviceIndex} className="bg-white rounded-lg p-4 text-center shadow-sm">
                          <span className="text-gray-800 font-medium text-sm">{service}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-center">
                      <span className="text-gray-500 text-sm">
                        Parceria estabelecida em {partner.established}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controles de navegação */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() =>
                  goToPartner(
                    (activePartner - 1 + partnerships.length) % partnerships.length
                  )
                }
                className="w-12 h-12 bg-gray-50 hover:bg-tech-gradient rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300 tech-border-hover hover:scale-110"
              >
                ‹
              </button>
              <button
                onClick={() =>
                  goToPartner((activePartner + 1) % partnerships.length)
                }
                className="w-12 h-12 bg-gray-50 hover:bg-tech-gradient rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300 tech-border-hover hover:scale-110"
              >
                ›
              </button>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center gap-2 mt-6">
              {partnerships.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPartner(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === activePartner
                      ? "bg-tech-gradient w-8 animate-pulse"
                      : "bg-gray-400 hover:bg-tech-gradient w-3"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cases de Sucesso */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Cases de <span className="text-gradient">Sucesso</span>
          </h3>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {successCases.map((case_, index) => (
              <div key={case_.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-center mb-4">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{case_.sector}</h4>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {case_.size}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-1">🎯 Desafio:</h5>
                    <p className="text-gray-600 text-sm">{case_.challenge}</p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-1">💡 Solução:</h5>
                    <p className="text-gray-600 text-sm">{case_.solution}</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-3">
                    <h5 className="font-semibold text-green-900 mb-1">📊 Resultado:</h5>
                    <p className="text-green-800 text-sm font-medium">{case_.result}</p>
                  </div>

                  <div className="text-center">
                    <span className="inline-block bg-tech-gradient text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Concluído em {case_.timeframe}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Quer ser nosso próximo case de sucesso?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Solicite um diagnóstico gratuito e descubra como podemos migrar 
            sua empresa para Microsoft 365 com segurança total
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-4 animate-gradient hover:scale-105 transition-all duration-300"
              onClick={() => navigationService.requestMigration()}
            >
              Começar Minha Migração
            </button>
            <a 
              href="https://wa.me/5512992367544" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-all duration-300 text-center"
            >
              WhatsApp: (12) 99236-7544
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}