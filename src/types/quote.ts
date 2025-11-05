export interface QuoteItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface Quote {
  artisan: {
    name: string;
    company: string;
    address: string;
    phone: string;
    email: string;
    siret?: string;
  };
  client: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };
  quoteNumber: string;
  date: string;
  validUntil: string;
  items: QuoteItem[];
  subtotal: number;
  tva: number;
  tvaRate: number;
  total: number;
  notes?: string;
}

export interface QuoteGenerationRequest {
  description: string;
  artisanInfo?: {
    name?: string;
    company?: string;
    address?: string;
    phone?: string;
    email?: string;
    siret?: string;
  };
  clientInfo?: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
}
