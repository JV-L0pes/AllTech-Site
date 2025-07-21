// src/lib/navigation-service.ts - NOVO ARQUIVO
/**
 * Serviço de Navegação e Preenchimento Automático
 * Resolve conflitos de hash navigation e manipulação do DOM
 * 
 * Aplica padrões:
 * - Singleton Pattern para estado global
 * - Observer Pattern para aguardar elementos DOM
 * - Retry Pattern para robustez
 */

interface NavigationOptions {
    maxRetries?: number;
    retryDelay?: number;
    scrollBehavior?: ScrollBehavior;
    debugMode?: boolean;
  }
  
  interface FormFieldConfig {
    selector: string;
    value: string;
    fieldType: 'input' | 'textarea' | 'select';
  }
  
  /**
   * Classe principal do serviço de navegação
   * Implementa Single Responsibility Principle
   */
  export class NavigationService {
    private static instance: NavigationService;
    private readonly defaultOptions: Required<NavigationOptions> = {
      maxRetries: 10,
      retryDelay: 200,
      scrollBehavior: 'smooth',
      debugMode: process.env.NODE_ENV === 'development'
    };
  
    private constructor() {
      this.log('NavigationService inicializado');
    }
  
    /**
     * Singleton Pattern
     */
    public static getInstance(): NavigationService {
      if (!NavigationService.instance) {
        NavigationService.instance = new NavigationService();
      }
      return NavigationService.instance;
    }
  
    /**
     * Navegação segura para seção com preenchimento automático
     */
    public async navigateToContactForm(
      message: string,
      options: NavigationOptions = {}
    ): Promise<boolean> {
      const config = { ...this.defaultOptions, ...options };
      
      try {
        this.log(`Iniciando navegação para formulário com mensagem: "${message.substring(0, 50)}..."`);
  
        // 1. Verificar se já estamos próximos do formulário
        const isAlreadyNearForm = this.isElementInViewport('#contato');
        
        if (!isAlreadyNearForm) {
          // 2. Navegar para a seção
          await this.navigateToSection('#contato', config);
        }
  
        // 3. Aguardar elemento estar disponível e preencher
        const success = await this.fillFormField({
          selector: 'textarea[name="mensagem"], textarea#mensagem, #mensagem',
          value: message,
          fieldType: 'textarea'
        }, config);
  
        if (success) {
          this.log('✅ Navegação e preenchimento concluídos com sucesso');
          
          // 4. Foco suave no campo (UX melhorada)
          await this.focusElement('textarea[name="mensagem"], textarea#mensagem, #mensagem');
          
          return true;
        } else {
          this.log('❌ Falha no preenchimento do formulário');
          return false;
        }
  
      } catch (error) {
        this.log('❌ Erro na navegação:', error);
        return false;
      }
    }
  
    /**
     * Navegação para seção com retry pattern
     */
    private async navigateToSection(
      sectionId: string, 
      config: Required<NavigationOptions>
    ): Promise<void> {
      return new Promise((resolve, reject) => {
        try {
          // Navegação imediata
          window.location.hash = sectionId;
          
          // Aguardar scroll estar completo
          setTimeout(() => {
            // Verificar se chegou na seção
            const targetElement = document.querySelector(sectionId);
            if (targetElement && this.isElementInViewport(sectionId)) {
              this.log(`✅ Navegação para ${sectionId} concluída`);
              resolve();
            } else {
              // Fallback: scroll manual
              targetElement?.scrollIntoView({ 
                behavior: config.scrollBehavior,
                block: 'start'
              });
              setTimeout(resolve, 500);
            }
          }, 400);
  
        } catch (error) {
          reject(error);
        }
      });
    }
  
    /**
     * Preenchimento de campo com Observer Pattern
     */
    private async fillFormField(
      fieldConfig: FormFieldConfig,
      config: Required<NavigationOptions>
    ): Promise<boolean> {
      let attempts = 0;
  
      const attemptFill = async (): Promise<boolean> => {
        attempts++;
        this.log(`Tentativa ${attempts}/${config.maxRetries} de preenchimento`);
  
        const element = document.querySelector(fieldConfig.selector) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        
        if (element && this.isElementAccessible(element)) {
          // Elemento encontrado e acessível
          try {
            // Limpar valor anterior
            element.value = '';
            
            // Preencher novo valor
            element.value = fieldConfig.value;
            
            // Disparar eventos para frameworks (React)
            this.triggerChangeEvents(element);
            
            this.log(`✅ Campo preenchido: ${fieldConfig.selector}`);
            return true;
            
          } catch (error) {
            this.log(`❌ Erro ao preencher campo:`, error);
            return false;
          }
        }
  
        // Elemento não encontrado, tentar novamente
        if (attempts < config.maxRetries) {
          this.log(`⏳ Elemento não encontrado, aguardando... (${attempts}/${config.maxRetries})`);
          
          await this.delay(config.retryDelay);
          return attemptFill();
        } else {
          this.log(`❌ Elemento não encontrado após ${config.maxRetries} tentativas`);
          return false;
        }
      };
  
      return attemptFill();
    }
  
    /**
     * Verificar se elemento está no viewport
     */
    private isElementInViewport(selector: string): boolean {
      const element = document.querySelector(selector);
      if (!element) return false;
  
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      // Considera "no viewport" se pelo menos 30% do elemento está visível
      return rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;
    }
  
    /**
     * Verificar se elemento está acessível para interação
     */
    private isElementAccessible(element: Element): boolean {
      if (!element) return false;
      
      const htmlElement = element as HTMLElement;
      
      // Verificações de acessibilidade
      const isVisible = htmlElement.offsetParent !== null;
      const isNotDisabled = !htmlElement.hasAttribute('disabled');
      const isNotReadonly = !htmlElement.hasAttribute('readonly');
      const hasValidDisplay = window.getComputedStyle(htmlElement).display !== 'none';
      const hasValidVisibility = window.getComputedStyle(htmlElement).visibility !== 'hidden';
      
      return isVisible && isNotDisabled && isNotReadonly && hasValidDisplay && hasValidVisibility;
    }
  
    /**
     * Disparar eventos necessários para frameworks
     */
    private triggerChangeEvents(element: Element): void {
      const events = ['input', 'change', 'blur'];
      
      events.forEach(eventType => {
        const event = new Event(eventType, { bubbles: true, cancelable: true });
        element.dispatchEvent(event);
      });
    }
  
    /**
     * Foco suave no elemento
     */
    private async focusElement(selector: string): Promise<void> {
      await this.delay(100); // Pequeno delay para suavidade
      
      const element = document.querySelector(selector) as HTMLElement;
      if (element && this.isElementAccessible(element)) {
        element.focus();
        this.log(`🎯 Foco aplicado em: ${selector}`);
      }
    }
  
    /**
     * Utility: Delay com Promise
     */
    private delay(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    /**
     * Log condicional para debug
     */
    private log(message: string, ...args: any[]): void {
      if (this.defaultOptions.debugMode) {
        console.log(`🧭 [NavigationService] ${message}`, ...args);
      }
    }
  
    /**
     * Métodos públicos de conveniência
     */
    public async requestDiagnostic(): Promise<boolean> {
      return this.navigateToContactForm(
        'Olá! Gostaria de solicitar um diagnóstico gratuito da minha infraestrutura.'
      );
    }
  
    public async requestMigration(): Promise<boolean> {
      return this.navigateToContactForm(
        'Olá! Gostaria de migrar minha empresa para o Microsoft 365.'
      );
    }
  
    public async requestConsultation(): Promise<boolean> {
      return this.navigateToContactForm(
        'Olá! Gostaria de agendar uma consultoria sobre soluções Microsoft.'
      );
    }
  
    public async requestQuote(): Promise<boolean> {
      return this.navigateToContactForm(
        'Olá! Gostaria de receber um orçamento personalizado.'
      );
    }
  
    /**
     * Método para casos customizados
     */
    public async navigateWithCustomMessage(message: string): Promise<boolean> {
      return this.navigateToContactForm(message);
    }
  
    /**
     * Limpar estado (útil para testes)
     */
    public reset(): void {
      this.log('🔄 Reset do NavigationService');
    }
  
    /**
     * Diagnóstico do sistema
     */
    public diagnose(): {
      contactFormExists: boolean;
      contactFormVisible: boolean;
      contactFormAccessible: boolean;
      currentHash: string;
      viewport: { width: number; height: number };
    } {
      const contactForm = document.querySelector('#contato');
      const textarea = document.querySelector('textarea[name="mensagem"], textarea#mensagem') as HTMLElement;
  
      return {
        contactFormExists: !!contactForm,
        contactFormVisible: contactForm ? this.isElementInViewport('#contato') : false,
        contactFormAccessible: textarea ? this.isElementAccessible(textarea) : false,
        currentHash: window.location.hash,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    }
  }
  
  // Export da instância singleton para uso direto
  export const navigationService = NavigationService.getInstance();
  
  // Hooks para React (opcional)
  export function useNavigation() {
    const nav = NavigationService.getInstance();
    
    return {
      requestDiagnostic: nav.requestDiagnostic.bind(nav),
      requestMigration: nav.requestMigration.bind(nav),
      requestConsultation: nav.requestConsultation.bind(nav),
      requestQuote: nav.requestQuote.bind(nav),
      navigateWithMessage: nav.navigateWithCustomMessage.bind(nav),
      diagnose: nav.diagnose.bind(nav)
    };
  }
  
  /**
   * Função de conveniência para casos legacy
   * Substitui a antiga função preencherMensagem
   */
  export function preencherMensagem(mensagem: string): Promise<boolean> {
    return navigationService.navigateWithCustomMessage(mensagem);
  }