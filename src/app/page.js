'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import VehicleCard from '../components/VehicleCard';
import Link from 'next/link';

export default function HomePage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  async function fetchVehicles() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      let query = supabase
        .from('Vehicle')
        .select('*')
        .order('createdAt', { ascending: false }); // Order by creation date

      if (user) {
        // If the user is signed in, exclude their own auctions
        query = query.neq('sellerId', user.id);
      }

      const { data, error } = await query;

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
    return <div className="text-center mt-8">No active auctions found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Active Auctions</h1>
      {vehicles.map((vehicle) => (
        <Link key={vehicle.id} href={`/vehicle/${vehicle.id}`}>
          <VehicleCard vehicle={vehicle} />
        </Link>
      ))}
    </div>
  );
}