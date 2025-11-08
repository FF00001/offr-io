'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayoutWrapper from '@/components/dashboard/DashboardLayoutWrapper';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/lib/i18n';

interface Quote {
  id: string;
  quoteNumber: string;
  clientName: string;
  date: string;
  total: number;
  quoteData: any;
}

interface DeleteModalProps {
  isOpen: boolean;
  quoteNumber: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmationModal({ isOpen, quoteNumber, onConfirm, onCancel }: DeleteModalProps) {
  const t = useTranslation();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t.dashboard.confirmDelete}
        </h3>
        <p className="text-gray-600 mb-6">
          {t.dashboard.deleteMessage.replace('{quoteNumber}', quoteNumber)}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {t.dashboard.cancel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            {t.dashboard.confirmButton}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const t = useTranslation();
  const { language } = useLanguage();
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    quoteId: string | null;
    quoteNumber: string;
  }>({
    isOpen: false,
    quoteId: null,
    quoteNumber: '',
  });
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  async function fetchQuotes() {
    try {
      const quotesResponse = await fetch('/api/quotes');
      if (!quotesResponse.ok) {
        throw new Error('Failed to fetch quotes');
      }

      const quotesData = await quotesResponse.json();
      setQuotes(quotesData.quotes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (quoteId: string, quoteNumber: string) => {
    setDeleteModal({
      isOpen: true,
      quoteId,
      quoteNumber,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.quoteId) return;

    try {
      const response = await fetch('/api/quotes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deleteModal.quoteId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete quote');
      }

      // Remove the quote from the list
      setQuotes(quotes.filter(q => q.id !== deleteModal.quoteId));
      setDeleteModal({ isOpen: false, quoteId: null, quoteNumber: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, quoteId: null, quoteNumber: '' });
  };

  const handleDownloadPDF = async (quote: Quote) => {
    setDownloadingId(quote.id);
    setError('');

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quote.quoteData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quote-${quote.quoteNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    const locale = language === 'fr' ? 'fr-FR' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <DashboardLayoutWrapper>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-end mb-4">
          <button
            onClick={() => router.push('/dashboard/generate')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors mr-4"
          >
            {t.dashboard.createNewQuote}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{t.dashboard.quotesHistory}</h2>
          </div>

          {quotes.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600 mb-4">{t.dashboard.noQuotesYet}</p>
              <button
                onClick={() => router.push('/dashboard/generate')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
              >
                {t.dashboard.createFirstQuote}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.dashboard.quoteNumber}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.dashboard.clientName}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.dashboard.date}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.dashboard.total}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.dashboard.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {quote.quoteNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {quote.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(quote.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(quote.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownloadPDF(quote)}
                            disabled={downloadingId === quote.id}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors text-xs disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {downloadingId === quote.id ? t.quote.downloading : t.dashboard.downloadPdf}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(quote.id, quote.quoteNumber)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md transition-colors text-xs"
                          >
                            {t.dashboard.delete}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        quoteNumber={deleteModal.quoteNumber}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </DashboardLayoutWrapper>
  );
}
