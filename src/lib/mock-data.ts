import { QuoteItem } from '@/types/quote';

// Mock data to avoid OpenAI calls during development
export const MOCK_QUOTE_ITEMS: QuoteItem[] = [
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

export const USE_MOCK = true; // Change to false to use OpenAI API
