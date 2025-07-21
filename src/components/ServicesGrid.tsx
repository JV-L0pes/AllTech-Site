"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Check, Clock, Users, Zap } from "lucide-react";

// Domain Types
interface ServiceFeature {
  id: string;
  name: string;
  description: string;
}

interface ServiceBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ServiceDetails {
  id: string;
  overview: string;
  duration: string;
  targetAudience: string;
  prerequisites: string;
  features: ServiceFeature[];
  benefits: ServiceBenefit[];
  deliverables: string[];
  methodology: string;
}

export default function ServicesGrid() {
  const [activeService, setActiveService] = useState(0);
  const [expandedService, setExpandedService] = useState<number | null>(null);

  // Domain Service - Service Data Management com detalhes personalizados
  const servicesData = [
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
      details: {
        id: "implementacao-software",
        overview: "Transformamos suas necessidades específicas de negócio em soluções de software robustas e escaláveis. Utilizamos metodologias ágeis modernas como Scrum e Kanban, garantindo entregas incrementais e feedback contínuo durante todo o processo de desenvolvimento.",
        duration: "3-8 meses (conforme complexidade)",
        targetAudience: "Empresas que precisam de sistemas ERP, CRM, gestão de estoque, automação de processos ou integração de sistemas",
        prerequisites: "Mapeamento dos processos atuais, definição de requisitos funcionais e aprovação de orçamento",
        features: [
          { id: "req-analysis", name: "Levantamento de Requisitos", description: "Análise detalhada dos processos de negócio e necessidades específicas da empresa" },
          { id: "agile-dev", name: "Desenvolvimento Ágil", description: "Metodologia Scrum com sprints de 2 semanas e demonstrações regulares" },
          { id: "integration", name: "Integração Completa", description: "APIs REST/SOAP para integração com ERPs, bancos de dados e sistemas terceiros" },
          { id: "testing", name: "Testes Rigorosos", description: "Testes unitários, integração e homologação em ambiente controlado" },
          { id: "deployment", name: "Deploy Profissional", description: "Migração de dados, rollback automático e deploy sem downtime" }
        ],
        benefits: [
          { id: "efficiency", title: "Eficiência Operacional", description: "Redução de 60-80% no tempo de processos manuais", icon: "⚡" },
          { id: "integration", title: "Integração Total", description: "Unificação de dados e eliminação de retrabalho", icon: "🔗" },
          { id: "scalability", title: "Escalabilidade", description: "Arquitetura preparada para crescimento da empresa", icon: "📈" },
          { id: "roi", title: "ROI Comprovado", description: "Retorno do investimento em 12-18 meses", icon: "💰" }
        ],
        deliverables: [
          "Sistema completo desenvolvido em tecnologias modernas (React, Node.js, .NET)",
          "Documentação técnica completa e manual do usuário ilustrado",
          "Código-fonte organizado com comentários e padrões de desenvolvimento",
          "Scripts de banco de dados e procedures otimizadas",
          "Plano de backup automatizado e disaster recovery",
          "3 meses de suporte técnico gratuito incluído"
        ],
        methodology: "Seguimos metodologia ágil com Design Thinking para entender profundamente as necessidades do usuário. Utilizamos arquitetura em microsserviços para garantir flexibilidade e escalabilidade. Cada sprint inclui: planning, desenvolvimento, testes automatizados, code review e demonstração para o cliente."
      }
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
      details: {
        id: "treinamentos-microsoft",
        overview: "Nossos treinamentos Microsoft combinam teoria e prática intensiva, ministrados por instrutores com certificações MCT (Microsoft Certified Trainer) e experiência real em projetos corporativos. Utilizamos cenários reais da sua empresa para garantir aplicabilidade imediata.",
        duration: "1-5 dias por módulo (flexível conforme necessidade)",
        targetAudience: "Profissionais de TI, desenvolvedores, analistas de BI, gestores e usuários finais que trabalham com tecnologias Microsoft",
        prerequisites: "Conhecimentos básicos em informática, acesso às plataformas Microsoft e motivação para aprender",
        features: [
          { id: "office365", name: "Office 365 Avançado", description: "SharePoint, Teams, OneDrive, Planner e automações com Power Automate" },
          { id: "azure-fundamentals", name: "Azure Cloud", description: "Máquinas virtuais, storage, redes, Active Directory e segurança" },
          { id: "power-platform", name: "Power Platform Completo", description: "Power BI para dashboards, Power Apps para aplicativos e Power Automate para workflows" },
          { id: "teams-advanced", name: "Teams Empresarial", description: "Configurações avançadas, integrações e governança corporativa" },
          { id: "certification", name: "Preparação para Certificações", description: "AZ-900, PL-900, MS-900 e outras certificações fundamentais Microsoft" }
        ],
        benefits: [
          { id: "productivity", title: "Produtividade Imediata", description: "Aplicação prática dos conhecimentos no primeiro dia", icon: "🚀" },
          { id: "certification", title: "Certificação Oficial", description: "Vouchers para exames Microsoft inclusos", icon: "🏆" },
          { id: "support", title: "Suporte Continuado", description: "30 dias de mentoria pós-treinamento via Teams", icon: "🤝" },
          { id: "materials", title: "Material Premium", description: "Apostilas atualizadas e acesso a laboratórios virtuais", icon: "📚" }
        ],
        deliverables: [
          "Certificado de participação AllTech Digital reconhecido pelo mercado",
          "Material didático atualizado com as últimas versões Microsoft",
          "Acesso a ambiente de laboratório por 60 dias para prática",
          "Voucher oficial Microsoft para exame de certificação",
          "Sessões de mentoria individual por 30 dias",
          "Acesso vitalício a atualizações do material do curso"
        ],
        methodology: "Metodologia 70-20-10: 70% prática hands-on, 20% discussões e casos reais, 10% teoria. Cada participante trabalha em seu próprio ambiente ou sandbox dedicado. Utilizamos técnicas de microlearning com sessões de 2-3 horas para maximizar retenção do conhecimento."
      }
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
      details: {
        id: "cloud-service",
        overview: "Executamos migrações completas para Microsoft Azure seguindo o Cloud Adoption Framework (CAF). Nossa abordagem estratégica garante migração segura, otimização de custos e compliance com LGPD/GDPR, resultando em infraestrutura moderna e resiliente.",
        duration: "4-12 meses (dependendo da complexidade da infraestrutura)",
        targetAudience: "Empresas com infraestrutura on-premises que desejam modernizar, reduzir custos ou melhorar escalabilidade",
        prerequisites: "Inventário da infraestrutura atual, definição de objetivos de negócio e orçamento aprovado para migração",
        features: [
          { id: "assessment", name: "Assessment Detalhado", description: "Azure Migrate para análise completa de workloads, dependências e custos" },
          { id: "migration-strategy", name: "Estratégia de Migração", description: "Lift-and-shift, re-platforming ou re-architecting conforme necessidade" },
          { id: "security", name: "Segurança Avançada", description: "Azure Security Center, Key Vault, identity management e compliance LGPD" },
          { id: "monitoring", name: "Monitoramento Proativo", description: "Azure Monitor, alertas automatizados e dashboards executivos" },
          { id: "cost-optimization", name: "Otimização Contínua", description: "Azure Cost Management, reserved instances e auto-scaling" }
        ],
        benefits: [
          { id: "cost-reduction", title: "Redução de Custos", description: "25-40% de economia em infraestrutura no primeiro ano", icon: "💰" },
          { id: "scalability", title: "Escalabilidade Infinita", description: "Recursos sob demanda sem investimento em hardware", icon: "📊" },
          { id: "security", title: "Segurança Enterprise", description: "Proteção multicamadas com certificações internacionais", icon: "🔒" },
          { id: "availability", title: "Alta Disponibilidade", description: "SLA 99.95% com disaster recovery automatizado", icon: "🌐" }
        ],
        deliverables: [
          "Infraestrutura cloud completamente configurada e otimizada no Azure",
          "Documentação detalhada de arquitetura e procedimentos operacionais",
          "Plano de disaster recovery testado e validado",
          "Dashboard executivo para monitoramento de custos e performance",
          "Políticas de backup automatizadas com retenção configurável",
          "Treinamento operacional para equipe técnica interna"
        ],
        methodology: "Seguimos rigorosamente o Microsoft Cloud Adoption Framework com 6 fases: Strategy (definição de objetivos), Plan (roadmap detalhado), Ready (preparação do ambiente), Adopt (migração gradual), Govern (governança e políticas) e Manage (operação otimizada). Cada fase inclui checkpoints e validações."
      }
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
      details: {
        id: "inteligencia-artificial",
        overview: "Desenvolvemos soluções de IA personalizadas usando Azure Cognitive Services, OpenAI e frameworks como TensorFlow. Nosso foco é resolver problemas reais de negócio através de automação inteligente, análise preditiva e processamento de linguagem natural.",
        duration: "3-9 meses (dependendo da complexidade dos modelos de IA)",
        targetAudience: "Empresas com grandes volumes de dados, processos repetitivos ou necessidade de insights preditivos para tomada de decisão",
        prerequisites: "Base de dados históricos, definição clara dos objetivos de IA e equipe interna designada para validação",
        features: [
          { id: "chatbots", name: "Chatbots Inteligentes", description: "Azure Bot Framework com processamento de linguagem natural e integração com sistemas internos" },
          { id: "predictive", name: "Análise Preditiva", description: "Modelos de machine learning para forecasting, detecção de anomalias e análise de tendências" },
          { id: "rpa", name: "RPA Avançado", description: "Power Automate Desktop com IA para automação de processos complexos e documentos" },
          { id: "computer-vision", name: "Visão Computacional", description: "Reconhecimento de documentos, OCR inteligente e análise de imagens" },
          { id: "analytics", name: "Analytics com IA", description: "Power BI com AI insights, clustering automático e detecção de padrões" }
        ],
        benefits: [
          { id: "automation", title: "Automação Massiva", description: "70-90% dos processos manuais automatizados com IA", icon: "🤖" },
          { id: "insights", title: "Insights Preditivos", description: "Previsões precisas para planejamento estratégico", icon: "💡" },
          { id: "efficiency", title: "Eficiência Extrema", description: "Redução de 50-70% no tempo de análise de dados", icon: "⚡" },
          { id: "competitive", title: "Vantagem Competitiva", description: "Decisões baseadas em IA para superar concorrentes", icon: "🎯" }
        ],
        deliverables: [
          "Modelos de IA treinados e validados com seus dados reais",
          "APIs personalizadas para integração com sistemas existentes",
          "Interface web responsiva para interação com modelos de IA",
          "Pipeline de dados automatizado para retreinamento contínuo",
          "Documentação técnica detalhada e guias de uso",
          "Transferência completa de conhecimento e código-fonte"
        ],
        methodology: "Aplicamos metodologia CRISP-DM adaptada para IA: Business Understanding (entendimento do negócio), Data Understanding (análise exploratória), Data Preparation (limpeza e feature engineering), Modeling (desenvolvimento e teste de algoritmos), Evaluation (validação com métricas de negócio) e Deployment (produção com monitoramento contínuo)."
      }
    },
  ];

  // Business Logic - Service Expansion Management
  const handleServiceToggle = (serviceId: number) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  const isServiceExpanded = (serviceId: number) => {
    return expandedService === serviceId;
  };

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

        {/* Grid de serviços com expansão corrigida */}
        <div className="mb-16 space-y-8">
          {/* Primeira linha: Serviços 0 e 1 */}
          <div>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Implementação de Software */}
              <div className="relative">
                <div
                  className={`card-hover bg-gray-50 rounded-2xl p-8 border-2 transition-all duration-300 cursor-pointer group ${
                    activeService === 0
                      ? "border-tech-gradient shadow-xl shadow-tech-gradient/20 scale-105"
                      : "border-gray-300 hover:border-tech-gradient/50"
                  }`}
                  onClick={() => setActiveService(0)}
                >
                  {/* Header do card */}
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${servicesData[0].color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0 hover:scale-110 transition-transform duration-300`}
                    >
                      {servicesData[0].icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-tech-cyan transition-all duration-300">
                        {servicesData[0].title}
                      </h3>
                      <p className="text-tech-cyan font-semibold">
                        {servicesData[0].subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Descrição */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {servicesData[0].description}
                  </p>

                  {/* Lista de features */}
                  <div className="space-y-3">
                    {servicesData[0].features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <div
                          className={`w-2 h-2 bg-gradient-to-r ${servicesData[0].color} rounded-full mr-3 flex-shrink-0 animate-pulse`}
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
                    <button 
                      className="btn-secondary w-full hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceToggle(0);
                      }}
                    >
                      Saiba Mais
                      {isServiceExpanded(0) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Treinamentos Microsoft */}
              <div className="relative">
                <div
                  className={`card-hover bg-gray-50 rounded-2xl p-8 border-2 transition-all duration-300 cursor-pointer group ${
                    activeService === 1
                      ? "border-tech-gradient shadow-xl shadow-tech-gradient/20 scale-105"
                      : "border-gray-300 hover:border-tech-gradient/50"
                  }`}
                  onClick={() => setActiveService(1)}
                >
                  {/* Header do card */}
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${servicesData[1].color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0 hover:scale-110 transition-transform duration-300`}
                    >
                      {servicesData[1].icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-tech-cyan transition-all duration-300">
                        {servicesData[1].title}
                      </h3>
                      <p className="text-tech-cyan font-semibold">
                        {servicesData[1].subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Descrição */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {servicesData[1].description}
                  </p>

                  {/* Lista de features */}
                  <div className="space-y-3">
                    {servicesData[1].features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <div
                          className={`w-2 h-2 bg-gradient-to-r ${servicesData[1].color} rounded-full mr-3 flex-shrink-0 animate-pulse`}
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
                    <button 
                      className="btn-secondary w-full hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceToggle(1);
                      }}
                    >
                      Saiba Mais
                      {isServiceExpanded(1) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    </div>
                </div>
              </div>
            </div>

            {/* Painel para primeira linha (serviços 0 ou 1) */}
            {(isServiceExpanded(0) || isServiceExpanded(1)) && (
              <div className="mt-6">
                <div className="overflow-hidden transition-all duration-500 ease-in-out opacity-100">
                  <div className="bg-white rounded-2xl p-8 border-2 border-tech-gradient/30 shadow-lg">
                    <ServiceDetailsPanel service={servicesData[expandedService!].details} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Segunda linha: Serviços 2 e 3 */}
          <div>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Cloud Service */}
              <div className="relative">
                <div
                  className={`card-hover bg-gray-50 rounded-2xl p-8 border-2 transition-all duration-300 cursor-pointer group ${
                    activeService === 2
                      ? "border-tech-gradient shadow-xl shadow-tech-gradient/20 scale-105"
                      : "border-gray-300 hover:border-tech-gradient/50"
                  }`}
                  onClick={() => setActiveService(2)}
                >
                  {/* Header do card */}
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${servicesData[2].color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0 hover:scale-110 transition-transform duration-300`}
                    >
                      {servicesData[2].icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-tech-cyan transition-all duration-300">
                        {servicesData[2].title}
                      </h3>
                      <p className="text-tech-cyan font-semibold">
                        {servicesData[2].subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Descrição */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {servicesData[2].description}
                  </p>

                  {/* Lista de features */}
                  <div className="space-y-3">
                    {servicesData[2].features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <div
                          className={`w-2 h-2 bg-gradient-to-r ${servicesData[2].color} rounded-full mr-3 flex-shrink-0 animate-pulse`}
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
                    <button 
                      className="btn-secondary w-full hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceToggle(2);
                      }}
                    >
                      Saiba Mais
                      {isServiceExpanded(2) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Inteligência Artificial */}
              <div className="relative">
                <div
                  className={`card-hover bg-gray-50 rounded-2xl p-8 border-2 transition-all duration-300 cursor-pointer group ${
                    activeService === 3
                      ? "border-tech-gradient shadow-xl shadow-tech-gradient/20 scale-105"
                      : "border-gray-300 hover:border-tech-gradient/50"
                  }`}
                  onClick={() => setActiveService(3)}
                >
                  {/* Header do card */}
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${servicesData[3].color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0 hover:scale-110 transition-transform duration-300`}
                    >
                      {servicesData[3].icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-tech-cyan transition-all duration-300">
                        {servicesData[3].title}
                      </h3>
                      <p className="text-tech-cyan font-semibold">
                        {servicesData[3].subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Descrição */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {servicesData[3].description}
                  </p>

                  {/* Lista de features */}
                  <div className="space-y-3">
                    {servicesData[3].features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <div
                          className={`w-2 h-2 bg-gradient-to-r ${servicesData[3].color} rounded-full mr-3 flex-shrink-0 animate-pulse`}
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
                    <button 
                      className="btn-secondary w-full hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceToggle(3);
                      }}
                    >
                      Saiba Mais
                      {isServiceExpanded(3) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Painel para segunda linha (serviços 2 ou 3) */}
            {(isServiceExpanded(2) || isServiceExpanded(3)) && (
              <div className="mt-6">
                <div className="overflow-hidden transition-all duration-500 ease-in-out opacity-100">
                  <div className="bg-white rounded-2xl p-8 border-2 border-tech-gradient/30 shadow-lg">
                    <ServiceDetailsPanel service={servicesData[expandedService!].details} />
                  </div>
                </div>
              </div>
            )}
          </div>
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

// Service Details Panel Component - Layout mais compacto e sem cortes
const ServiceDetailsPanel = ({ service }: { service: ServiceDetails }) => {
  return (
    <div className="space-y-6">
      {/* Cabeçalho do painel */}
      <div className="border-b border-gray-200 pb-4">
        <h4 className="text-2xl font-bold text-gray-900 mb-3">Detalhes do Serviço</h4>
        <p className="text-gray-600 leading-relaxed">{service.overview}</p>
      </div>

      {/* Layout em colunas para aproveitar largura total */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Coluna 1: Informações gerais + Features */}
        <div className="space-y-4">
          {/* Informações gerais */}
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-tech-cyan" />
                <h5 className="font-semibold text-gray-900 text-sm">Duração</h5>
              </div>
              <p className="text-xs text-gray-600">{service.duration}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-tech-cyan" />
                <h5 className="font-semibold text-gray-900 text-sm">Público-Alvo</h5>
              </div>
              <p className="text-xs text-gray-600">{service.targetAudience}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Check className="w-4 h-4 text-tech-cyan" />
                <h5 className="font-semibold text-gray-900 text-sm">Pré-requisitos</h5>
              </div>
              <p className="text-xs text-gray-600">{service.prerequisites}</p>
            </div>
          </div>

          {/* Features principais (limitadas) */}
          <div>
            <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-tech-cyan" />
              Principais Features
            </h5>
            <div className="space-y-2">
              {service.features.slice(0, 3).map((feature) => (
                <div key={feature.id} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100">
                  <h6 className="font-semibold text-gray-900 mb-1 text-xs">{feature.name}</h6>
                  <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
              {service.features.length > 3 && (
                <p className="text-xs text-gray-500 italic">+ {service.features.length - 3} características adicionais</p>
              )}
            </div>
          </div>
        </div>

        {/* Coluna 2: Benefícios + Entregáveis */}
        <div className="space-y-4">
          {/* Benefícios principais */}
          <div>
            <h5 className="text-sm font-bold text-gray-900 mb-3">Principais Benefícios</h5>
            <div className="space-y-2">
              {service.benefits.slice(0, 2).map((benefit) => (
                <div key={benefit.id} className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{benefit.icon}</span>
                    <div>
                      <h6 className="font-semibold text-gray-900 mb-1 text-xs">{benefit.title}</h6>
                      <p className="text-xs text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              {service.benefits.length > 2 && (
                <p className="text-xs text-gray-500 italic">+ {service.benefits.length - 2} benefícios adicionais</p>
              )}
            </div>
          </div>

          {/* Entregáveis principais */}
          <div>
            <h5 className="text-sm font-bold text-gray-900 mb-3">Principais Entregáveis</h5>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2">
                {service.deliverables.slice(0, 3).map((deliverable, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-tech-gradient rounded-full mt-1.5 flex-shrink-0"></div>
                    <span className="text-gray-700 text-xs leading-relaxed">{deliverable}</span>
                  </li>
                ))}
                {service.deliverables.length > 3 && (
                  <li className="text-xs text-gray-500 italic">+ {service.deliverables.length - 3} itens adicionais</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Coluna 3: Metodologia + CTA */}
        <div className="space-y-4">
          {/* Metodologia resumida */}
          <div>
            <h5 className="text-sm font-bold text-gray-900 mb-3">Nossa Metodologia</h5>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-gray-700 leading-relaxed text-xs">{service.methodology.substring(0, 200)}...</p>
            </div>
          </div>

          {/* Call to Action compacto */}
          <div className="bg-tech-gradient rounded-lg p-4 text-center text-white">
            <h5 className="text-sm font-bold mb-2">Interessado neste serviço?</h5>
            <p className="mb-3 opacity-90 text-xs">Entre em contato para orçamento personalizado</p>
            <div className="space-y-2">
              <button className="bg-white text-tech-cyan font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 w-full text-xs">
                Solicitar Orçamento
              </button>
              <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 hover:scale-105 w-full text-xs">
                Agendar Reunião
              </button>
            </div>
          </div>

          {/* Informação adicional compacta */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h6 className="font-semibold text-gray-900 mb-1 flex items-center gap-1 text-xs">
              💡 Dica Importante
            </h6>
            <p className="text-xs text-gray-600 leading-relaxed">
              Suporte técnico especializado e garantia de satisfação inclusos. 
              Consultoria gratuita para avaliar suas necessidades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};