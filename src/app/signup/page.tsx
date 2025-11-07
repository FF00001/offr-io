'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { useTranslation } from '@/lib/i18n';

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationToken = searchParams.get('token');
  const t = useTranslation();

  const [accountType, setAccountType] = useState<'agent' | 'enterprise'>('agent');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError(t.auth.allFieldsRequired);
      return;
    }

    if (password.length < 6) {
      setError(t.auth.passwordTooShort);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          accountType,
          name,
          ...(invitationToken && { invitationToken }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t.auth.signupTitle}
            </h2>
            <p className="text-gray-600 mb-8">
              {t.auth.signupSubtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Type */}
              {!invitationToken && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    {t.auth.accountType}
                  </label>
                  <p className="text-sm text-gray-500">
                    {t.auth.accountTypeHelp}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAccountType('agent')}
                      className={`px-4 py-3 rounded-md border-2 font-medium transition-colors ${
                        accountType === 'agent'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {t.auth.agent}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('enterprise')}
                      className={`px-4 py-3 rounded-md border-2 font-medium transition-colors ${
                        accountType === 'enterprise'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {t.auth.enterprise}
                    </button>
                  </div>
                </div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                  {accountType === 'agent' ? t.auth.agentName : t.auth.enterpriseName}
                </label>
                <p className="text-sm text-gray-500">
                  {accountType === 'agent' ? t.auth.fullName : t.auth.companyName}
                </p>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={accountType === 'agent' ? 'John Doe' : 'ABC Plumbing'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  {t.auth.emailAddress}
                </label>
                <p className="text-sm text-gray-500">
                  {t.auth.emailHelp}
                </p>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  {t.auth.password}
                </label>
                <p className="text-sm text-gray-500">
                  {t.auth.passwordHelp}
                </p>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.auth.passwordPlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? t.auth.creatingAccount : t.auth.signupButton}
              </button>

              {/* Login link */}
              <p className="text-center text-sm text-gray-600">
                {t.auth.alreadyHaveAccount}{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  {t.auth.loginButton}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function LoadingFallback() {
  const t = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-gray-600">{t.common.loading}</div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SignUpForm />
    </Suspense>
  );
}
