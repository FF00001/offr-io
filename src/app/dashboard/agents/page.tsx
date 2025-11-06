'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayoutWrapper from '@/components/dashboard/DashboardLayoutWrapper';

export default function AgentsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEnterprise, setIsEnterprise] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Check user type (session check is handled by wrapper)
  useEffect(() => {
    setMounted(true);
    const checkUserType = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          return;
        }

        const session = await response.json();
        
        // Only enterprise accounts can access this page
        if (session.accountType !== 'enterprise') {
          router.push('/dashboard');
          return;
        }

        setIsEnterprise(true);
      } catch (err) {
        console.error('User type check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUserType();
  }, [router]);

  const openModal = () => {
    setIsModalOpen(true);
    setEmail('');
    setError('');
    setShowSuccess(false);
  };

  const closeModal = () => {
    if (!sending) {
      setIsModalOpen(false);
      setEmail('');
      setError('');
      setShowSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setSending(true);

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation');
      }

      // Show success message
      setShowSuccess(true);
      setEmail('');
      
      // Close modal after 3 seconds
      setTimeout(() => {
        setIsModalOpen(false);
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSending(false);
    }
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted || loading) {
    return null;
  }

  if (!isEnterprise) {
    return null; // Will redirect
  }

  return (
    <DashboardLayoutWrapper>
      <div className="max-w-4xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Team Management
          </h1>
          <p className="text-gray-600">
            Invite agents to join your enterprise team
          </p>
        </div>

        {/* Add Agent Button */}
        <button
          onClick={openModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-sm transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Agent
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Invite Agent
                </h2>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-4">
                {showSuccess ? (
                  // Success Message
                  <div className="py-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Invitation Sent!
                    </h3>
                    <p className="text-sm text-gray-600">
                      The agent will receive an email with instructions to join your team.
                    </p>
                  </div>
                ) : (
                  // Invitation Form
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div>
                      <label htmlFor="modal-email" className="block text-sm font-medium text-gray-900 mb-2">
                        Agent Email
                      </label>
                      <input
                        type="email"
                        id="modal-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="agent@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                        required
                        disabled={sending}
                        autoFocus
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-start gap-2">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Modal Actions */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={closeModal}
                        disabled={sending}
                        className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-md border border-gray-300 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={sending}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {sending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          'Invite'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayoutWrapper>
  );
}
