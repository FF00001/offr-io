import { QuoteItem } from '@/types/quote';

// Mock data to avoid OpenAI calls during development

// English version
export const MOCK_QUOTE_ITEMS_EN: QuoteItem[] = [
  {
    description: "200L electric water heater - vertical installation",
    quantity: 1,
    unit: "unit",
    unitPrice: 450.00,
    total: 450.00
  },
  {
    description: "Safety kit (pressure relief valve + drain + reducer)",
    quantity: 1,
    unit: "unit",
    unitPrice: 55.00,
    total: 55.00
  },
  {
    description: "Thermostatic bathroom mixer tap",
    quantity: 1,
    unit: "unit",
    unitPrice: 120.00,
    total: 120.00
  },
  {
    description: "Stainless steel connection hoses",
    quantity: 2,
    unit: "unit",
    unitPrice: 15.00,
    total: 30.00
  },
  {
    description: "Labor - installation and connection work",
    quantity: 3,
    unit: "hour",
    unitPrice: 55.00,
    total: 165.00
  },
  {
    description: "Travel and commissioning",
    quantity: 1,
    unit: "flat rate",
    unitPrice: 50.00,
    total: 50.00
  },
  {
    description: "Disposal of old equipment",
    quantity: 1,
    unit: "flat rate",
    unitPrice: 30.00,
    total: 30.00
  }
];

// French version
export const MOCK_QUOTE_ITEMS_FR: QuoteItem[] = [
  {
    description: "Chauffe-eau électrique 200L - installation verticale",
    quantity: 1,
    unit: "unité",
    unitPrice: 450.00,
    total: 450.00
  },
  {
    description: "Kit de sécurité (groupe de sécurité + vidange + réducteur)",
    quantity: 1,
    unit: "unité",
    unitPrice: 55.00,
    total: 55.00
  },
  {
    description: "Mitigeur thermostatique pour salle de bain",
    quantity: 1,
    unit: "unité",
    unitPrice: 120.00,
    total: 120.00
  },
  {
    description: "Flexibles de raccordement en inox",
    quantity: 2,
    unit: "unité",
    unitPrice: 15.00,
    total: 30.00
  },
  {
    description: "Main-d'œuvre - travaux d'installation et de raccordement",
    quantity: 3,
    unit: "heure",
    unitPrice: 55.00,
    total: 165.00
  },
  {
    description: "Déplacement et mise en service",
    quantity: 1,
    unit: "forfait",
    unitPrice: 50.00,
    total: 50.00
  },
  {
    description: "Enlèvement de l'ancien équipement",
    quantity: 1,
    unit: "forfait",
    unitPrice: 30.00,
    total: 30.00
  }
];

// Function to get mock quote items based on language
export function getMockQuoteItems(language: 'en' | 'fr' = 'en'): QuoteItem[] {
  return language === 'fr' ? MOCK_QUOTE_ITEMS_FR : MOCK_QUOTE_ITEMS_EN;
}

// Default export for backward compatibility
export const MOCK_QUOTE_ITEMS = MOCK_QUOTE_ITEMS_EN;

export const USE_MOCK = true; // Change to false to use OpenAI API
