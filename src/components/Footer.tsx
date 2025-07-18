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
    { name: "LinkedIn", Icon: Linkedin, href: "#", color: "hover:text-blue-400" },
    { name: "YouTube", Icon: Youtube, href: "#", color: "hover:text-red-400" },
    { name: "Instagram", Icon: Instagram, href: "https://www.instagram.com/alltech.digital/", color: "hover:text-pink-400" },
    { name: "WhatsApp", Icon: MessageCircle, href: "#", color: "hover:text-green-400" },
  ];

  return (
    <footer className="bg-gray-800 text-gray-300">
      {/* Seção principal do footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Informações da empresa */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-gradient mb-6">
              AllTech Digital
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Transformamos empresas através de soluções tecnológicas
              inteligentes, personalizadas e focadas em resultados mensuráveis.
            </p>

            {/* Certificações */}
            <div className="mb-6">
              <div className="inline-block bg-tech-gradient px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-300">
                <span className="text-white font-semibold text-sm">
                  🏆 Microsoft Gold Partner
                </span>
              </div>
            </div>

            {/* Informações de contato */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 hover:text-white transition-colors group">
                <Mail className="w-4 h-4 text-tech-cyan group-hover:scale-110 transition-transform duration-300" />
                <a
                  href="mailto:contato@alltechdigital.com"
                  className="hover:text-white transition-colors"
                >
                  contato@alltechdigital.com
                </a>
              </div>
              <div className="flex items-center gap-3 hover:text-white transition-colors group">
                <Phone className="w-4 h-4 text-tech-cyan group-hover:scale-110 transition-transform duration-300" />
                <a
                  href="tel:+5511999999999"
                  className="hover:text-white transition-colors"
                >
                  (11) 9 9999-9999
                </a>
              </div>
              <div className="flex items-center gap-3 hover:text-white transition-colors group">
                <MapPin className="w-4 h-4 text-tech-cyan group-hover:scale-110 transition-transform duration-300" />
                <span>São Paulo, SP - Brasil</span>
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
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tech-gradient transition-all duration-300 group-hover:w-full"></span>
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
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tech-gradient transition-all duration-300 group-hover:w-full"></span>
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
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tech-gradient transition-all duration-300 group-hover:w-full"></span>
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
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan transition-all duration-300"
                />
                <button className="bg-tech-gradient px-4 py-2 rounded text-white text-sm font-semibold hover:opacity-90 hover:scale-105 transition-all duration-300">
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
              <button className="btn-primary animate-gradient hover:scale-105 transition-all duration-300">
                Solicitar Diagnóstico Gratuito
              </button>
            </div>

            {/* Redes sociais */}
            <div className="text-center md:text-right">
              <h5 className="text-white font-semibold mb-4">
                Nos siga nas redes sociais
              </h5>
              <div className="flex justify-center md:justify-end gap-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.Icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="w-10 h-10 bg-gray-700 hover:bg-tech-gradient rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                      title={social.name}
                    >
                      <IconComponent className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                    </a>
                  );
                })}
              </div>
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
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tech-gradient transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#" 
                className="hover:text-white hover-text-gradient transition-all duration-300 relative group"
              >
                Termos de Uso
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tech-gradient transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#" 
                className="hover:text-white hover-text-gradient transition-all duration-300 relative group"
              >
                Cookies
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tech-gradient transition-all duration-300 group-hover:w-full"></span>
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