"use client";

import { Linkedin, Youtube, Instagram, MessageCircle, Mail, Phone, MapPin, Clock } from "lucide-react";

// Função utilitária para preencher textarea de mensagem
function preencherMensagem(mensagem: string) {
  setTimeout(() => {
    const msgField = document.querySelector('textarea[name="mensagem"], textarea#mensagem') as HTMLTextAreaElement | null;
    if (msgField) msgField.value = mensagem;
  }, 300);
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: "Migração para Microsoft 365", href: "#servicos" },
      { name: "Treinamentos Microsoft", href: "#servicos" },
      { name: "Consultoria em Cloud", href: "#servicos" },
      { name: "Automação de Processos", href: "#servicos" },
    ],
    company: [
      { name: "Por que Escolher a AllTech", href: "#sobre" },
      { name: "Nossa Metodologia", href: "#metodologia" },
      { name: "Cases de Sucesso", href: "#depoimentos" },
      { name: "Certificações da Equipe", href: "#certificacoes" },
    ],
    resources: [
      { name: "Diagnóstico Gratuito", href: "#contato" },
      { name: "Suporte Técnico", href: "#contato" },
      { name: "Documentação", href: "#" },
      { name: "Contato", href: "#contato" },
    ],
  };

  const socialLinks = [
    { 
      name: "LinkedIn", 
      Icon: Linkedin, 
      href: "https://www.linkedin.com/company/alltechdigital/", 
      hoverColor: "hover:bg-blue-600", 
    },
    { 
      name: "Instagram", 
      Icon: Instagram, 
      href: "https://www.instagram.com/alltech.digital/", 
      hoverColor: "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500", 
    },
    { 
      name: "WhatsApp", 
      Icon: MessageCircle, 
      href: "https://wa.me/5512992367544", 
      hoverColor: "hover:bg-green-500", 
    },
  ];

  return (
    <footer className="bg-gray-800 text-gray-300">
      {/* Seção principal do footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          
          {/* Coluna 1: Informações da empresa */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-white">AllTech Digital</h3>
            </div>
            
            <p className="text-gray-300 mb-8 leading-relaxed text-base">
              Especialistas em migração para Microsoft 365. Transformamos empresas 
              através de soluções seguras e metodologia PDCA comprovada.
            </p>

            {/* Informações de contato - Layout limpo */}
            <div className="space-y-4">
              {/* Email */}
              <div className="group">
                <div className="flex items-start gap-4 hover:text-white transition-colors">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300 flex-shrink-0 mt-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    <a
                      href="mailto:ulysses.lima@alltechbr.solutions"
                      className="text-gray-300 hover:text-white transition-colors font-medium text-sm break-all"
                    >
                      ulysses.lima@alltechbr.solutions
                    </a>
                  </div>
                </div>
              </div>

              {/* Telefone */}
              <div className="group">
                <div className="flex items-start gap-4 hover:text-white transition-colors">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300 flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">WhatsApp</p>
                    <a
                      href="https://wa.me/5512992367544"
                      className="text-gray-300 hover:text-white transition-colors font-medium text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      (12) 99236-7544
                    </a>
                  </div>
                </div>
              </div>

              {/* Localização */}
              <div className="group">
                <div className="flex items-start gap-4 hover:text-white transition-colors">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">Atendimento</p>
                    <span className="text-gray-300 font-medium text-sm">Atendimento Mundial</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Nossos Serviços */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Nossos Serviços</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-300 text-sm relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Serviço em destaque */}
            <div className="mt-8 bg-blue-600/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-400 text-lg">🌟</span>
                <h5 className="text-white font-semibold text-sm">Destaque</h5>
              </div>
              <p className="text-blue-200 text-xs mb-2">
                <strong>Migração Microsoft 365</strong>
              </p>
              <p className="text-blue-300 text-xs">
                Diagnóstico gratuito incluído
              </p>
            </div>
          </div>

          {/* Coluna 3: Empresa */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-all duration-300 text-sm relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 4: Recursos + Horários */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Recursos</h4>
            <ul className="space-y-3 mb-8">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  {link.name === 'Diagnóstico Gratuito' ? (
                    <a
                      href="#contato"
                      onClick={e => {
                        e.preventDefault();
                        if (typeof window !== 'undefined') {
                          window.location.hash = '#contato';
                          setTimeout(() => {
                            const msgField = document.querySelector('textarea[name="mensagem"], textarea#mensagem') as HTMLTextAreaElement | null;
                            if (msgField) msgField.value = 'Olá! Gostaria de solicitar um diagnóstico gratuito da minha infraestrutura.';
                          }, 300);
                        }
                      }}
                      className="text-gray-400 hover:text-white transition-all duration-300 text-sm relative group"
                    >
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  ) : (
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-all duration-300 text-sm relative group"
                    >
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {/* Horário de atendimento - melhor posicionado */}
            <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-blue-400" />
                <h5 className="text-white font-semibold text-sm">Horário de Atendimento</h5>
              </div>
              <div className="space-y-1">
                <p className="text-gray-300 text-xs">Segunda a Sexta: 9h às 18h</p>
                <p className="text-gray-400 text-xs">Suporte crítico 24/7 conforme necessidade</p>
              </div>
            </div>

            {/* Metodologia PDCA - reorganizada */}
            <div className="mt-6 bg-gray-700/30 border border-gray-600/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-400 text-sm">🔄</span>
                <h5 className="text-white font-semibold text-sm">Metodologia PDCA</h5>
              </div>
              <p className="text-gray-400 text-xs mb-1">
                Plan • Do • Check • Act
              </p>
              <p className="text-gray-400 text-xs">
                Resultados consistentes e melhoria contínua
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé inferior */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400">
                © {currentYear} AllTech Digital. Todos os direitos reservados.
              </p>
            </div>

            {/* Redes sociais - Design limpo e moderno */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 mr-2">Siga-nos:</span>
              {socialLinks.map((social, index) => {
                const IconComponent = social.Icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    title={`Siga-nos no ${social.name}`}
                    className="group relative flex items-center justify-center w-10 h-10 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-400 hover:text-white hover:border-blue-500 hover:bg-blue-600/20 transition-all duration-300"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    
                    {/* Tooltip sutil */}
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                      {social.name}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Links legais */}
            <div className="flex flex-col sm:flex-row gap-4 text-center">
              <a 
                href="/politica-de-privacidade" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-all duration-300 text-sm font-medium"
              >
                Política de Privacidade
              </a>
              <span className="hidden sm:block text-gray-600">•</span>
              <a 
                href="/termos-de-uso" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-all duration-300 text-sm font-medium"
              >
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}