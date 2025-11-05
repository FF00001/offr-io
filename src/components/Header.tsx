import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
            Offr.io
          </h1>
        </Link>

        <Link
          href="/feedback"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Share your feedback
        </Link>
      </div>
    </header>
  );
}
