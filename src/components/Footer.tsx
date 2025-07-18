import { Linkedin, Youtube, Instagram, MessageCircle, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: "Implementação de Software", href: "#servicos" },
      { name: "Treinamentos Microsoft", href: "#servicos" },
      { name: "Cloud Service", href: "#servicos" },
      { name: "Inteligência Artificial", href: "#servicos" },
    ],
    company: [
      { name: "Sobre Nós", href: "#inicio" },
      { name: "Nossa Equipe", href: "#inicio" },
      { name: "Cases de Sucesso", href: "#depoimentos" },
      { name: "Parceria Microsoft", href: "#inicio" },
    ],
    resources: [
      { name: "Blog", href: "#" },
      { name: "Whitepapers", href: "#" },
      { name: "Webinars", href: "#" },
      { name: "Suporte", href: "#contato" },
    ],
  };

  const socialLinks = [
    { name: "LinkedIn", Icon: Linkedin, href: "#", hoverColor: "hover:bg-blue-600", iconColor: "group-hover:text-white" },
    { name: "YouTube", Icon: Youtube, href: "#", hoverColor: "hover:bg-red-600", iconColor: "group-hover:text-white" },
    { name: "Instagram", Icon: Instagram, href: "https://www.instagram.com/alltech.digital/", hoverColor: "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500", iconColor: "group-hover:text-white" },
    { name: "WhatsApp", Icon: MessageCircle, href: "#", hoverColor: "hover:bg-green-500", iconColor: "group-hover:text-white" },
  ];

  return (
    <footer className="bg-gray-800 text-gray-300">
      {/* Seção principal do footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Informações da empresa - com título e ícones melhorados */}
          <div className="lg:col-span-1">
            {/* Título com ícone para a descrição */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-white">Nossa Missão</h3>
            </div>
            
            <p className="text-gray-300 mb-8 leading-relaxed text-base">
              Transformamos empresas através de soluções tecnológicas
              inteligentes, personalizadas e focadas em resultados mensuráveis.
            </p>

            {/* Certificação Microsoft - mais destaque */}
            <div className="mb-8">
              <div className="inline-block bg-blue-600 px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg">
                <span className="text-white font-bold text-base">
                  🏆 Microsoft Gold Partner
                </span>
              </div>
            </div>

            {/* Informações de contato - ícones mais vibrantes */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 hover:text-white transition-colors group">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <a
                  href="mailto:contato@alltechdigital.com"
                  className="hover:text-white transition-colors font-medium text-gray-300"
                >
                  contato@alltechdigital.com
                </a>
              </div>
              <div className="flex items-center gap-4 hover:text-white transition-colors group">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <a
                  href="tel:+5511999999999"
                  className="hover:text-white transition-colors font-medium text-gray-300"
                >
                  (11) 9 9999-9999
                </a>
              </div>
              <div className="flex items-center gap-4 hover:text-white transition-colors group">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-300">São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Serviços</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white hover-text-gradient transition-all duration-300 text-sm relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white hover-text-gradient transition-all duration-300 text-sm relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Recursos</h4>
            <ul className="space-y-3 mb-6">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white hover-text-gradient transition-all duration-300 text-sm relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div>
              <h5 className="text-white font-semibold mb-3">Newsletter</h5>
              <p className="text-gray-400 text-sm mb-4">
                Receba insights sobre tecnologia
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Seu email"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                />
                <button className="bg-blue-600 px-4 py-2 rounded text-white text-sm font-semibold hover:bg-blue-700 hover:scale-105 transition-all duration-300">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de redes sociais e CTA */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* CTA */}
            <div>
              <h4 className="text-xl font-bold text-white mb-2">
                Pronto para transformar sua empresa?
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Solicite um diagnóstico gratuito e descubra o potencial da sua
                infraestrutura
              </p>
              <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300">
                Solicitar Diagnóstico Gratuito
              </button>
            </div>

            {/* Redes sociais */}
            <div className="text-center md:text-right">
              <h5 className="text-white font-semibold mb-6">
                Nos siga nas redes sociais
              </h5>
              <div className="flex justify-center md:justify-end gap-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.Icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-12 h-12 bg-gray-700/50 backdrop-blur-sm ${social.hoverColor} rounded-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 hover:rotate-3 group shadow-lg hover:shadow-xl`}
                      title={social.name}
                    >
                      <IconComponent className={`w-6 h-6 text-gray-300 ${social.iconColor} transition-all duration-300 group-hover:scale-110`} />
                    </a>
                  );
                })}
              </div>
              
              {/* Texto adicional mais sutil */}
              <p className="text-gray-500 text-xs mt-4 font-medium">
                Acompanhe nossas novidades e dicas de tecnologia
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé inferior */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div>
              © {currentYear} AllTech Digital. Todos os direitos reservados.
            </div>

            <div className="flex gap-6">
              <a 
                href="#" 
                className="hover:text-white hover-text-gradient transition-all duration-300 relative group"
              >
                Política de Privacidade
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#" 
                className="hover:text-white hover-text-gradient transition-all duration-300 relative group"
              >
                Termos de Uso
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#" 
                className="hover:text-white hover-text-gradient transition-all duration-300 relative group"
              >
                Cookies
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            <div className="text-xs">
              Desenvolvido com ❤️ pela equipe AllTech Digital
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}