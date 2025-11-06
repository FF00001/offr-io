'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayoutWrapper from '@/components/dashboard/DashboardLayoutWrapper';

interface InvitationResult {
  success: boolean;
  invitationUrl?: string;
  error?: string;
}

export default function AgentsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEnterprise, setIsEnterprise] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<InvitationResult | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(null);

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

      setSuccess({
        success: true,
        invitationUrl: data.invitationUrl,
      });
      setEmail(''); // Clear form
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSending(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
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
      <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Invite Agents
            </h1>
            <p className="text-gray-600">
              Invite agents to join your team and start creating quotes together.
            </p>
          </div>

          {/* Invitation Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Send Invitation
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  Agent Email Address
                </label>
                <p className="text-sm text-gray-500">
                  Enter the email address of the agent you want to invite
                </p>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  required
                  disabled={sending}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && success.invitationUrl && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-green-800 mb-1">
                        Invitation sent successfully!
                      </h3>
                      <p className="text-sm text-green-700 mb-3">
                        An email has been sent to the agent with an invitation link.
                      </p>
                      
                      {/* Invitation URL */}
                      <div className="space-y-2">
                        <label className="block text-xs font-medium text-green-800">
                          Invitation URL (share this manually if needed):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={success.invitationUrl}
                            readOnly
                            className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-md text-sm text-gray-700 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => copyToClipboard(success.invitationUrl!)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending invitation...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Invitation
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Information Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">
                  How it works
                </h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Enter the agent's email address and click "Send Invitation"</li>
                  <li>The agent will receive an email with a unique invitation link</li>
                  <li>They can sign up using the link and will be automatically linked to your enterprise</li>
                  <li>Once signed up, they can start creating quotes on behalf of your company</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Future: Invited Agents List */}
          {/* This section can be uncommented when tracking is implemented */}
          {/*
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Invited Agents
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Track and manage your agent invitations
            </p>
            <div className="text-center py-8 text-gray-500">
              No invitations sent yet
            </div>
          </div>
          */}
      </div>
    </DashboardLayoutWrapper>
  );
}
