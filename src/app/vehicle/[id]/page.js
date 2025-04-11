'use client';

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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchVehicle();
    fetchBids();
    checkUser();
  }, []);

  async function fetchVehicle() {
    try {
      const { data, error } = await supabase
        .from('Vehicle')
        .select(`
          *,
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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{vehicle.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <VehicleImage imageUrl={vehicle.imageUrl} name={vehicle.name} />
        <VehicleDetails 
          vehicle={vehicle} 
          currentPrice={currentPrice}
          minimumBid={minimumBid}
        />
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
  );
}