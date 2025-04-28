'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function AdminAuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Query the Admin table for the provided email
      const { data: admin, error: queryError } = await supabase
        .from('Admin')
        .select('id, email, password') // Include the plain-text password
        .eq('email', email)
        .single();

      if (queryError || !admin) {
        setError('Invalid email or password');
        return;
      }

      // Compare the provided password with the plain-text password
      if (password !== admin.password) {
        setError('Invalid email or password');
        return;
      }

      // Store admin login state in localStorage
      localStorage.setItem('isAdminLoggedIn', 'true');

      // Redirect to the admin reports page
      router.push('/admin/report');
    } catch (err) {
      console.error('Error during login:', err.message);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}