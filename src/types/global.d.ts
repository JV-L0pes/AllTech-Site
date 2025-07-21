// Declarações para dependências sem tipos
declare module 'http-cache-semantics' {
    export = any;
  }
  
  declare module 'semver-utils' {
    export = any;
  }
  
  declare module 'retire' {
    export = any;
  }
  
  declare module 'license-checker' {
    export = any;
  }
  
  declare module 'audit-ci' {
    export = any;
  }
  
  // Extensões para Next.js
  declare namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      DATABASE_URL: string;
      SENDGRID_API_KEY: string;
      SENDGRID_FROM_EMAIL: string;
      CSRF_SECRET: string;
      NEXT_PUBLIC_DOMAIN?: string;
      SECURITY_ALERT_EMAIL?: string;
      SIEM_WEBHOOK_URL?: string;
      RATE_LIMIT_REQUESTS_PER_MINUTE?: string;
      RATE_LIMIT_WINDOW_MS?: string;
    }
  }
  
  // Extensões para Window (se necessário)
  declare global {
    interface Window {
      gtag?: (...args: any[]) => void;
    }
  }
  
  export {};