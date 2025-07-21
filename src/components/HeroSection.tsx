"use client";

import { useState, useEffect, useCallback } from "react";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');

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

  // Intersection Observer para lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    const element = document.getElementById('inicio');
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  }, []);

  // Transição de slide overlay com direção
  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return;
    
    // Determina a direção da transição
    const isForward = (index > currentSlide) || (currentSlide === slides.length - 1 && index === 0);
    const isBackward = (index < currentSlide) || (currentSlide === 0 && index === slides.length - 1);
    
    setSlideDirection(isForward ? 'forward' : 'backward');
    setIsTransitioning(true);
    setSlideProgress(0);
    
    // Animação de slide overlay mais suave
    const duration = 1600;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing ultra-suave para transição como seda
      const easeProgress = 1 - Math.pow(1 - progress, 6);
      setSlideProgress(easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentSlide(index);
        setSlideProgress(0);
        setIsTransitioning(false);
      }
    };
    
    requestAnimationFrame(animate);
  }, [currentSlide, isTransitioning, slides.length]);

  useEffect(() => {
    if (!isVisible) return; // Só inicia o timer quando visível
    
    const timer = setInterval(() => {
      const nextSlide = (currentSlide + 1) % slides.length;
      goToSlide(nextSlide);
    }, 8000);
    return () => clearInterval(timer);
  }, [currentSlide, goToSlide, slides.length, isVisible]);

  return (
    <section id="inicio" className="relative min-h-screen overflow-hidden">
      {/* Barra de progresso */}
      <div className="absolute top-0 left-0 w-full h-1 bg-black/20 z-30">
        <div 
          className="h-full bg-tech-gradient transition-all duration-500 ease-out"
          style={{ 
            width: `${((currentSlide + 1) / slides.length) * 100}%` 
          }}
        />
      </div>
      
      {/* Container principal com slides overlay ultra-smooth */}
      <div className="relative w-full h-screen" style={{ transform: 'translateZ(0)' }}>
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const isNext = slideDirection === 'forward' 
            ? index === (currentSlide + 1) % slides.length
            : index === (currentSlide - 1 + slides.length) % slides.length;
          const isPrev = slideDirection === 'forward'
            ? index === (currentSlide - 1 + slides.length) % slides.length
            : index === (currentSlide + 1) % slides.length;
          
          // Sistema de overlay ultra-refinado para eliminar ghost e branco
          let transform = 'translateX(100%)';
          let opacity = 0;
          let zIndex = 1;
          
          if (isActive) {
            // Slide atual: sai na direção oposta
            const exitDirection = slideDirection === 'forward' ? -1 : 1;
            transform = `translateX(${slideProgress * exitDirection * 80}%)`;
            // Desaparece de forma ultra-suave
            if (slideProgress < 0.25) {
              opacity = 1; // Totalmente visível até 25%
            } else if (slideProgress < 0.85) {
              // Desaparece gradualmente de 25% a 85%
              opacity = 1 - ((slideProgress - 0.25) * 1.67);
            } else {
              opacity = 0; // Invisível após 85%
            }
            zIndex = 15;
          } else if (isNext && isTransitioning) {
            // Próximo slide: entra na direção da transição
            const enterDirection = slideDirection === 'forward' ? 1 : -1;
            transform = `translateX(${(1 - slideProgress) * enterDirection * 80}%)`;
            // Aparece de forma ultra-suave
            if (slideProgress < 0.15) {
              opacity = 0; // Invisível até 15%
            } else if (slideProgress < 0.75) {
              // Aparece gradualmente de 15% a 75%
              opacity = (slideProgress - 0.15) * 1.67;
            } else {
              opacity = 1; // Totalmente visível após 75%
            }
            zIndex = 10;
          } else if (isPrev && isTransitioning) {
            // Slide anterior: já saiu completamente
            const exitDirection = slideDirection === 'forward' ? -1 : 1;
            transform = `translateX(${exitDirection * 100}%)`;
            opacity = 0;
            zIndex = 1;
          } else if (!isActive) {
            // Slides inativos: fora da tela
            transform = 'translateX(100%)';
            opacity = 0;
            zIndex = 1;
          }
          
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 will-change-transform`}
              style={{
                transform: `${transform} translateZ(0)`,
                opacity,
                zIndex,
                transition: isTransitioning ? 'none' : 'all 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                filter: isTransitioning ? 'blur(0px)' : 'blur(0px)',
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
                      animationDelay: isActive ? '0.2s' : '0s',
                      animationDuration: isActive ? '0.8s' : '0s',
                      opacity: isActive ? 1 : 0.8,
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
                      <button 
                        className="btn-primary text-lg px-8 py-4 w-full sm:w-auto tech-glow"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        aria-label="Solicitar diagnóstico gratuito"
                      >
                        Solicitar Diagnóstico Gratuito
                      </button>
                      <button 
                        className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white hover:text-tech-deep font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                        aria-label="Ver cases de sucesso"
                      >
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

      {/* Indicadores modernos com acessibilidade */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30" role="tablist">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            aria-label={`Ir para slide ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
            role="tab"
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-tech-gradient w-8 tech-glow"
                : "bg-white/50 hover:bg-white/70 w-3"
            } ${isTransitioning ? 'pointer-events-none' : ''}`}
          />
        ))}
      </div>

      {/* Setas com novo design e acessibilidade */}
      <button
        onClick={() =>
          goToSlide((currentSlide - 1 + slides.length) % slides.length)
        }
        disabled={isTransitioning}
        aria-label="Slide anterior"
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-all duration-300 text-4xl font-light hover:scale-110 hover:drop-shadow-lg z-30 ${
          isTransitioning ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        ‹
      </button>
      <button
        onClick={() => goToSlide((currentSlide + 1) % slides.length)}
        disabled={isTransitioning}
        aria-label="Próximo slide"
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-all duration-300 text-4xl font-light hover:scale-110 hover:drop-shadow-lg z-30 ${
          isTransitioning ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        ›
      </button>

      {/* Linha de código decorativa */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-tech-gradient opacity-50"></div>
    </section>
  );
}