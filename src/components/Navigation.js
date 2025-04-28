'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export default function Navigation() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-white text-xl font-bold">BUYME</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-white text-xl font-bold">
                BUYME
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                {user && (
                  <>
                    <Link
                      href="/my-items"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      My Items
                    </Link>
                    <Link
                      href="/create"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Create Auction
                    </Link>
                    <Link
                      href="/my-alerts"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      My Alerts
                    </Link>
                    <Link
                      href="/help-chat"
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Help Chat
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/auth"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 