'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import VehicleCard from '../../components/VehicleCard';

export default function MyItemsPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  async function fetchVehicles() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const { data, error } = await supabase
        .from('Vehicle')
        .select('*')
        .eq('sellerId', user.id) // Filter by the current user's ID
        .order('createdAt', { ascending: false }); // Order by createdAt descending

      if (error) throw error;

      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (vehicles.length === 0) {
    return <div className="text-center mt-8">No vehicles found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">My Items</h1>
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}