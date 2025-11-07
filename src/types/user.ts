export type AccountType = 'agent' | 'enterprise';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  accountType: AccountType;
  name: string; // Agent name or Enterprise name
  createdAt: string;
  enterpriseId?: string; // For agents invited by enterprise
}

export interface UserSession {
  id: string;
  email: string;
  accountType: AccountType;
  name: string;
  enterpriseId?: string;
}

export interface Catalog {
  id: string;
  userId: string;
  name: string;
  data: CatalogItem[];
  uploadedAt: string;
}

export interface CatalogItem {
  description: string;
  unit: string;
  unitPrice: number;
}

export interface SavedQuote {
  id: string;
  userId: string;
  quoteNumber: string;
  clientName: string;
  date: string;
  total: number;
  quoteData: any; // Full Quote object from quote.ts
  createdAt: string;
}

export interface AgentInvitation {
  id: string;
  enterpriseId: string;
  email: string;
  token: string;
  used: boolean;
  createdAt: string;
}

export interface Template {
  id: string;
  userId: string;
  name: string;
  content: any; // Template content (could be JSON)
  createdAt: string;
  updatedAt: string;
}
