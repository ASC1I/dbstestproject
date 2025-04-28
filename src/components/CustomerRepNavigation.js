'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerRepNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    // Clear the customer rep login state from localStorage
    localStorage.removeItem('isCustomerRepLoggedIn');
    setIsMenuOpen(false);

    // Redirect to the customer rep login page
    router.push('/customer-rep');
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/customer-rep/reply"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Reply
                </Link>
                <Link
                  href="/customer-rep/edit-user-account"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Edit User Account
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <button
              onClick={handleSignOut}
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}