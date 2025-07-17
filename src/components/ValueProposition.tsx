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
            <span className="text-blue-600 font-semibold">
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
              className="card-hover bg-gray-50 p-6 rounded-xl border border-gray-300 text-center shadow-sm"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Seção de destaque */}
        <div className="bg-gray-50 rounded-2xl p-8 lg:p-12 border border-gray-300 shadow-lg">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Parceria <span className="text-gradient">Microsoft Gold</span>
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Como parceiros oficiais Gold da Microsoft, temos acesso
                privilegiado às mais recentes tecnologias, treinamentos
                exclusivos e suporte técnico especializado. Isso garante que
                nossos clientes sempre recebam soluções de ponta com a máxima
                qualidade e confiabilidade.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-tech-gradient rounded-full mr-3"></span>
                  Acesso antecipado a novas tecnologias Microsoft
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-tech-gradient rounded-full mr-3"></span>
                  Suporte técnico direto da Microsoft
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-tech-gradient rounded-full mr-3"></span>
                  Certificações e treinamentos exclusivos
                </li>
                <li className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-tech-gradient rounded-full mr-3"></span>
                  Descontos especiais em licenças
                </li>
              </ul>
            </div>

            <div className="text-center">
              <div className="inline-block bg-tech-gradient p-8 rounded-2xl mb-6">
                <span className="text-6xl text-white">🏆</span>
              </div>
              <h4 className="text-2xl font-bold text-gradient mb-4">
                Microsoft Gold Partner
              </h4>
              <p className="text-gray-500">
                Certificação de excelência em soluções Microsoft
              </p>
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
            <button className="btn-primary text-lg px-8 py-4 animate-gradient">
              Solicitar Diagnóstico Gratuito
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              Ver Cases de Sucesso
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
