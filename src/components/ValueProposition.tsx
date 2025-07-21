export default function ValueProposition() {
  const features = [
    {
      icon: "🔄",
      title: "Metodologia PDCA",
      description:
        "Plan, Do, Check, Act - Nossa metodologia comprovada garante execução controlada e melhoria contínua em cada projeto.",
    },
    {
      icon: "🛡️",
      title: "Migração Segura",
      description:
        "100% dos dados preservados durante migração para Microsoft 365. Zero downtime e validação completa de integridade.",
    },
    {
      icon: "⚡",
      title: "Entrega Ágil",
      description:
        "Projetos de migração concluídos em 2-6 semanas com metodologia ágil e execução por lotes controlados.",
    },
    {
      icon: "🎯",
      title: "Foco Especializado",
      description:
        "Especializados em empresas de 50-500 colaboradores. Entrega com empatia, responsabilidade e suporte completo.",
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
            Somos especialistas em{" "}
            <span className="text-tech-cyan font-semibold">
              migração para Microsoft 365
            </span>{" "}
            com metodologia PDCA comprovada. Oferecemos uma{" "}
            <span className="text-tech-cyan font-semibold">
              parceria focada em resultados seguros
            </span>{" "}
            e modernização da sua infraestrutura de TI.
          </p>
        </div>

        {/* Grid de características principais */}
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

        {/* Seção de especialização Microsoft - Melhor contraste */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 lg:p-12 text-white shadow-xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 text-2xl">🏆</span>
                </div>
                Especialistas Microsoft Certificados
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Nossa equipe possui certificações oficiais Microsoft e experiência comprovada 
                em projetos de migração. Garantimos implementações seguras seguindo as 
                melhores práticas recomendadas pela Microsoft.
              </p>
              <div className="grid gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-blue-400">
                  <h4 className="text-blue-400 font-semibold mb-1">Certificações Microsoft</h4>
                  <p className="text-white text-sm">AI-900, AZ-900, DP-900, AI-102, PL-900</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-green-400">
                  <h4 className="text-green-400 font-semibold mb-1">Metodologias Ágeis</h4>
                  <p className="text-white text-sm">SCRUM, KANBAN e PDCA</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 border-l-4 border-purple-400">
                  <h4 className="text-purple-400 font-semibold mb-1">Especialização</h4>
                  <p className="text-white text-sm">Empresas de 50-500 colaboradores • Atendimento mundial</p>
                </div>
              </div>
            </div>

            {/* Coluna dos badges de certificação - Melhor visualização */}
            <div className="text-center">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
                <h4 className="text-2xl font-bold text-white mb-6">
                  Certificações da Equipe
                </h4>
                
                {/* Certificações Microsoft */}
                <div className="mb-6">
                  <h5 className="text-blue-400 font-semibold text-sm mb-3">Microsoft Certified</h5>
                  <div className="grid grid-cols-3 gap-2">
                    {['AI-900', 'AZ-900', 'DP-900', 'AI-102', 'PL-900'].map((cert) => (
                      <div key={cert} className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-2 hover:bg-blue-600/30 transition-colors">
                        <span className="text-blue-300 font-bold text-xs">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metodologias */}
                <div>
                  <h5 className="text-green-400 font-semibold text-sm mb-3">Metodologias Ágeis</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {['SCRUM', 'KANBAN'].map((cert) => (
                      <div key={cert} className="bg-green-600/20 border border-green-500/30 rounded-lg p-2 hover:bg-green-600/30 transition-colors">
                        <span className="text-green-300 font-bold text-xs">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-gray-400 text-xs">
                    Certificações oficiais e metodologias comprovadas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}