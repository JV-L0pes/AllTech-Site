'use client'

import { useState, useEffect } from 'react'

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: "Quer investir em tecnologia de forma inteligente?",
      subtitle: "Transforme sua empresa com soluções Microsoft que realmente funcionam",
      description: "Implementação de software, treinamentos especializados e migração para cloud com resultados garantidos.",
      backgroundClass: "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800"
    },
    {
      id: 2,
      title: "Parceiros oficiais Microsoft",
      subtitle: "Certificação Gold Partner para sua tranquilidade",
      description: "Acesso às mais recentes tecnologias e suporte técnico especializado direto da Microsoft.",
      backgroundClass: "bg-gradient-to-r from-indigo-600 via-purple-700 to-blue-800"
    },
    {
      id: 3,
      title: "Resultados mensuráveis e crescimento sustentável",
      subtitle: "Não vendemos ferramentas, oferecemos parceria",
      description: "Análise completa, implementação personalizada e acompanhamento contínuo para o sucesso do seu negócio.",
      backgroundClass: "bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-800"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section id="inicio" className="relative min-h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`hero-slide ${slide.backgroundClass}`}>
            <div className="hero-overlay"></div>
            
            <div className="hero-content">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                {slide.title}
              </h1>
              <h2 className="text-xl md:text-2xl lg:text-3xl text-blue-200 font-semibold mb-6">
                {slide.subtitle}
              </h2>
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                {slide.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="btn-primary text-lg px-8 py-4 w-full sm:w-auto animate-gradient">
                  Solicitar Diagnóstico Gratuito
                </button>
                <button className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-blue-600 font-semibold py-4 px-8 rounded-lg transition-all duration-300">
                  Ver Cases de Sucesso
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Indicadores */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/70 w-3'
            }`}
          />
        ))}
      </div>

      {/* Setas */}
      <button
        onClick={() => goToSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors text-4xl font-light"
      >
        ‹
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors text-4xl font-light"
      >
        ›
      </button>
    </section>
  )
}