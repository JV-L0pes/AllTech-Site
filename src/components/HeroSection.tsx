"use client";

import { useState, useEffect, useCallback } from "react";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      id: 1,
      title: "Quer investir em tecnologia de forma inteligente?",
      subtitle:
        "Transforme sua empresa com soluções Microsoft que realmente funcionam",
      description:
        "Implementação de software, treinamentos especializados e migração para cloud com resultados garantidos.",
      backgroundClass:
        "bg-gradient-to-br from-tech-cyan via-tech-electric to-tech-deep",
    },
    {
      id: 2,
      title: "Parceiros oficiais Microsoft",
      subtitle: "Certificação Gold Partner para sua tranquilidade",
      description:
        "Acesso às mais recentes tecnologias e suporte técnico especializado direto da Microsoft.",
      backgroundClass:
        "bg-gradient-to-br from-tech-deep via-tech-indigo to-tech-violet",
    },
    {
      id: 3,
      title: "Resultados mensuráveis e crescimento sustentável",
      subtitle: "Não vendemos ferramentas, oferecemos parceria",
      description:
        "Análise completa, implementação personalizada e acompanhamento contínuo para o sucesso do seu negócio.",
      backgroundClass:
        "bg-gradient-to-br from-tech-indigo via-tech-violet to-tech-electric",
    },
  ];

  // Transição otimizada
  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return;
    
    setIsTransitioning(true);
    
    // Use requestAnimationFrame para transição mais suave
    requestAnimationFrame(() => {
      setCurrentSlide(index);
      
      // Reset transition flag
      setTimeout(() => {
        setIsTransitioning(false);
      }, 700);
    });
  }, [currentSlide, isTransitioning]);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextSlide = (currentSlide + 1) % slides.length;
      goToSlide(nextSlide);
    }, 8000);
    return () => clearInterval(timer);
  }, [currentSlide, goToSlide, slides.length]);

  return (
    <section id="inicio" className="relative min-h-screen overflow-hidden">
      {/* Partículas flutuantes de fundo */}
      <div className="absolute inset-0 hero-particles"></div>
      
      {/* Container otimizado para GPU */}
      <div className="relative w-full h-screen" style={{ transform: 'translateZ(0)' }}>
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const isNext = index === (currentSlide + 1) % slides.length;
          const isPrev = index === (currentSlide - 1 + slides.length) % slides.length;
          
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 will-change-transform`}
              style={{
                // Otimização: usar apenas transform que é acelerado por GPU
                transform: `translateX(${
                  isActive ? '0%' : 
                  isNext ? '100%' : 
                  isPrev ? '-100%' : '100%'
                }) translateZ(0)`,
                opacity: isActive ? 1 : 0,
                // Transição mais rápida e suave
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease-out',
                zIndex: isActive ? 10 : 1,
              }}
            >
              <div className={`hero-slide ${slide.backgroundClass} tech-element`}>
                {/* Overlay com gradiente moderno */}
                <div className="hero-overlay bg-gradient-to-b from-black/20 via-black/30 to-black/40"></div>

                {/* Efeitos de luz nos cantos */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-tech-radial opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-tech-gradient-reverse opacity-20 blur-3xl"></div>

                <div className="hero-content">
                  <div 
                    className="animate-fade-in-up"
                    style={{
                      // Só anima quando é o slide ativo
                      animationDelay: isActive ? '0.2s' : '0s',
                      animationDuration: isActive ? '0.8s' : '0s',
                    }}
                  >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                      {slide.title}
                    </h1>
                    <h2 className="text-xl md:text-2xl lg:text-3xl text-blue-100 font-semibold mb-6 drop-shadow-md">
                      {slide.subtitle}
                    </h2>
                    <p className="text-lg md:text-xl text-cyan-100 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
                      {slide.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <button className="btn-primary text-lg px-8 py-4 w-full sm:w-auto tech-glow">
                        Solicitar Diagnóstico Gratuito
                      </button>
                      <button className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white hover:text-tech-deep font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                        Ver Cases de Sucesso
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicadores modernos */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-tech-gradient w-8 tech-glow"
                : "bg-white/50 hover:bg-white/70 w-3"
            } ${isTransitioning ? 'pointer-events-none' : ''}`}
          />
        ))}
      </div>

      {/* Setas com novo design */}
      <button
        onClick={() =>
          goToSlide((currentSlide - 1 + slides.length) % slides.length)
        }
        disabled={isTransitioning}
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-all duration-300 text-4xl font-light hover:scale-110 hover:drop-shadow-lg z-20 ${
          isTransitioning ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        ‹
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        disabled={isTransitioning}
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-all duration-300 text-4xl font-light hover:scale-110 hover:drop-shadow-lg z-20 ${
          isTransitioning ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        ›
      </button>

      {/* Elementos decorativos flutuantes */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-tech-cyan rounded-full animate-pulse opacity-60 floating-dots"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-tech-electric rounded-full animate-pulse opacity-40" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-tech-indigo rounded-full animate-pulse opacity-50" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-60 left-1/3 w-1 h-1 bg-tech-violet rounded-full animate-pulse opacity-70" style={{animationDelay: '3s'}}></div>
      <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-tech-deep rounded-full animate-pulse opacity-60" style={{animationDelay: '4s'}}></div>

      {/* Linha de código decorativa */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-tech-gradient opacity-50"></div>
    </section>
  );
}