'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../utils/supabase';
import cuid from 'cuid';

export default function VehiclePage() {
  const { id } = useParams(); // Get the vehicle ID from the URL
  const [vehicle, setVehicle] = useState(null);
  const [bids, setBids] = useState([]);
  const [newBid, setNewBid] = useState('');
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [error, setError] = useState(null);
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
          user:Profile(email)
        `)
        .eq('vehicleId', id)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setBids(data || []);
    } catch (error) {
      console.error('Error fetching bids:', error.message);
    }
  }

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function handleBid(e) {
    e.preventDefault();
    setError(null);

    if (!user) {
      alert('You must be logged in to place a bid.');
      return;
    }

    const bidAmount = parseFloat(newBid);

    // Validate bid amount
    const currentPrice = bids[0]?.amount || vehicle.startPrice;
    if (isNaN(bidAmount) || bidAmount < currentPrice + vehicle.bidIncrement) {
      setError(`Bid must be at least $${(currentPrice + vehicle.bidIncrement).toFixed(2)}`);
      return;
    }

    setBidding(true);
    try {
      const { error } = await supabase
        .from('Bid')
        .insert([
          {
            id: cuid(),
            vehicleId: id,
            userId: user.id,
            amount: bidAmount,
          },
        ]);

      if (error) throw error;

      setNewBid('');
      fetchBids(); // Refresh bids after placing a new one
    } catch (error) {
      console.error('Error placing bid:', error.message);
      setError(error.message);
    } finally {
      setBidding(false);
    }
  }

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (!vehicle) {
    return <div className="text-center mt-8">Vehicle not found.</div>;
  }

  const currentPrice = bids[0]?.amount || vehicle.startPrice;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{vehicle.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vehicle Image */}
        <div>
          {vehicle.imageUrl ? (
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Vehicle Details */}
        <div>
          <p className="text-gray-600 mb-4">{vehicle.description}</p>
          <p className="text-gray-800">
            <strong>Starting Price:</strong> ${vehicle.startPrice.toFixed(2)}
          </p>
          <p className="text-gray-800">
            <strong>Current Price:</strong> ${currentPrice.toFixed(2)}
          </p>
          <p className="text-gray-800">
            <strong>Bid Increment:</strong> ${vehicle.bidIncrement.toFixed(2)}
          </p>
          <p className="text-gray-800">
            <strong>Color:</strong> {vehicle.color}
          </p>
          <p className="text-gray-800">
            <strong>Location:</strong> {vehicle.location}
          </p>
          <p className="text-gray-800">
            <strong>Seller:</strong> {vehicle.seller?.email || 'Unknown'}
          </p>
          <p className="text-gray-800">
            <strong>End Time:</strong> {new Date(vehicle.endTime).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bid Form */}
      {user && user.id !== vehicle.sellerId && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Place a Bid</h2>
          <form onSubmit={handleBid} className="flex flex-col space-y-4">
            <input
              type="number"
              min={currentPrice + vehicle.bidIncrement}
              step="0.01"
              value={newBid}
              onChange={(e) => setNewBid(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder={`Enter bid amount (min: $${(currentPrice + vehicle.bidIncrement).toFixed(2)})`}
            />
            <button
              type="submit"
              disabled={bidding}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bidding ? 'Placing Bid...' : 'Place Bid'}
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      )}

      {/* Bid History */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Bid History</h2>
        <div className="space-y-4">
          {bids.length > 0 ? (
            bids.map((bid) => (
              <div key={bid.createdAt} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{bid.user?.email || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{new Date(bid.createdAt).toLocaleString()}</p>
                </div>
                <p className="font-bold">${bid.amount.toFixed(2)}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No bids yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}