'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showHeader, setShowHeader] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const threshold = 200
      if (currentScrollY <= threshold) {
        setShowHeader(true)
      } else if (currentScrollY > lastScrollY) {
        setShowHeader(false)
      } else {
        setShowHeader(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <header className={`bg-gray-100/95 backdrop-blur-sm shadow-lg fixed w-full top-0 z-50 border-b border-gray-300 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
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
                <span className="text-2xl font-bold text-gray-900 tracking-tight">All</span>
                <span className="text-2xl font-bold text-gray-900 tracking-tight">Tech</span>
                <span className="text-lg font-light text-gray-600 ml-2">Digital</span>
              </div>
            </div>
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