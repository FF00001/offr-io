'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayoutWrapper from '@/components/dashboard/DashboardLayoutWrapper';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/lib/i18n';

interface Agent {
  id: string;
  email: string;
  name: string | null;
  status: 'created' | 'pending';
  createdAt: string;
}

export default function AgentsPage() {
  const t = useTranslation();
  const { language } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEnterprise, setIsEnterprise] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    agent: Agent | null;
  }>({
    isOpen: false,
    agent: null,
  });

  // Check user type (session check is handled by wrapper)
  useEffect(() => {
    setMounted(true);
    const checkUserType = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        
        // Only enterprise accounts can access this page
        if (!data.user || data.user.accountType !== 'enterprise') {
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

  // Load agents list
  useEffect(() => {
    if (isEnterprise) {
      fetchAgents();
    }
  }, [isEnterprise]);

  const fetchAgents = async () => {
    setLoadingAgents(true);
    try {
      const response = await fetch('/api/agents');
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      const data = await response.json();
      setAgents(data.agents || []);
    } catch (err) {
      console.error('Failed to load agents:', err);
    } finally {
      setLoadingAgents(false);
    }
  };

  const handleDeleteClick = (agent: Agent) => {
    setDeleteModal({
      isOpen: true,
      agent,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.agent) return;

    try {
      const response = await fetch('/api/agents', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: deleteModal.agent.id,
          type: deleteModal.agent.status,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }

      // Remove from list
      setAgents(agents.filter((a) => a.id !== deleteModal.agent!.id));
      setDeleteModal({ isOpen: false, agent: null });
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete agent');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, agent: null });
  };

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
      
      // Refresh agents list
      await fetchAgents();
      
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = language === 'fr' ? 'fr-FR' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
            {t.agents.title}
          </h1>
          <p className="text-gray-600">
            {t.agents.subtitle}
          </p>
        </div>

        {/* Add Agent Button */}
        <button
          onClick={openModal}
          className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-sm transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t.agents.addAgent}
        </button>

        {/* Agents List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{t.agents.agentsListTitle}</h2>
          </div>

          {loadingAgents ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-sm text-gray-600">{t.agents.loadingAgents}</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600">{t.agents.noAgentsYet}</p>
              <p className="text-sm text-gray-500 mt-2">{t.agents.clickAddAgent}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.agents.email}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.agents.name}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.agents.status}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.agents.invitedOn}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.agents.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {agent.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {agent.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {agent.status === 'created' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {t.agents.statusCreated}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {t.agents.statusPending}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(agent.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteClick(agent)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md transition-colors text-xs"
                        >
                          {t.agents.delete}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t.agents.inviteAgentTitle}
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
                      {t.agents.invitationSent}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t.agents.invitationSentMessage}
                    </p>
                  </div>
                ) : (
                  // Invitation Form
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div>
                      <label htmlFor="modal-email" className="block text-sm font-medium text-gray-900 mb-2">
                        {t.agents.agentEmail}
                      </label>
                      <input
                        type="email"
                        id="modal-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.agents.emailPlaceholder}
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
                        {t.agents.cancel}
                      </button>
                      <button
                        type="submit"
                        disabled={sending}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md shadow-sm transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {sending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {t.agents.sending}
                          </>
                        ) : (
                          t.agents.invite
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && deleteModal.agent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t.agents.deleteAgentTitle}
              </h3>
              <p className="text-gray-600 mb-6">
                {t.agents.deleteAgentMessage.replace('{email}', deleteModal.agent.email)}
                {deleteModal.agent.status === 'pending' && ` ${t.agents.deleteAgentPendingMessage}`}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {t.agents.cancel}
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  {t.agents.delete}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayoutWrapper>
  );
}
