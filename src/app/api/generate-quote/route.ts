import { NextRequest, NextResponse } from 'next/server';
import { parseQuoteDescription } from '@/lib/openai';
import { QuoteGenerationRequest, Quote, QuoteItem } from '@/types/quote';
import { getMockQuoteItems, USE_MOCK } from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body: QuoteGenerationRequest & { language?: 'en' | 'fr' } = await request.json();
    const { description, artisanInfo, clientInfo, language = 'en' } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    // Parse description with AI or use mock data
    const items: QuoteItem[] = USE_MOCK 
      ? getMockQuoteItems(language)
      : await parseQuoteDescription(description);

    // Calculate totals
    const subtotal = items.reduce((sum, item) => {
      item.total = item.quantity * item.unitPrice;
      return sum + item.total;
    }, 0);

    const tvaRate = 20; // 20% TVA standard en France
    const tva = subtotal * (tvaRate / 100);
    const total = subtotal + tva;

    // Generate quote number
    const quoteNumber = `DEV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    // Calculate dates
    const today = new Date();
    const validUntil = new Date(today);
    validUntil.setDate(validUntil.getDate() + 30); // Valid for 30 days

    const quote: Quote = {
      artisan: {
        name: artisanInfo?.name || 'Your Name',
        company: artisanInfo?.company || 'Your Company',
        address: artisanInfo?.address || 'Your Address',
        phone: artisanInfo?.phone || '+1 XXX XXX XXXX',
        email: artisanInfo?.email || 'your@email.com',
        siret: artisanInfo?.siret,
      },
      client: {
        name: clientInfo?.name || 'Client Name',
        address: clientInfo?.address || 'Client Address',
        phone: clientInfo?.phone,
        email: clientInfo?.email,
      },
      quoteNumber,
      date: today.toLocaleDateString('en-US'),
      validUntil: validUntil.toLocaleDateString('en-US'),
      items,
      subtotal,
      tva,
      tvaRate,
      total,
      notes: 'Quote generated automatically. Thank you for your trust.',
    };

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json(
      { error: 'Failed to generate quote' },
      { status: 500 }
    );
  }
}
