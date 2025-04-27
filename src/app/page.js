'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import VehicleCard from '../components/VehicleCard';
import Link from 'next/link';
import SearchFilter from '../components/SearchFilter';

export default function HomePage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ vehicleTypeId: '', makeId: '', modelId: '' });

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

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

      if (filters.vehicleTypeId) {
        query = query.eq('vehicleTypeId', filters.vehicleTypeId);
      }
      if (filters.makeId) {
        query = query.eq('makeId', filters.makeId);
      }
      if (filters.modelId) {
        query = query.eq('modelId', filters.modelId);
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

  function handleFilterChange(newFilters) {
    setFilters(newFilters);
  }

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Active Auctions</h1>
      <SearchFilter onFilterChange={handleFilterChange} />
      {vehicles.length === 0 ? (
        <div className="text-center mt-8">No active auctions found.</div>
      ) : (
        vehicles.map((vehicle) => (
          <Link key={vehicle.id} href={`/vehicle/${vehicle.id}`}>
            <VehicleCard vehicle={vehicle} />
          </Link>
        ))
      )}
    </div>
  );
}