"use client";

import { useState, useEffect } from "react";
import { navigationService } from "@/lib/navigation-service";
import Image from "next/image";
import { Instagram, Linkedin, MessageCircle } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`backdrop-blur-sm fixed w-full top-0 z-50 border-b transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 border-gray-200 shadow-xl' 
        : 'bg-white/95 border-gray-200 shadow-lg'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-1 min-h-[68px]">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              {/* Logo com CSS blend para remover fundo branco */}
              <Image
                src="/images/Alltech-logo.png"
                alt="AllTech Digital"
                width={68}
                height={68}
                className="logo-no-background drop-shadow-sm hover:scale-105 transition-transform duration-200"
                priority
              />

              {/* Texto da marca - alinhado lado a lado com tamanhos iguais */}
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-gray-900 tracking-tight hover-text-gradient transition-all duration-300">
                  AllTech
                </span>
                <span className="text-2xl font-bold text-tech-deep tracking-tight hover-text-gradient transition-all duration-300">
                  Digital
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#inicio"
              className="text-gray-700 hover-text-gradient transition-all duration-300 font-medium relative group"
            >
              Início
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tech-gradient transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#servicos"
              className="text-gray-700 hover-text-gradient transition-all duration-300 font-medium relative group"
            >
              Serviços
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tech-gradient transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#depoimentos"
              className="text-gray-700 hover-text-gradient transition-all duration-300 font-medium relative group"
            >
              Depoimentos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tech-gradient transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#contato"
              className="text-gray-700 hover-text-gradient transition-all duration-300 font-medium relative group"
            >
              Contato
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tech-gradient transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Contatos - Ícones sociais + CTA Button (agrupados) */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <a
              href="https://www.instagram.com/alltech.digital/"
              title="Instagram"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 group hover:scale-110"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Instagram className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
            </a>
            <a
              href="https://www.linkedin.com/company/alltechdigital/"
              title="LinkedIn"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-tech-gradient transition-all duration-300 group hover:scale-110"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Linkedin className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
            </a>
            <a
              href="https://wa.me/5512992367544"
              title="WhatsApp: (12) 99236-7544"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-green-500 transition-all duration-300 group hover:scale-110"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
            </a>
            <button className="btn-primary animate-gradient ml-2 hover:scale-105 transition-transform duration-300 tech-glow"
              onClick={() => navigationService.requestDiagnostic()}
            >
              Diagnóstico Gratuito
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-2xl text-gray-700 hover-text-gradient transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-4 pt-4 bg-white/95 rounded-b-lg backdrop-blur-sm">
            <nav className="flex flex-col space-y-4">
              <a
                href="#inicio"
                className="text-gray-700 hover-text-gradient transition-all duration-300 font-medium py-2 px-4 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </a>
              <a
                href="#servicos"
                className="text-gray-700 hover-text-gradient transition-all duration-300 font-medium py-2 px-4 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Serviços
              </a>
              <a
                href="#depoimentos"
                className="text-gray-700 hover-text-gradient transition-all duration-300 font-medium py-2 px-4 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Depoimentos
              </a>
              <a
                href="#contato"
                className="text-gray-700 hover-text-gradient transition-all duration-300 font-medium py-2 px-4 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </a>
              
              {/* Contatos mobile */}
              <div className="flex gap-3 mt-2 mb-2 px-4">
                <a
                  href="https://www.instagram.com/alltech.digital/"
                  title="Instagram"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 group"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://www.linkedin.com/company/alltechdigital/"
                  title="LinkedIn"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-tech-gradient transition-all duration-300 group"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://wa.me/5512992367544"
                  title="WhatsApp: (12) 99236-7544"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-green-500 transition-all duration-300 group"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                </a>
              </div>

              {/* Informações de contato mobile */}
              <div className="px-4 py-2 bg-gray-50 rounded-lg mx-4">
                <p className="text-xs text-gray-600 mb-1">
                  📱 WhatsApp: (12) 99236-7544
                </p>
                <p className="text-xs text-gray-600 mb-1">
                  📧 ulysses.lima@alltechbr.solutions
                </p>
                <p className="text-xs text-gray-600">
                  🕒 Seg-Sex: 9h às 18h
                </p>
              </div>

              <button className="btn-primary w-full animate-gradient tech-glow"
                onClick={() => navigationService.requestDiagnostic()}
              >
                Diagnóstico Gratuito
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}