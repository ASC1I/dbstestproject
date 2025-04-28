'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function CustomerRepAuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Query the CustomerRep table for the provided email
      const { data: customerRep, error: queryError } = await supabase
        .from('CustomerRep')
        .select('id, email, password') // Include the plain-text password
        .eq('email', email)
        .single();

      if (queryError || !customerRep) {
        setError('Invalid email or password');
        return;
      }

      // Compare the provided password with the plain-text password
      if (password !== customerRep.password) {
        setError('Invalid email or password');
        return;
      }

      // Store customer rep login state in localStorage
      localStorage.setItem('isCustomerRepLoggedIn', 'true');

      // Redirect to the customer rep dashboard
      router.push('/customer-rep/reply');
    } catch (err) {
      console.error('Error during login:', err.message);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Customer Rep Login</h1>
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