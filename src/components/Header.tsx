'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
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

        {/* Hamburger Menu Button */}
        {!loading && (
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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

      {/* Dropdown Menu */}
      {menuOpen && !loading && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={closeMenu}
          />

          {/* Menu Panel */}
          <div className="absolute right-0 top-16 z-50 w-56 bg-white border border-gray-200 rounded-lg shadow-lg mr-4">
            <div className="py-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/feedback"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Share your feedback
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-gray-100 transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Sign up
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    href="/feedback"
                    onClick={closeMenu}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Share your feedback
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
