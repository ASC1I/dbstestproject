'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../utils/supabase';
import VehicleDetails from '../../../components/VehicleDetails';
import VehicleImage from '../../../components/VehicleImage';
import ManualBidForm from '../../../components/ManualBidForm';
import AutoBidForm from '../../../components/AutoBidForm';
import BidHistory from '../../../components/BidHistory';

export default function VehiclePage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [bids, setBids] = useState([]);
  const [similarVehicles, setSimilarVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchVehicle();
    fetchBids();
    checkUser();
  }, []);

  useEffect(() => {
    if (vehicle) {
      fetchSimilarVehicles();
    }
  }, [vehicle]);

  async function fetchVehicle() {
    try {
      const { data, error } = await supabase
        .from('Vehicle')
        .select(`
          *,
          vehicleType:VehicleType(name),
          make:Make(name),
          model:Model(name),
          seller:Profile(email)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setVehicle(data);
    } catch (error) {
      console.error('Error fetching vehicle:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBids() {
    try {
      const { data, error } = await supabase
        .from('Bid')
        .select(`
          amount,
          createdAt,
          user:Profile(email, id)
        `)
        .eq('vehicleId', id);
  
      if (error) throw error;
      const sortedBids = (data || []).sort((a, b) => b.amount - a.amount);
      setBids(sortedBids);
    } catch (error) {
      console.error('Error fetching bids:', error.message);
    }
  }

  async function fetchSimilarVehicles() {
    try {
      const { data, error } = await supabase
        .from('Vehicle')
        .select(`
          id,
          name,
          imageUrl,
          vehicleType:VehicleType(name),
          make:Make(name),
          model:Model(name),
          seller:Profile(id, email)
        `)
        .neq('id', id)
        .neq('sellerId', user?.id)
        .order('createdAt', { ascending: false })
        .limit(20); // Fetch more than needed since we'll filter

      if (error) throw error;

      // Filter vehicles client-side
      const similarVehicles = data?.filter(vehicleItem => 
        vehicleItem.model?.name === vehicle.model?.name || 
        vehicleItem.make?.name === vehicle.make?.name
      ).slice(0, 6); // Take first 6 matches

      console.log('Similar vehicles:', similarVehicles);
      setSimilarVehicles(similarVehicles || []);

    } catch (error) {
      console.error('Error fetching vehicles:', error.message);
      setSimilarVehicles([]);
    }
  }

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (!vehicle) {
    return <div className="text-center mt-8">Vehicle not found.</div>;
  }

  const currentPrice = bids[0]?.amount || vehicle.startPrice;
  const minimumBid = currentPrice + (bids.length > 0 ? vehicle.bidIncrement : 0);

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-4">{vehicle.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <VehicleImage imageUrl={vehicle.imageUrl} name={vehicle.name} />
          <VehicleDetails 
            vehicle={vehicle} 
            currentPrice={currentPrice}
            minimumBid={minimumBid}
          />
        </div>

        <div className="mt-4">
          <p><strong>Vehicle Type:</strong> {vehicle.vehicleType?.name || 'N/A'}</p>
          <p><strong>Make:</strong> {vehicle.make?.name || 'N/A'}</p>
          <p><strong>Model:</strong> {vehicle.model?.name || 'N/A'}</p>
        </div>

        {user && user.id !== vehicle.sellerId && vehicle.status !== 'FINISH' && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <ManualBidForm
              vehicle={vehicle}
              bids={bids}
              user={user}
              minimumBid={minimumBid}
              onBidPlaced={fetchBids}
            />
            <AutoBidForm
              vehicle={vehicle}
              bids={bids}
              user={user}
              minimumBid={minimumBid}
              onBidPlaced={fetchBids}
            />
          </div>
        )}
        
        <BidHistory bids={bids} />
      </div>

      <div className="md:col-span-1">
        <h2 className="text-xl font-bold mb-4">Similar Vehicles</h2>
        <div className="space-y-4 overflow-y-auto max-h-[500px]">
          {similarVehicles.length === 0 ? (
            <p className="text-gray-500">No similar vehicles found.</p>
          ) : (
            similarVehicles.map((vehicle) => (
              <Link 
                key={vehicle.id} 
                href={`/vehicle/${vehicle.id}`} 
                className="block hover:bg-gray-50 p-2 rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {vehicle.imageUrl ? (
                      <img
                        src={vehicle.imageUrl}
                        alt={vehicle.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{vehicle.name}</h3>
                    <div className="text-sm text-gray-500">
                      {vehicle.make?.name && (
                        <span className="font-semibold">{vehicle.make.name}</span>
                      )}
                      {vehicle.model?.name && (
                        <span> • {vehicle.model.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}