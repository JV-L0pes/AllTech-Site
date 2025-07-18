export default function ValueProposition() {
  const features = [
    {
      icon: "📊",
      title: "Análise Completa",
      description:
        "Mapeamento detalhado da sua infraestrutura atual e identificação de oportunidades de melhoria.",
    },
    {
      icon: "🎯",
      title: "Estratégia Personalizada",
      description:
        "Plano de ação sob medida para suas necessidades específicas e objetivos de negócio.",
    },
    {
      icon: "⚡",
      title: "Implementação Ágil",
      description:
        "Execução rápida e eficiente com metodologias comprovadas e melhores práticas.",
    },
    {
      icon: "📈",
      title: "Resultados Mensuráveis",
      description:
        "Acompanhamento contínuo com métricas claras e relatórios de performance.",
    },
  ];

  return (
    <section className="section-padding bg-gray-100">
      <div className="container mx-auto">
        {/* Título principal */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Por que escolher a{" "}
            <span className="text-gradient">AllTech Digital</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Oferecemos soluções completas e personalizadas, desde a análise de
            mercado e definição de estratégias até a implementação de campanhas
            de alta performance e otimização contínua com IA. Não se trata
            apenas de ferramentas, mas de uma
            <span className="text-tech-cyan font-semibold">
              {" "}
              parceria focada em resultados mensuráveis
            </span>{" "}
            e crescimento sustentável para o seu negócio.
          </p>
        </div>

        {/* Grid de características */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card-hover bg-gray-50 p-6 rounded-xl tech-border-hover text-center tech-shadow group"
            >
              <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-tech-cyan transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Seção de destaque */}
        <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 tech-border-hover tech-shadow">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Parceria <span className="text-tech-cyan font-bold">Microsoft Gold</span>
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Como parceiros oficiais Gold da Microsoft, temos acesso
                privilegiado às mais recentes tecnologias, treinamentos
                exclusivos e suporte técnico especializado. Isso garante que
                nossos clientes sempre recebam soluções de ponta com a máxima
                qualidade e confiabilidade.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                  <span className="w-2 h-2 bg-tech-gradient rounded-full mr-3 animate-pulse"></span>
                  Acesso antecipado a novas tecnologias Microsoft
                </li>
                <li className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                  <span className="w-2 h-2 bg-tech-gradient rounded-full mr-3 animate-pulse animation-delay-200"></span>
                  Suporte técnico direto da Microsoft
                </li>
                <li className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                  <span className="w-2 h-2 bg-tech-gradient rounded-full mr-3 animate-pulse animation-delay-400"></span>
                  Certificações e treinamentos exclusivos
                </li>
                <li className="flex items-center text-gray-700 hover:text-gray-900 transition-colors">
                  <span className="w-2 h-2 bg-tech-gradient rounded-full mr-3 animate-pulse animation-delay-600"></span>
                  Descontos especiais em licenças
                </li>
              </ul>
            </div>

            {/* Coluna do troféu e selo Microsoft */}
            <div className="flex flex-row items-center justify-center text-center gap-6">
              <div className="inline-block bg-tech-gradient p-8 rounded-2xl hover:scale-105 transition-transform duration-300 animate-pulse-tech">
                <span className="text-6xl text-white">🏆</span>
              </div>
              <div className="flex flex-col items-start text-left">
                <h4 className="text-2xl font-bold text-gradient mb-2">
                  Microsoft Gold Partner
                </h4>
                <p className="text-gray-500">
                  Certificação de excelência em soluções Microsoft
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Pronto para transformar sua empresa?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Solicite um diagnóstico gratuito e descubra como podemos otimizar
            sua infraestrutura tecnológica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-4 animate-gradient hover:scale-105 transition-all duration-300">
              Solicitar Diagnóstico Gratuito
            </button>
            <button className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-all duration-300">
              Ver Cases de Sucesso
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}