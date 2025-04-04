'use client'; // This needs to be a Client Component

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Hello</h1>
      
      {user ? (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">User Info:</h2>
          <p>Email: {user.email}</p>
          <p>User ID: {user.id}</p>
          <p>Last signed in: {new Date(user.last_sign_in_at).toLocaleString()}</p>
        </div>
      ) : (
        <p>No user is currently logged in</p>
      )}
    </main>
  );
}