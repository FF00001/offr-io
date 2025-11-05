'use client';

import { useState } from 'react';
import { Quote } from '@/types/quote';

export default function QuoteForm() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState('');

  // Artisan info
  const [artisanName, setArtisanName] = useState('');
  const [artisanCompany, setArtisanCompany] = useState('');
  const [artisanAddress, setArtisanAddress] = useState('');
  const [artisanPhone, setArtisanPhone] = useState('');
  const [artisanEmail, setArtisanEmail] = useState('');
  const [artisanSiret, setArtisanSiret] = useState('');

  // Client info
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const handleGenerateQuote = async () => {
    if (!description.trim()) {
      setError('Please describe the intervention');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          artisanInfo: {
            name: artisanName,
            company: artisanCompany,
            address: artisanAddress,
            phone: artisanPhone,
            email: artisanEmail,
            siret: artisanSiret,
          },
          clientInfo: {
            name: clientName,
            address: clientAddress,
            phone: clientPhone,
            email: clientEmail,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quote');
      }

      const data = await response.json();
      setQuote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!quote) return;

    setLoading(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quote),
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
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-gray-50 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Generate a quote
          </h2>
          <p className="text-gray-600 mb-8">
            Fill in the details below to create a professional quote
          </p>

          <form className="space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                Intervention description
              </label>
              <p className="text-sm text-gray-500">
                Describe the work to be done
              </p>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Replace a 200L water heater and install a new mixer in the bathroom"
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                rows={4}
              />
            </div>

            {/* Your Information */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Your information
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="artisanName" className="block text-sm font-medium text-gray-900">
                    Full name
                  </label>
                  <input
                    type="text"
                    id="artisanName"
                    value={artisanName}
                    onChange={(e) => setArtisanName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="artisanCompany" className="block text-sm font-medium text-gray-900">
                    Company name
                  </label>
                  <input
                    type="text"
                    id="artisanCompany"
                    value={artisanCompany}
                    onChange={(e) => setArtisanCompany(e.target.value)}
                    placeholder="ABC Plumbing"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="artisanAddress" className="block text-sm font-medium text-gray-900">
                    Address
                  </label>
                  <input
                    type="text"
                    id="artisanAddress"
                    value={artisanAddress}
                    onChange={(e) => setArtisanAddress(e.target.value)}
                    placeholder="123 Main St, Paris 75001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="artisanPhone" className="block text-sm font-medium text-gray-900">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="artisanPhone"
                      value={artisanPhone}
                      onChange={(e) => setArtisanPhone(e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="artisanEmail" className="block text-sm font-medium text-gray-900">
                      Email
                    </label>
                    <input
                      type="email"
                      id="artisanEmail"
                      value={artisanEmail}
                      onChange={(e) => setArtisanEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="artisanSiret" className="block text-sm font-medium text-gray-900">
                    SIRET <span className="text-gray-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="artisanSiret"
                    value={artisanSiret}
                    onChange={(e) => setArtisanSiret(e.target.value)}
                    placeholder="123 456 789 00012"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Client information
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-900">
                    Client name
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-900">
                    Client address
                  </label>
                  <input
                    type="text"
                    id="clientAddress"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="456 Avenue Victor Hugo, Paris 75016"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-900">
                      Phone <span className="text-gray-500 font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="clientPhone"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+33 6 98 76 54 32"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-900">
                      Email <span className="text-gray-500 font-normal">(optional)</span>
                    </label>
                    <input
                      type="email"
                      id="clientEmail"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleGenerateQuote}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Generating...' : 'Generate quote'}
                </button>

                {quote && (
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    disabled={loading}
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-md shadow-sm border border-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Downloading...' : 'Download PDF'}
                  </button>
                )}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Preview */}
        {quote && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quote preview</h3>
            
            <div className="space-y-6">
              <div className="pb-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">QUOTE</h4>
                <p className="text-sm text-gray-600">No. {quote.quoteNumber}</p>
                <p className="text-sm text-gray-600">Date: {quote.date}</p>
                <p className="text-sm text-gray-600">Valid until: {quote.validUntil}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-gray-200">
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">CONTRACTOR</h5>
                  <p className="text-sm text-gray-700">{quote.artisan.company}</p>
                  <p className="text-sm text-gray-600">{quote.artisan.address}</p>
                  <p className="text-sm text-gray-600">{quote.artisan.phone}</p>
                  <p className="text-sm text-gray-600">{quote.artisan.email}</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-2">CLIENT</h5>
                  <p className="text-sm text-gray-700">{quote.client.name}</p>
                  <p className="text-sm text-gray-600">{quote.client.address}</p>
                </div>
              </div>

              <div className="pb-6 border-b border-gray-200">
                <h5 className="text-sm font-semibold text-gray-900 mb-4">SERVICES</h5>
                <div className="space-y-3">
                  {quote.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.description}
                        <span className="text-gray-500 ml-2">
                          ({item.quantity} {item.unit})
                        </span>
                      </span>
                      <span className="font-medium text-gray-900">{item.total.toFixed(2)}€</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal (excl. VAT):</span>
                  <span className="text-gray-900">{quote.subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT ({quote.tvaRate}%):</span>
                  <span className="text-gray-900">{quote.tva.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total (incl. VAT):</span>
                  <span className="text-gray-900">{quote.total.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
