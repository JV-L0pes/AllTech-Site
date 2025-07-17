"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Instagram, Linkedin } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="bg-gray-100/95 backdrop-blur-sm shadow-lg fixed w-full top-0 z-50 border-b border-gray-300 transition-transform duration-300 translate-y-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              {/* Logo da empresa */}
              <Image
                src="/images/Alltech-logo.png"
                alt="AllTech Digital"
                width={52}
                height={52}
                className="drop-shadow-sm hover:scale-105 transition-transform duration-200"
                priority
              />
              {/* Texto da marca - seguindo o design original */}
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                  All
                </span>
                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                  Tech
                </span>
                <span className="text-lg font-light text-gray-600 ml-2">
                  Digital
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#inicio"
              className="text-gray-700 hover:text-transparent hover:bg-tech-text hover:bg-clip-text transition-all duration-300 font-medium"
            >
              Início
            </a>
            <a
              href="#servicos"
              className="text-gray-700 hover:text-transparent hover:bg-tech-text hover:bg-clip-text transition-all duration-300 font-medium"
            >
              Serviços
            </a>
            <a
              href="#depoimentos"
              className="text-gray-700 hover:text-transparent hover:bg-tech-text hover:bg-clip-text transition-all duration-300 font-medium"
            >
              Depoimentos
            </a>
            <a
              href="#contato"
              className="text-gray-700 hover:text-transparent hover:bg-tech-text hover:bg-clip-text transition-all duration-300 font-medium"
            >
              Contato
            </a>
          </nav>

          {/* Contatos - Ícones sociais + CTA Button (agrupados) */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <a
              href="#"
              title="Instagram"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-tech-gradient transition-all duration-300 group"
            >
              <Instagram className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
            </a>
            <a
              href="#"
              title="LinkedIn"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-tech-gradient transition-all duration-300 group"
            >
              <Linkedin className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
            </a>
            <button className="btn-primary animate-gradient ml-2">
              Diagnóstico Gratuito
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-2xl text-gray-700 hover:text-blue-500 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-300 mt-4 pt-4 bg-gray-100">
            <nav className="flex flex-col space-y-4">
              <a
                href="#inicio"
                className="text-gray-700 hover:text-blue-500 transition-colors font-medium"
              >
                Início
              </a>
              <a
                href="#servicos"
                className="text-gray-700 hover:text-blue-500 transition-colors font-medium"
              >
                Serviços
              </a>
              <a
                href="#depoimentos"
                className="text-gray-700 hover:text-blue-500 transition-colors font-medium"
              >
                Depoimentos
              </a>
              <a
                href="#contato"
                className="text-gray-700 hover:text-blue-500 transition-colors font-medium"
              >
                Contato
              </a>
              <div className="flex gap-3 mt-2 mb-2">
                <a
                  href="#"
                  title="Instagram"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-tech-gradient transition-all duration-300 group"
                >
                  <Instagram className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="#"
                  title="LinkedIn"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-tech-gradient transition-all duration-300 group"
                >
                  <Linkedin className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                </a>
              </div>
              <button className="btn-primary w-full animate-gradient">
                Diagnóstico Gratuito
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
