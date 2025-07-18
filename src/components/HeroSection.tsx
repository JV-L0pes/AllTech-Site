"use client";

import { useState, useEffect } from "react";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Quer investir em tecnologia de forma inteligente?",
      subtitle:
        "Transforme sua empresa com soluções Microsoft que realmente funcionam",
      description:
        "Implementação de software, treinamentos especializados e migração para cloud com resultados garantidos.",
      backgroundClass:
        "bg-gradient-to-r from-tech-cyan via-tech-green to-tech-darkGreen",
    },
    {
      id: 2,
      title: "Parceiros oficiais Microsoft",
      subtitle: "Certificação Gold Partner para sua tranquilidade",
      description:
        "Acesso às mais recentes tecnologias e suporte técnico especializado direto da Microsoft.",
      backgroundClass:
        "bg-gradient-to-r from-tech-darkGreen via-tech-green to-tech-cyan",
    },
    {
      id: 3,
      title: "Resultados mensuráveis e crescimento sustentável",
      subtitle: "Não vendemos ferramentas, oferecemos parceria",
      description:
        "Análise completa, implementação personalizada e acompanhamento contínuo para o sucesso do seu negócio.",
      backgroundClass:
        "bg-gradient-to-r from-tech-green via-tech-cyan to-tech-darkGreen",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section id="inicio" className="relative min-h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <div className={`hero-slide ${slide.backgroundClass}`}>
            <div className="hero-overlay bg-gradient-to-b from-black/30 via-black/50 to-black/40"></div>

            <div className="hero-content">
              <div className="animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>
                <h2 className="text-xl md:text-2xl lg:text-3xl text-green-100 font-semibold mb-6 drop-shadow-md">
                  {slide.subtitle}
                </h2>
                <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
                  {slide.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button className="btn-primary text-lg px-8 py-4 w-full sm:w-auto animate-gradient hover:scale-105 transition-all duration-300 animate-pulse-tech">
                    Solicitar Diagnóstico Gratuito
                  </button>
                  <button className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-tech-cyan font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                    Ver Cases de Sucesso
                  </button>
                </div>
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
                ? "bg-tech-gradient w-8 animate-pulse"
                : "bg-white/50 hover:bg-white/70 w-3"
            }`}
          />
        ))}
      </div>

      {/* Setas */}
      <button
        onClick={() =>
          goToSlide((currentSlide - 1 + slides.length) % slides.length)
        }
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-all duration-300 text-4xl font-light hover:scale-110"
      >
        ‹
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-all duration-300 text-4xl font-light hover:scale-110"
      >
        ›
      </button>

      {/* Floating elements for visual appeal */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-tech-green rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-tech-cyan rounded-full animate-pulse opacity-40 animation-delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-tech-darkGreen rounded-full animate-pulse opacity-50 animation-delay-2000"></div>
    </section>
  );
}