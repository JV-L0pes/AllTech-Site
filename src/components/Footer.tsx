"use client";

import { Linkedin, Youtube, Instagram, MessageCircle, Mail, Phone, MapPin } from "lucide-react";

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
      { name: "Sobre Nós", href: "#inicio" },
      { name: "Nossa Metodologia", href: "#servicos" },
      { name: "Cases de Sucesso", href: "#depoimentos" },
      { name: "Certificações", href: "#inicio" },
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
      iconColor: "group-hover:text-white" 
    },
    { 
      name: "Instagram", 
      Icon: Instagram, 
      href: "https://www.instagram.com/alltech.digital/", 
      hoverColor: "hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500", 
      iconColor: "group-hover:text-white" 
    },
    { 
      name: "WhatsApp", 
      Icon: MessageCircle, 
      href: "https://wa.me/5512992367544", 
      hoverColor: "hover:bg-green-500", 
      iconColor: "group-hover:text-white" 
    },
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
              <h3 className="text-xl font-bold text-white">AllTech Digital</h3>
            </div>
            
            <p className="text-gray-300 mb-8 leading-relaxed text-base">
              Especialistas em migração para Microsoft 365. Transformamos empresas 
              através de soluções seguras e metodologia PDCA comprovada.
            </p>

            {/* Informações de contato - ícones mais vibrantes */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 hover:text-white transition-colors group">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <a
                  href="mailto:ulysses.lima@alltechbr.solutions"
                  className="hover:text-white transition-colors font-medium text-gray-300"
                >
                  ulysses.lima@alltechbr.solutions
                </a>
              </div>
              <div className="flex items-center gap-4 hover:text-white transition-colors group">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <a
                  href="https://wa.me/5512992367544"
                  className="hover:text-white transition-colors font-medium text-gray-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  (12) 99236-7544
                </a>
              </div>
              <div className="flex items-center gap-4 hover:text-white transition-colors group">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-300">Atendimento Mundial</span>
              </div>
            </div>

            {/* Horário de atendimento */}
            <div className="mt-6 bg-gray-700/50 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                🕒 Horário de Atendimento
              </h4>
              <p className="text-gray-300 text-sm">Segunda a Sexta: 9h às 18h</p>
              <p className="text-gray-300 text-sm">Suporte crítico 24/7 conforme necessidade</p>
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Nossos Serviços</h4>
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

            {/* Destaque para serviço principal */}
            <div className="mt-6 bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
              <h5 className="text-white font-semibold mb-2">🌟 Destaque</h5>
              <p className="text-blue-200 text-sm">
                <strong>Migração Microsoft 365</strong><br />
                Diagnóstico gratuito incluído
              </p>
            </div>
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
                      className="text-gray-400 hover:text-white hover-text-gradient transition-all duration-300 text-sm relative group"
                    >
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  ) : (
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white hover-text-gradient transition-all duration-300 text-sm relative group"
                    >
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {/* Metodologia destaque */}
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h5 className="text-white font-semibold mb-2 flex items-center gap-2">
                🔄 Metodologia PDCA
              </h5>
              <p className="text-gray-300 text-xs">
                Plan • Do • Check • Act<br />
                Resultados consistentes e melhoria contínua
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

            {/* Informações adicionais */}
            <div className="flex gap-6">
              <a 
                href="/politica-de-privacidade" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white hover-text-gradient transition-all duration-300 relative group"
              >
                Política de Privacidade
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="/termos-de-uso" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white hover-text-gradient transition-all duration-300 relative group"
              >
                Termos de Uso
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            <div className="text-xs text-center md:text-right">
              <p>Desenvolvido com ❤️ pela equipe AllTech Digital</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}