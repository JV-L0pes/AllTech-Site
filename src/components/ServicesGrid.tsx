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

  // Domain Service - Service Data Management com serviços reais do cliente
  const servicesData = [
    {
      id: 1,
      icon: "🔄",
      title: "Migração para Microsoft 365",
      subtitle: "Modernize sua infraestrutura de TI com segurança total",
      description:
        "Realizamos projetos completos de migração de ambientes e dados, garantindo continuidade operacional, segurança e preservação da integridade das informações durante todo o processo.",
      features: [
        "Google Workspace para Microsoft 365",
        "Migração entre tenants Microsoft 365",
        "Slack para Microsoft Teams",
        "SharePoint Online com estruturação completa",
        "Automação e monitoramento em tempo real",
      ],
      color: "from-tech-cyan to-tech-cyan",
      details: {
        id: "migracao-microsoft365",
        overview: "Especializamos-nos em projetos completos de migração de ambientes e dados, com foco em empresas que desejam modernizar sua infraestrutura de TI. Nossa metodologia PDCA garante planejamento detalhado, execução controlada e resultados mensuráveis.",
        duration: "2-6 semanas (conforme complexidade do ambiente)",
        targetAudience: "Empresas entre 50-500 colaboradores que utilizam Google Workspace, tenants Microsoft separados ou plataformas como Slack",
        prerequisites: "Levantamento do ambiente atual, definição de estratégia de migração e aprovação de orçamento. Inclui avaliação gratuita do ambiente e planejamento detalhado.",
        features: [
          { id: "google-to-m365", name: "Google Workspace → Microsoft 365", description: "Migração completa de e-mails, contatos, calendários, Google Drive para OneDrive/SharePoint" },
          { id: "cross-tenant", name: "Cross-tenant Microsoft 365", description: "Migração nativa entre tenants com configuração de endpoints e trust" },
          { id: "slack-teams", name: "Slack → Microsoft Teams", description: "Migração de canais, mensagens históricas e estruturação de equipes" },
          { id: "sharepoint-migration", name: "Migração SharePoint Online", description: "Estruturação documental, recriação de hierarquias e permissões" },
          { id: "automation", name: "Automação Completa", description: "Scripts personalizados com logs detalhados e monitoramento em tempo real" }
        ],
        benefits: [
          { id: "modernization", title: "Modernização Completa", description: "Consolidação de plataformas e aumento da segurança", icon: "🚀" },
          { id: "data-preservation", title: "Preservação Total", description: "100% dos dados, estruturas e permissões preservados", icon: "🛡️" },
          { id: "cost-reduction", title: "Redução de Custos", description: "Eliminação de múltiplas plataformas e licenças", icon: "💰" },
          { id: "business-continuity", title: "Continuidade Operacional", description: "Migração com interrupção mínima dos negócios", icon: "⚡" }
        ],
        deliverables: [
          "Ambiente Microsoft 365 completamente configurado e funcional",
          "Migração completa de todos os dados com validação de integridade",
          "Documentação técnica detalhada do processo e configurações",
          "Treinamento para usuários finais no novo ambiente",
          "Suporte pós-migração por período determinado",
          "Relatório final com métricas e validações realizadas"
        ],
        methodology: "Utilizamos metodologia PDCA (Plan-Do-Check-Act) com abordagem ágil: 1) PLAN - Análise detalhada do ambiente e planejamento da migração, 2) DO - Execução por lotes para reduzir impacto, 3) CHECK - Validação contínua e logs detalhados, 4) ACT - Ajustes e otimizações baseados nos resultados."
      }
    },
    {
      id: 2,
      icon: "🎓",
      title: "Treinamentos Microsoft",
      subtitle: "Capacitação especializada com certificações oficiais",
      description:
        "Treinamentos práticos ministrados por instrutores certificados MCT, focados na aplicação real das tecnologias Microsoft no dia a dia da sua empresa.",
      features: [
        "Office 365 e Microsoft Teams avançado",
        "Azure Cloud Computing fundamentals",
        "Power Platform (BI, Apps, Automate)",
        "Preparação para certificações oficiais",
        "Metodologia hands-on personalizada",
      ],
      color: "from-tech-cyan to-tech-cyan",
      details: {
        id: "treinamentos-microsoft",
        overview: "Oferecemos treinamentos especializados em tecnologias Microsoft, ministrados por instrutores com certificações MCT e experiência prática em projetos corporativos. Nossa abordagem combina teoria essencial com prática intensiva usando cenários reais da sua empresa.",
        duration: "1-5 dias por módulo (flexível conforme necessidade da empresa)",
        targetAudience: "Profissionais de TI, analistas, gestores e usuários finais que trabalham com tecnologias Microsoft",
        prerequisites: "Conhecimentos básicos em informática, acesso às plataformas Microsoft e disponibilidade para dedicação integral",
        features: [
          { id: "office365-advanced", name: "Office 365 Avançado", description: "SharePoint, Teams, OneDrive, Planner e automações com Power Automate" },
          { id: "azure-fundamentals", name: "Azure Fundamentals", description: "VMs, storage, redes, Active Directory e conceitos de segurança na nuvem" },
          { id: "power-platform", name: "Power Platform Completo", description: "Power BI para dashboards, Power Apps para aplicações e Power Automate para workflows" },
          { id: "teams-enterprise", name: "Teams Empresarial", description: "Configurações avançadas, integrações corporativas e governança" },
          { id: "certification-prep", name: "Prep. Certificações", description: "AZ-900, AI-900, PL-900, DP-900 e outras fundamentals Microsoft" }
        ],
        benefits: [
          { id: "immediate-application", title: "Aplicação Imediata", description: "Conhecimentos aplicáveis no primeiro dia de trabalho", icon: "⚡" },
          { id: "official-certification", title: "Certificação Oficial", description: "Vouchers para exames Microsoft inclusos", icon: "🏆" },
          { id: "ongoing-support", title: "Suporte Continuado", description: "30 dias de mentoria pós-treinamento", icon: "🤝" },
          { id: "premium-materials", title: "Material Premium", description: "Apostilas atualizadas e laboratórios virtuais", icon: "📚" }
        ],
        deliverables: [
          "Certificado AllTech Digital reconhecido pelo mercado",
          "Material didático atualizado com últimas versões Microsoft",
          "Acesso a ambiente de laboratório por 60 dias",
          "Voucher oficial Microsoft para exame de certificação",
          "30 dias de mentoria individual pós-treinamento",
          "Acesso vitalício a atualizações do material"
        ],
        methodology: "Metodologia 70-20-10: 70% prática hands-on em ambiente real, 20% discussões de casos práticos da empresa, 10% teoria essencial. Utilizamos microlearning com sessões de 2-3 horas para maximizar retenção e aplicação do conhecimento."
      }
    },
    {
      id: 3,
      icon: "☁️",
      title: "Consultoria em Cloud",
      subtitle: "Estratégia e otimização para ambientes em nuvem",
      description:
        "Consultoria especializada para planejamento, implementação e otimização de infraestruturas cloud, com foco em Microsoft Azure e melhores práticas do mercado.",
      features: [
        "Análise de infraestrutura atual",
        "Planejamento de arquitetura cloud",
        "Otimização de custos operacionais",
        "Implementação de boas práticas",
        "Monitoramento e governança",
      ],
      color: "from-tech-cyan to-tech-cyan",
      details: {
        id: "consultoria-cloud",
        overview: "Oferecemos consultoria estratégica para empresas que desejam migrar para a nuvem ou otimizar seus ambientes cloud existentes. Nossa expertise em Microsoft Azure e metodologias ágeis garantem implementações eficientes e sustentáveis.",
        duration: "2-12 semanas (dependendo da complexidade da infraestrutura)",
        targetAudience: "Empresas com infraestrutura on-premises ou ambientes cloud que precisam de otimização",
        prerequisites: "Inventário da infraestrutura atual, objetivos de negócio definidos e orçamento aprovado",
        features: [
          { id: "infrastructure-assessment", name: "Assessment Completo", description: "Análise detalhada da infraestrutura atual e identificação de oportunidades" },
          { id: "cloud-strategy", name: "Estratégia Cloud", description: "Roadmap personalizado com arquitetura recomendada e cronograma" },
          { id: "cost-optimization", name: "Otimização de Custos", description: "Análise de gastos e implementação de políticas de economia" },
          { id: "security-compliance", name: "Segurança e Compliance", description: "Implementação de controles de segurança e adequação regulatória" },
          { id: "monitoring-governance", name: "Governança Cloud", description: "Políticas de uso, monitoramento e controle de recursos" }
        ],
        benefits: [
          { id: "strategic-planning", title: "Planejamento Estratégico", description: "Roadmap claro para transformação digital", icon: "🎯" },
          { id: "cost-efficiency", title: "Eficiência de Custos", description: "20-40% de redução em gastos com infraestrutura", icon: "💰" },
          { id: "scalability", title: "Escalabilidade", description: "Arquitetura preparada para crescimento do negócio", icon: "📈" },
          { id: "risk-mitigation", title: "Mitigação de Riscos", description: "Implementação de controles e boas práticas", icon: "🛡️" }
        ],
        deliverables: [
          "Relatório detalhado de assessment da infraestrutura atual",
          "Roadmap estratégico para implementação cloud",
          "Documentação de arquitetura recomendada",
          "Políticas de governança e controle de custos",
          "Plano de migração com cronograma detalhado",
          "Treinamento para equipe técnica interna"
        ],
        methodology: "Aplicamos metodologia PDCA integrada com Cloud Adoption Framework (CAF) da Microsoft: PLAN (estratégia e assessment), DO (implementação gradual), CHECK (monitoramento e validação), ACT (otimização contínua). Cada fase inclui validações e aprovações do cliente."
      }
    },
    {
      id: 4,
      icon: "🤖",
      title: "Automação de Processos",
      subtitle: "Power Platform e automação inteligente",
      description:
        "Implementação de soluções de automação usando Power Platform, eliminando tarefas repetitivas e otimizando fluxos de trabalho empresariais.",
      features: [
        "Power Automate para workflows",
        "Power Apps para aplicações corporativas",
        "Power BI para análise de dados",
        "Integração com sistemas existentes",
        "Automação de processos manuais",
      ],
      color: "from-tech-cyan to-tech-cyan",
      details: {
        id: "automacao-processos",
        overview: "Desenvolvemos soluções de automação personalizadas usando Microsoft Power Platform, focando na eliminação de processos manuais e otimização de fluxos de trabalho. Nossa abordagem garante ROI rápido e adoção facilitada pelos usuários.",
        duration: "3-8 semanas (dependendo da complexidade dos processos)",
        targetAudience: "Empresas com processos manuais repetitivos, necessidade de aplicações internas ou análise de dados",
        prerequisites: "Mapeamento dos processos atuais, acesso aos sistemas envolvidos e definição de objetivos de automação",
        features: [
          { id: "power-automate", name: "Power Automate", description: "Workflows automatizados para aprovações, notificações e integrações" },
          { id: "power-apps", name: "Power Apps", description: "Aplicações corporativas sem código para processos específicos" },
          { id: "power-bi", name: "Power BI", description: "Dashboards interativos e relatórios automatizados para tomada de decisão" },
          { id: "system-integration", name: "Integração de Sistemas", description: "Conectores para ERP, CRM e outras plataformas corporativas" },
          { id: "process-optimization", name: "Otimização de Processos", description: "Análise e redesenho de fluxos para máxima eficiência" }
        ],
        benefits: [
          { id: "efficiency-gain", title: "Ganho de Eficiência", description: "60-80% de redução no tempo de processos manuais", icon: "⚡" },
          { id: "error-reduction", title: "Redução de Erros", description: "Eliminação de erros humanos em processos críticos", icon: "✅" },
          { id: "data-insights", title: "Insights de Dados", description: "Visibilidade completa dos processos com métricas em tempo real", icon: "📊" },
          { id: "quick-roi", title: "ROI Rápido", description: "Retorno do investimento em 6-12 meses", icon: "💰" }
        ],
        deliverables: [
          "Soluções Power Platform implementadas e funcionais",
          "Documentação técnica e manual do usuário",
          "Treinamento para usuários finais e administradores",
          "Dashboards de monitoramento dos processos automatizados",
          "Suporte técnico pós-implementação por período definido",
          "Código-fonte e configurações para futuras manutenções"
        ],
        methodology: "Utilizamos Design Thinking combinado com metodologia ágil: Descoberta (mapeamento de processos), Ideação (definição de soluções), Prototipação (desenvolvimento iterativo), Testes (validação com usuários), Implementação (deploy gradual). Cada sprint inclui validação com stakeholders."
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
            Nossos <span className="text-gradient">Serviços</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluções especializadas em Microsoft 365 e automação para
            empresas que buscam modernização e eficiência operacional
          </p>
        </div>

        {/* Grid de serviços com expansão */}
        <div className="mb-16 space-y-8">
          {/* Primeira linha: Serviços 0 e 1 */}
          <div>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Migração Microsoft 365 */}
              <div className="relative">
                <div
                  className={`card-hover bg-gray-50 rounded-2xl p-8 border-2 transition-all duration-300 cursor-pointer group ${
                    activeService === 0
                      ? "border-tech-gradient shadow-xl shadow-tech-gradient/20 scale-105"
                      : "border-gray-300 hover:border-tech-gradient/50"
                  }`}
                  onClick={() => setActiveService(0)}
                >
                  {/* Badge de destaque */}
                  <div className="absolute -top-3 left-6">
                    <div className="bg-tech-gradient text-white px-4 py-1 rounded-full text-xs font-semibold">
                      🌟 Serviço Principal
                    </div>
                  </div>

                  {/* Header do card */}
                  <div className="flex items-start gap-4 mb-6 mt-2">
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

                  {/* Destaque de preço */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-green-800 text-sm font-semibold">
                      💰 Solução sob medida para sua empresa | ⏱️ 2-6 semanas
                    </p>
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
              {/* Consultoria Cloud */}
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

              {/* Automação de Processos */}
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

        {/* Processo de trabalho - Metodologia PDCA */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-6">
            Nossa <span className="text-gradient">Metodologia PDCA</span>
          </h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Utilizamos a metodologia PDCA (Plan-Do-Check-Act) integrada com práticas ágeis 
            para garantir resultados consistentes e melhoria contínua
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "PLAN",
                title: "Planejamento",
                desc: "Análise detalhada do ambiente atual e definição da estratégia de migração",
                icon: "📋",
                bgColor: "bg-tech-cyan"
              },
              {
                step: "DO", 
                title: "Execução",
                desc: "Implementação controlada por lotes com monitoramento em tempo real",
                icon: "⚙️",
                bgColor: "bg-tech-electric"
              },
              {
                step: "CHECK",
                title: "Verificação", 
                desc: "Validação contínua dos resultados com logs detalhados e métricas",
                icon: "✅",
                bgColor: "bg-tech-deep"
              },
              {
                step: "ACT",
                title: "Ação/Melhoria",
                desc: "Ajustes e otimizações baseados nos resultados e feedback",
                icon: "🔄",
                bgColor: "bg-tech-indigo"
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 ${item.bgColor} rounded-xl flex flex-col items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl`}>
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-xs font-bold">{item.step}</div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-tech-cyan transition-colors">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Service Details Panel Component - Layout otimizado
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
              <button className="bg-white text-tech-cyan font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 w-full text-xs"
                onClick={() => {
                  window.open('https://wa.me/5512992367544?text=Olá! Gostaria de receber um orçamento personalizado.', '_blank');
                }}
              >
                Solicitar Orçamento
              </button>
              <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-300 hover:scale-105 w-full text-xs"
                onClick={() => {
                  window.open('https://wa.me/5512992367544?text=Olá! Gostaria de agendar uma reunião para conversar sobre soluções.', '_blank');
                }}
              >
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