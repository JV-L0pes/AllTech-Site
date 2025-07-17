'use client'

import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gray-100/95 backdrop-blur-sm shadow-lg fixed w-full top-0 z-50 border-b border-gray-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gradient">
              AllTech Digital
            </h1>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-transparent hover:bg-tech-text hover:bg-clip-text transition-all duration-300 font-medium">
              Início
            </a>
            <a href="#servicos" className="text-gray-700 hover:text-transparent hover:bg-tech-text hover:bg-clip-text transition-all duration-300 font-medium">
              Serviços
            </a>
            <a href="#depoimentos" className="text-gray-700 hover:text-transparent hover:bg-tech-text hover:bg-clip-text transition-all duration-300 font-medium">
              Depoimentos
            </a>
            <a href="#contato" className="text-gray-700 hover:text-transparent hover:bg-tech-text hover:bg-clip-text transition-all duration-300 font-medium">
              Contato
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="btn-primary animate-gradient">
              Diagnóstico Gratuito
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-2xl text-gray-700 hover:text-blue-500 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-300 mt-4 pt-4 bg-gray-100">
            <nav className="flex flex-col space-y-4">
              <a href="#inicio" className="text-gray-700 hover:text-blue-500 transition-colors font-medium">
                Início
              </a>
              <a href="#servicos" className="text-gray-700 hover:text-blue-500 transition-colors font-medium">
                Serviços
              </a>
              <a href="#depoimentos" className="text-gray-700 hover:text-blue-500 transition-colors font-medium">
                Depoimentos
              </a>
              <a href="#contato" className="text-gray-700 hover:text-blue-500 transition-colors font-medium">
                Contato
              </a>
              <button className="btn-primary w-full animate-gradient">
                Diagnóstico Gratuito
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}