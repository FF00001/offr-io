'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/lib/i18n';

export default function Header() {
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const t = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
            Offr.io
          </h1>
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {t.header.dashboard}
                  </Link>
                  <Link
                    href="/feedback"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {t.header.feedback}
                  </Link>
                  <button
                    onClick={toggleLanguage}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1 border border-gray-300 rounded-md"
                  >
                    {language === 'en' ? 'FR' : 'EN'}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {t.header.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {t.header.login}
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    {t.header.signup}
                  </Link>
                  <Link
                    href="/feedback"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {t.header.feedback}
                  </Link>
                  <button
                    onClick={toggleLanguage}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1 border border-gray-300 rounded-md"
                  >
                    {language === 'en' ? 'FR' : 'EN'}
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Hamburger Menu Button - Visible on mobile only */}
        {!loading && (
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && !loading && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 md:hidden"
            onClick={closeMenu}
          />

          {/* Menu Panel */}
          <div className="absolute right-0 top-16 z-50 w-56 bg-white border border-gray-200 rounded-lg shadow-lg mr-4 md:hidden">
            <div className="py-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {t.header.dashboard}
                  </Link>
                  <Link
                    href="/feedback"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {t.header.feedback}
                  </Link>
                  <button
                    onClick={() => {
                      toggleLanguage();
                      closeMenu();
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {language === 'en' ? 'FR' : 'EN'}
                  </button>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-gray-100 transition-colors"
                  >
                    {t.header.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {t.header.login}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {t.header.signup}
                  </Link>
                  <Link
                    href="/feedback"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {t.header.feedback}
                  </Link>
                  <button
                    onClick={() => {
                      toggleLanguage();
                      closeMenu();
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {language === 'en' ? 'FR' : 'EN'}
                  </button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
