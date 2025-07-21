"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { navigationService } from "@/lib/navigation-service";

// Domain Models - Melhor tipagem
interface Slide {
  readonly id: number;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly backgroundClass: string;
  readonly ctaPrimary?: string;
  readonly ctaSecondary?: string;
}

interface AnimationState {
  currentSlide: number;
  isTransitioning: boolean;
  transitionProgress: number;
  direction: 'forward' | 'backward';
  isVisible: boolean;
  isPaused: boolean;
}

// Animation Configuration - Valores otimizados para 60fps
const ANIMATION_CONFIG = {
  SLIDE_DURATION: 8000, // 8 segundos por slide
  TRANSITION_DURATION: 1200, // 1.2s de transição (mais rápida)
  EASING_FUNCTION: (t: number) => 1 - Math.pow(1 - t, 4), // Easing mais suave
  PROGRESS_UPDATE_INTERVAL: 16, // 60fps (16.67ms)
  INTERSECTION_THRESHOLD: 0.2,
  PRELOAD_OFFSET: 1, // Precarregar próximo slide
} as const;

// Performance Optimizations Hook
function usePerformanceOptimizations() {
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const frameTimeRef = useRef<number[]>([]);

  useEffect(() => {
    // Detectar performance do dispositivo
    const detectPerformance = () => {
      const start = performance.now();
      requestAnimationFrame(() => {
        const frameTime = performance.now() - start;
        frameTimeRef.current.push(frameTime);
        
        // Manter apenas últimos 10 frames
        if (frameTimeRef.current.length > 10) {
          frameTimeRef.current.shift();
        }
        
        // Se frame time médio > 20ms, considerar baixa performance
        const avgFrameTime = frameTimeRef.current.reduce((a, b) => a + b, 0) / frameTimeRef.current.length;
        setIsLowPerformance(avgFrameTime > 20);
      });
    };

    const interval = setInterval(detectPerformance, 2000);
    return () => clearInterval(interval);
  }, []);

  return { isLowPerformance };
}

// Intersection Observer Hook Melhorado
function useVisibilityObserver(elementId: string) {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold: ANIMATION_CONFIG.INTERSECTION_THRESHOLD,
        rootMargin: '100px' // Preload quando próximo da viewport
      }
    );

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [elementId]);

  return isVisible;
}

// Animation State Management Hook
function useSlideAnimation(slides: readonly Slide[]) {
  const [state, setState] = useState<AnimationState>({
    currentSlide: 0,
    isTransitioning: false,
    transitionProgress: 0,
    direction: 'forward',
    isVisible: false,
    isPaused: false,
  });

  const animationFrameRef = useRef<number>();
  const progressTimerRef = useRef<number>();
  const slideTimerRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  // Função de transição otimizada com RAF
  const executeTransition = useCallback((targetSlide: number, direction: 'forward' | 'backward') => {
    if (state.isTransitioning || targetSlide === state.currentSlide) return;

    setState(prev => ({
      ...prev,
      isTransitioning: true,
      direction,
      transitionProgress: 0,
    }));

    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current;
      const rawProgress = Math.min(elapsed / ANIMATION_CONFIG.TRANSITION_DURATION, 1);
      const easedProgress = ANIMATION_CONFIG.EASING_FUNCTION(rawProgress);

      setState(prev => ({
        ...prev,
        transitionProgress: easedProgress,
      }));

      if (rawProgress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setState(prev => ({
          ...prev,
          currentSlide: targetSlide,
          isTransitioning: false,
          transitionProgress: 0,
        }));
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [state.currentSlide, state.isTransitioning]);

  // Navegação com melhor lógica
  const goToSlide = useCallback((index: number) => {
    if (index < 0 || index >= slides.length) return;

    const direction = index > state.currentSlide || 
      (state.currentSlide === slides.length - 1 && index === 0) ? 'forward' : 'backward';
    
    executeTransition(index, direction);
  }, [state.currentSlide, slides.length, executeTransition]);

  const nextSlide = useCallback(() => {
    const next = (state.currentSlide + 1) % slides.length;
    goToSlide(next);
  }, [state.currentSlide, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (state.currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
  }, [state.currentSlide, slides.length, goToSlide]);

  // Auto-play com controle de visibilidade e pause
  useEffect(() => {
    if (!state.isVisible || state.isPaused || state.isTransitioning) {
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
        slideTimerRef.current = undefined;
      }
      return;
    }

    slideTimerRef.current = window.setTimeout(nextSlide, ANIMATION_CONFIG.SLIDE_DURATION);
    
    return () => {
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, [state.isVisible, state.isPaused, state.isTransitioning, state.currentSlide, nextSlide]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
      }
    };
  }, []);

  const setVisibility = useCallback((visible: boolean) => {
    setState(prev => ({ ...prev, isVisible: visible }));
  }, []);

  const setPaused = useCallback((paused: boolean) => {
    setState(prev => ({ ...prev, isPaused: paused }));
  }, []);

  return {
    ...state,
    goToSlide,
    nextSlide,
    prevSlide,
    setVisibility,
    setPaused,
  };
}

// Slide Component Otimizado
interface SlideProps {
  slide: Slide;
  isActive: boolean;
  isNext: boolean;
  isPrev: boolean;
  progress: number;
  direction: 'forward' | 'backward';
  isTransitioning: boolean;
  isLowPerformance: boolean;
}

const SlideComponent = ({ slide, isActive, isNext, progress, direction, isTransitioning, isLowPerformance }: SlideProps) => {
  // Cálculos de posição e opacidade mais precisos
  const getTransformAndOpacity = () => {
    if (!isTransitioning) {
      return isActive 
        ? { transform: 'translateX(0) translateZ(0)', opacity: 1, zIndex: 10 }
        : { transform: 'translateX(100%) translateZ(0)', opacity: 0, zIndex: 1 };
    }

    if (isActive) {
      // Slide saindo
      const exitDirection = direction === 'forward' ? -1 : 1;
      const translateX = progress * exitDirection * 100;
      const opacity = Math.max(0, 1 - (progress * 1.5));
      
      return {
        transform: `translateX(${translateX}%) translateZ(0)`,
        opacity,
        zIndex: 15,
      };
    }

    if (isNext) {
      // Slide entrando
      const enterDirection = direction === 'forward' ? 1 : -1;
      const translateX = (1 - progress) * enterDirection * 100;
      const opacity = Math.min(1, progress * 1.2);
      
      return {
        transform: `translateX(${translateX}%) translateZ(0)`,
        opacity,
        zIndex: 10,
      };
    }

    return { transform: 'translateX(100%) translateZ(0)', opacity: 0, zIndex: 1 };
  };

  const { transform, opacity, zIndex } = getTransformAndOpacity();

  // Otimizações para baixa performance
  const shouldRenderEffects = !isLowPerformance;

  return (
    <div
      className="absolute inset-0 will-change-transform"
      style={{
        transform,
        opacity,
        zIndex,
        transition: isTransitioning ? 'none' : 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <div className={`hero-slide ${slide.backgroundClass} ${shouldRenderEffects ? 'tech-element' : ''}`}>
        {/* Overlay com gradiente moderno */}
        <div className="hero-overlay bg-gradient-to-b from-black/15 via-black/25 to-black/35" />

        {/* Efeitos de luz condicionais */}
        {shouldRenderEffects && (
          <>
            <div className="absolute top-0 left-0 w-96 h-96 bg-tech-radial opacity-15 blur-3xl animate-pulse-tech" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-tech-gradient-reverse opacity-15 blur-3xl animate-pulse-tech" 
                 style={{ animationDelay: '1s' }} />
            
            {/* Partículas flutuantes otimizadas */}
            <div className="hero-particles hidden md:block">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-tech-gradient rounded-full animate-float-slow opacity-60"
                  style={{
                    top: `${20 + (i * 12)}%`,
                    left: `${10 + (i * 15)}%`,
                    animationDelay: `${i * 0.8}s`,
                    animationDuration: `${8 + (i * 2)}s`,
                  }}
                />
              ))}
            </div>
          </>
        )}

        <div className="hero-content">
          <div 
            className={isActive ? 'animate-fadeInUp' : ''}
            style={{
              animationDelay: isActive ? '0.2s' : '0s',
              animationFillMode: 'both',
            }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
              {slide.title}
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl text-blue-100 font-semibold mb-6 drop-shadow-lg">
              {slide.subtitle}
            </h2>
            <p className="text-lg md:text-xl text-cyan-100 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              {slide.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {slide.ctaPrimary === "Diagnóstico Gratuito" ? (
                <button
                  className="btn-primary text-lg px-8 py-4 w-full sm:w-auto hover:scale-105 transition-all duration-300"
                  onClick={() => navigationService.requestDiagnostic()}
                >
                  {slide.ctaPrimary}
                </button>
              ) : (
                <button className="btn-primary text-lg px-8 py-4 w-full sm:w-auto hover:scale-105 transition-all duration-300">
                  {slide.ctaPrimary}
                </button>
              )}
              {slide.ctaSecondary === "Fale com um especialista" && slide.id === 1 ? (
                <a
                  href="https://wa.me/5512992367544?text=Ol%C3%A1!%20Gostaria%20de%20falar%20com%20um%20especialista%20sobre%20migra%C3%A7%C3%A3o%20para%20Microsoft%20365."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white hover:text-tech-deep font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto text-center"
                >
                  Fale com um especialista
                </a>
              ) : (
                <button className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white hover:text-tech-deep font-semibold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                  {slide.ctaSecondary || "Ver Cases de Sucesso"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ currentSlide, totalSlides, isTransitioning, progress }: {
  currentSlide: number;
  totalSlides: number;
  isTransitioning: boolean;
  progress: number;
}) => {
  const progressPercentage = isTransitioning
    ? ((currentSlide + progress) / totalSlides) * 100
    : ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className="absolute top-0 left-0 w-full h-1 bg-black/20 z-30 overflow-hidden">
      <div 
        className="h-full bg-tech-gradient transition-all duration-300 ease-out"
        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
      />
      {/* Indicador de transição */}
      {isTransitioning && (
        <div 
          className="absolute top-0 h-full w-8 bg-white/40 blur-sm"
          style={{ 
            left: `${Math.min(progressPercentage - 4, 96)}%`,
            transition: 'left 0.1s ease-out'
          }}
        />
      )}
    </div>
  );
};

export default function HeroSection() {
  const isVisible = useVisibilityObserver('inicio');
  const { isLowPerformance } = usePerformanceOptimizations();

  const slides: readonly Slide[] = useMemo(() => [
    {
      id: 1,
      title: "Precisa migrar para Microsoft 365?",
      subtitle: "Modernize sua infraestrutura com segurança total e zero downtime",
      description: "Migração completa do Google Workspace, Slack ou entre tenants Microsoft. Preservamos 100% dos seus dados com metodologia PDCA comprovada.",
      backgroundClass: "bg-gradient-to-br from-tech-cyan via-tech-electric to-tech-deep",
      ctaPrimary: "Diagnóstico Gratuito",
      ctaSecondary: "Fale com um especialista",
    },
    {
      id: 2,
      title: "Especialistas Microsoft Certificados",
      subtitle: "Equipe com certificações AI-900, AZ-900, DP-900 e mais",
      description: "Nossa equipe possui certificações oficiais Microsoft e experiência real em projetos de migração para empresas de 50-500 colaboradores.",
      backgroundClass: "bg-gradient-to-br from-tech-deep via-tech-indigo to-tech-violet",
      ctaPrimary: "Conhecer Equipe",
      ctaSecondary: "Ver Certificações",
    },
    {
      id: 3,
      title: "Resultados em 2-6 semanas",
      subtitle: "Metodologia PDCA • Entrega com empatia e responsabilidade",
      description: "Plan, Do, Check, Act - Nossa metodologia garante migração segura, preservação total dos dados e suporte completo durante todo o processo.",
      backgroundClass: "bg-gradient-to-br from-tech-indigo via-tech-violet to-tech-electric",
      ctaPrimary: "Ver Metodologia",
      ctaSecondary: "Cases de Sucesso",
    },
  ], []);

  const {
    currentSlide,
    isTransitioning,
    transitionProgress,
    direction,
    isPaused,
    goToSlide,
    nextSlide,
    prevSlide,
    setVisibility,
    setPaused,
  } = useSlideAnimation(slides);

  // Sincronizar visibilidade
  useEffect(() => {
    setVisibility(isVisible);
  }, [isVisible, setVisibility]);

  // Controles de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isVisible) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          break;
        case ' ':
          e.preventDefault();
          setPaused(!isPaused);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible, isPaused, nextSlide, prevSlide, setPaused]);

  return (
    <section 
      id="inicio" 
      className="relative min-h-screen overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Progress Bar Aprimorada */}
      <ProgressBar 
        currentSlide={currentSlide}
        totalSlides={slides.length}
        isTransitioning={isTransitioning}
        progress={transitionProgress}
      />
      
      {/* Container principal otimizado para 60fps */}
      <div className="relative w-full h-screen" style={{ transform: 'translateZ(0)', isolation: 'isolate' }}>
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const isNext = direction === 'forward' 
            ? index === (currentSlide + 1) % slides.length
            : index === (currentSlide - 1 + slides.length) % slides.length;
          const isPrev = direction === 'forward'
            ? index === (currentSlide - 1 + slides.length) % slides.length
            : index === (currentSlide + 1) % slides.length;
          
          // Renderizar apenas slides ativos, próximos ou anteriores
          if (!isActive && !isNext && !isPrev && isTransitioning) return null;
          if (!isActive && !isTransitioning) return null;
          
          return (
            <SlideComponent
              key={slide.id}
              slide={slide}
              isActive={isActive}
              isNext={isNext}
              isPrev={isPrev}
              progress={transitionProgress}
              direction={direction}
              isTransitioning={isTransitioning}
              isLowPerformance={isLowPerformance}
            />
          );
        })}
      </div>

      {/* Indicadores modernos com melhor UX */}
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
                ? "bg-white w-8 shadow-lg shadow-white/30"
                : "bg-white/50 hover:bg-white/70 w-3 hover:scale-110"
            } ${isTransitioning ? 'pointer-events-none opacity-75' : 'cursor-pointer'}`}
          />
        ))}
      </div>

      {/* Controles de navegação aprimorados */}
      <button
        onClick={prevSlide}
        disabled={isTransitioning}
        aria-label="Slide anterior"
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/20 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-black/40 transition-all duration-300 text-2xl flex items-center justify-center hover:scale-110 z-30 ${
          isTransitioning ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:shadow-lg'
        }`}
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        disabled={isTransitioning}
        aria-label="Próximo slide"
        className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/20 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-black/40 transition-all duration-300 text-2xl flex items-center justify-center hover:scale-110 z-30 ${
          isTransitioning ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:shadow-lg'
        }`}
      >
        ›
      </button>

      {/* Indicador de pausa */}
      {isPaused && (
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-30">
          ⏸ Pausado
        </div>
      )}

      {/* Performance indicator para debug (remover em produção) */}
      {process.env.NODE_ENV === 'development' && isLowPerformance && (
        <div className="absolute top-4 left-4 bg-yellow-500/80 text-black px-3 py-1 rounded-full text-sm z-30">
          🐌 Modo Performance
        </div>
      )}

      {/* Linha decorativa */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-tech-gradient opacity-60" />
    </section>
  );
}