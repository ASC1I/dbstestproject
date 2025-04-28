'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function CreateCustomerRepPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCreateCustomerRep = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Generate a unique ID for the new customer rep
      const id = crypto.randomUUID();

      // Insert a new customer rep into the CustomerRep table
      const { data, error: insertError } = await supabase
        .from('CustomerRep')
        .insert([{ id, email, password }]);

      if (insertError) {
        console.error('Error creating customer rep:', insertError.message);
        setError('Failed to create customer representative.');
        return;
      }

      setSuccess('Customer representative created successfully!');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Unexpected error:', err.message);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Create Customer Representative</h1>
      <form onSubmit={handleCreateCustomerRep} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Create Customer Rep
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  );
}