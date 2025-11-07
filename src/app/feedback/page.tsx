'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useTranslation } from '@/lib/i18n';

export default function FeedbackPage() {
  const t = useTranslation();
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feedback }),
        });

        if (!response.ok) {
          throw new Error('Failed to send feedback');
        }

        setSubmitted(true);
        setFeedback('');
      } catch (error) {
        console.error('Error sending feedback:', error);
        alert(t.feedback.error);
      }
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t.feedback.title}
            </h1>
            <p className="text-gray-600 mb-8">
              {t.feedback.subtitle}
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Feedback textarea */}
                <div className="space-y-2">
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-900">
                    {t.feedback.label}
                  </label>
                  <p className="text-sm text-gray-500">
                    {t.feedback.description}
                  </p>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={t.feedback.placeholder}
                    className="w-full h-40 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 resize-none"
                    required
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-sm transition-colors"
                >
                  {t.feedback.submit}
                </button>
              </form>
            ) : (
              /* Success message */
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg text-gray-900 mb-2 font-medium">
                  {t.feedback.thankYou}
                </p>
                <p className="text-gray-600">
                  {t.feedback.thankYouMessage}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t.feedback.submitAnother}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
