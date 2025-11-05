import { NextRequest, NextResponse } from 'next/server';
import { generateQuotePDF } from '@/lib/pdf';
import { Quote } from '@/types/quote';

export async function POST(request: NextRequest) {
  try {
    const quote: Quote = await request.json();

    if (!quote || !quote.items || quote.items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid quote data' },
        { status: 400 }
      );
    }

    const pdfBuffer = await generateQuotePDF(quote);

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="devis-${quote.quoteNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
