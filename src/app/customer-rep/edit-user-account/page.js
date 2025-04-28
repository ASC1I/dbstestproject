'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function EditUserAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vehicleId, setVehicleId] = useState('');
  const [bidId, setBidId] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const isCustomerRepLoggedIn = localStorage.getItem('isCustomerRepLoggedIn');
    if (!isCustomerRepLoggedIn) {
      router.push('/customer-rep'); // Redirect to login page if not logged in
    } else {
      setLoading(false); // Customer rep is logged in, stop loading
    }
  }, [router]);

  const handleDeleteVehicle = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    try {
      // Delete the vehicle (associated AutoBids and Bids will be deleted automatically)
      const { error: deleteVehicleError } = await supabase
        .from('Vehicle') // Table name for vehicles
        .delete()
        .eq('id', vehicleId);
  
      if (deleteVehicleError) {
        console.error('Error deleting vehicle:', deleteVehicleError.message);
        setError('Failed to delete vehicle.');
        return;
      }
  
      setSuccess('Vehicle and associated records deleted successfully!');
      setVehicleId('');
    } catch (err) {
      console.error('Unexpected error:', err.message);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleDeleteBid = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const { error: deleteError } = await supabase
        .from('Bid') // Table name for bids
        .delete()
        .eq('id', bidId);

      if (deleteError) {
        console.error('Error deleting bid:', deleteError.message);
        setError('Failed to delete bid.');
        return;
      }

      setSuccess('Bid deleted successfully!');
      setBidId('');
    } catch (err) {
      console.error('Unexpected error:', err.message);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold">Edit User Account</h1>
      <p>Welcome to the edit user account page. Here you can manage user vehicles and bids.</p>

      {/* Delete Vehicle Form */}
      <form onSubmit={handleDeleteVehicle} className="space-y-4 mt-6">
        <h2 className="text-2xl font-bold">Delete Vehicle</h2>
        <input
          type="text"
          placeholder="Vehicle ID"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-red-500 text-white p-2 rounded">
          Delete Vehicle
        </button>
      </form>

      {/* Delete Bid Form */}
      <form onSubmit={handleDeleteBid} className="space-y-4 mt-6">
        <h2 className="text-2xl font-bold">Delete Bid</h2>
        <input
          type="text"
          placeholder="Bid ID"
          value={bidId}
          onChange={(e) => setBidId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-red-500 text-white p-2 rounded">
          Delete Bid
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
  );
}