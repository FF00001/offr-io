import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getQuotesByUserId, createQuote, deleteQuote } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// GET - List all quotes for current user
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const quotes = await getQuotesByUserId(session.id);
    return NextResponse.json({ quotes });
  } catch (error) {
    console.error('Get quotes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new quote
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const quoteData = await request.json();

    const savedQuote = {
      id: uuidv4(),
      userId: session.id,
      quoteNumber: quoteData.quoteNumber,
      clientName: quoteData.client?.name || 'Unknown',
      date: quoteData.date,
      total: quoteData.total,
      quoteData: quoteData,
      createdAt: new Date().toISOString(),
    };

    await createQuote(savedQuote);

    return NextResponse.json({ success: true, quote: savedQuote });
  } catch (error) {
    console.error('Create quote error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a quote
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await request.json();
    await deleteQuote(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete quote error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
