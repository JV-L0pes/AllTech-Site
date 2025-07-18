// Tipos para o banco de dados
export interface SalesRepresentative {
    id: string;
    name: string;
    email: string;
    phone?: string;
    region: string;
    states: string[];
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface Company {
    id: string;
    name: string;
    cnpj: string;
    number_of_employees: string;
    industry?: string;
    website?: string;
    state: string;
    city: string;
    address?: string;
    postal_code?: string;
    annual_revenue?: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface Contact {
    id: string;
    company_id: string;
    name: string;
    email: string;
    phone?: string;
    position?: string;
    department?: string;
    is_primary: boolean;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  }
  
  export type LeadStatus = 
    | 'new'
    | 'contacted'
    | 'qualified'
    | 'proposal_sent'
    | 'negotiating'
    | 'won'
    | 'lost'
    | 'unqualified';
  
  export type LeadSource = 
    | 'website_contact_form'
    | 'website_chat'
    | 'linkedin'
    | 'email_marketing'
    | 'referral'
    | 'cold_call'
    | 'event'
    | 'organic_search'
    | 'paid_ads'
    | 'other';
  
  export interface Lead {
    id: string;
    company_id: string;
    contact_id: string;
    sales_rep_id: string;
    service_of_interest?: string;
    message?: string;
    status: LeadStatus;
    source: LeadSource;
    priority: number;
    estimated_value?: number;
    expected_close_date?: Date;
    notes?: string;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface Interaction {
    id: string;
    lead_id: string;
    sales_rep_id: string;
    interaction_type: string;
    subject?: string;
    description?: string;
    interaction_date: Date;
    duration_minutes?: number;
    outcome?: string;
    next_action?: string;
    next_action_date?: Date;
    created_at: Date;
    updated_at: Date;
  }
  
  // DTOs para API
  export interface ContactFormRequest {
    name: string;
    email: string;
    phone: string;
    company: string;
    cnpj: string;
    numberOfEmployees: string;
    state: string;
    city: string;
    serviceOfInterest?: string;
    message: string;
  }
  
  export interface ContactFormResponse {
    success: boolean;
    message: string;
    salesRepresentative?: {
      name: string;
      email: string;
      region: string;
    };
    errors?: any[];
  }