"use client";

import { useState } from "react";

export default function ServicesGrid() {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      id: 1,
      icon: "💻",
      title: "Implementação de Software",
      subtitle: "Sistemas personalizados para sua empresa",
      description:
        "Desenvolvemos e implementamos soluções de software sob medida, integrando perfeitamente com sua infraestrutura existente. Nossa abordagem garante máxima eficiência e produtividade.",
      features: [
        "Análise de requisitos detalhada",
        "Desenvolvimento ágil e iterativo",
        "Integração com sistemas legados",
        "Treinamento da equipe",
        "Suporte pós-implementação",
      ],
      color: "from-tech-cyan to-tech-green",
    },
    {
      id: 2,
      icon: "🎓",
      title: "Treinamentos Microsoft",
      subtitle: "Capacitação especializada e certificações",
      description:
        "Oferecemos treinamentos completos em tecnologias Microsoft, desde Office 365 até Azure. Nossa equipe certificada garante aprendizado eficaz e aplicação prática imediata.",
      features: [
        "Office 365 e Microsoft Teams",
        "Azure Cloud Computing",
        "Power Platform (Power BI, Power Apps)",
        "Certificações oficiais Microsoft",
        "Metodologia hands-on",
      ],
      color: "from-tech-cyan to-tech-green",
    },
    {
      id: 3,
      icon: "☁️",
      title: "Cloud Service",
      subtitle: "Migração e otimização na nuvem",
      description:
        "Facilitamos sua jornada para a nuvem com estratégias personalizadas, garantindo segurança, escalabilidade e redução de custos operacionais significativos.",
      features: [
        "Planejamento de migração",
        "Otimização de custos",
        "Backup e disaster recovery",
        "Monitoramento 24/7",
        "Compliance e segurança",
      ],
      color: "from-tech-cyan to-tech-green",
    },
    {
      id: 4,
      icon: "🤖",
      title: "Inteligência Artificial",
      subtitle: "Automação e análise inteligente",
      description:
        "Implementamos soluções de IA para automatizar processos, analisar dados e gerar insights valiosos que impulsionam a tomada de decisões estratégicas.",
      features: [
        "Chatbots corporativos",
        "Análise preditiva de dados",
        "Automação de processos (RPA)",
        "Machine Learning personalizado",
        "Dashboards inteligentes",
      ],
      color: "from-tech-cyan to-tech-green",
    },
  ];

  return (
    <section id="servicos" className="section-padding bg-gray-100">
      <div className="container mx-auto">
        {/* Título da seção */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Nossos <span className="text-tech-cyan font-bold">Serviços</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluções completas em tecnologia para transformar seu negócio e
            gerar resultados mensuráveis
          </p>
        </div>

        {/* Grid de serviços */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`card-hover bg-gray-50 rounded-2xl p-8 border-2 transition-all duration-300 cursor-pointer group ${
                activeService === index
                  ? "border-tech-gradient shadow-xl shadow-tech-gradient/20 scale-105"
                  : "border-gray-300 hover:border-tech-gradient/50"
              }`}
              onClick={() => setActiveService(index)}
            >
              {/* Header do card */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0 hover:scale-110 transition-transform duration-300`}
                >
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-tech-cyan transition-all duration-300">
                    {service.title}
                  </h3>
                  <p className="text-tech-cyan font-semibold">
                    {service.subtitle}
                  </p>
                </div>
              </div>

              {/* Descrição */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Lista de features */}
              <div className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <div
                      className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full mr-3 flex-shrink-0 animate-pulse`}
                      style={{
                        animationDelay: `${featureIndex * 200}ms`
                      }}
                    ></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Botão de ação */}
              <div className="mt-6 pt-6 border-t border-gray-300">
                <button className="btn-secondary w-full hover:scale-105 transition-all duration-300">
                  Saiba Mais
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Seção de destaque */}
        <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 tech-border-hover tech-shadow">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Não sabe por onde começar?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Oferecemos um{" "}
              <span className="text-tech-cyan font-semibold">
                diagnóstico gratuito{" "}
              </span>
              da sua infraestrutura tecnológica atual, identificando
              oportunidades de melhoria e criando um roadmap personalizado para
              sua empresa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="btn-primary text-lg px-8 py-4 animate-gradient hover:scale-105 transition-all duration-300">
                Solicitar Diagnóstico Gratuito
              </button>
              <div className="text-gray-500 text-sm">
                ✓ Sem compromisso • ✓ Relatório detalhado • ✓ Consultoria
                especializada
              </div>
            </div>
          </div>
        </div>

        {/* Processo de trabalho */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Como <span className="text-tech-cyan font-bold">Trabalhamos</span>
          </h3>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Análise",
                desc: "Avaliação completa da sua infraestrutura atual",
                bgColor: "bg-tech-cyan"
              },
              {
                step: "02",
                title: "Estratégia",
                desc: "Desenvolvimento de plano personalizado",
                bgColor: "bg-tech-cyan"
              },
              {
                step: "03",
                title: "Implementação",
                desc: "Execução com metodologias ágeis",
                bgColor: "bg-tech-cyan"
              },
              {
                step: "04",
                title: "Suporte",
                desc: "Acompanhamento contínuo e otimização",
                bgColor: "bg-tech-cyan"
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300 animate-pulse-tech`}>
                  {item.step}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2 transition-all duration-300">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}