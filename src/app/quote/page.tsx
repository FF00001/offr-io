'use client';

import Header from '@/components/Header';
import QuoteForm from '@/components/QuoteForm';

export default function QuotePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <QuoteForm />
    </main>
  );
}
