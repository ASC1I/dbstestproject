'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../utils/supabase';
import cuid from 'cuid';

export default function VehiclePage() {
  const { id } = useParams(); // Get the vehicle ID from the URL
  const [vehicle, setVehicle] = useState(null);
  const [bids, setBids] = useState([]);
  const [manualBid, setManualBid] = useState(null);
  const [autoBidLimit, setAutoBidLimit] = useState('');
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
          upperLimit,
          createdAt,
          user:Profile(email, id)
        `)
        .eq('vehicleId', id);
  
      if (error) throw error;
  
      // Sort bids by amount in descending order
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

  async function handleManualBid(e) {
    e.preventDefault();
    setError(null);
  
    if (!user) {
      alert('You must be logged in to place a bid.');
      return;
    }
  
    const bidAmount = parseFloat(manualBid || (bids[0]?.amount || vehicle.startPrice));
  
    // Validate bid amount
    const currentPrice = bids[0]?.amount || vehicle.startPrice;
    const minimumBid = bids.length > 0 ? currentPrice + vehicle.bidIncrement : vehicle.startPrice;
  
    if (isNaN(bidAmount) || bidAmount < minimumBid) {
      setError(`Bid must be at least $${minimumBid.toFixed(2)}`);
      return;
    }
  
    // Prevent user from bidding against themselves
    if (bids[0]?.user?.id === user.id) {
      setError('You are already the highest bidder.');
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
  
      setManualBid(null); // Reset manual bid
      fetchBids(); // Refresh bids after placing a new one
    } catch (error) {
      console.error('Error placing bid:', error.message);
      setError(error.message);
    } finally {
      setBidding(false);
    }
  }

  async function handleAutoBid(e) {
    e.preventDefault();
    setError(null);

    if (!user) {
      alert('You must be logged in to place an automatic bid.');
      return;
    }

    const upperLimit = parseFloat(autoBidLimit);

    // Validate upper limit
    if (isNaN(upperLimit) || upperLimit <= 0) {
      setError('Please enter a valid upper limit for your automatic bid.');
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
            amount: bids[0]?.amount || vehicle.startPrice, // Start with the current price
            upperLimit: upperLimit,
          },
        ]);

      if (error) throw error;

      setAutoBidLimit('');
      fetchBids(); // Refresh bids after placing a new one
    } catch (error) {
      console.error('Error placing automatic bid:', error.message);
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
          <p className="text-gray-800">
            <strong>Status:</strong> {vehicle.status}
          </p>
        </div>
      </div>

      {/* Bid Forms */}
      {user && user.id !== vehicle.sellerId && vehicle.status !== 'FINISH' && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Manual Bid Form */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Place a Manual Bid</h2>
            <form onSubmit={handleManualBid} className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                {/* Decrement Button */}
                <button
                  type="button"
                  onClick={() =>
                    setManualBid((prev) =>
                      Math.max(
                        vehicle.startPrice, // Allow decrementing to the starting price when there are no bids
                        parseFloat(prev || vehicle.startPrice) - vehicle.bidIncrement
                      )
                    )
                  }
                  disabled={manualBid <= vehicle.startPrice} // Disable if the bid is already at the starting price
                  className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                  -
                </button>

                {/* Display Current Bid */}
                <span className="text-lg font-semibold">
                  ${manualBid?.toFixed(2) || vehicle.startPrice.toFixed(2)}
                </span>

                {/* Increment Button */}
                <button
                  type="button"
                  onClick={() =>
                    setManualBid((prev) =>
                      parseFloat(prev || vehicle.startPrice) + vehicle.bidIncrement
                    )
                  }
                  className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  +
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={bidding}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bidding ? 'Placing Bid...' : 'Place Manual Bid'}
              </button>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          </div>

          {/* Automatic Bid Form */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Place an Automatic Bid</h2>
            <p className="text-sm text-gray-500 mb-2">
              Set your maximum bid limit. The system will automatically place bids for you up to this limit if you are outbid.
            </p>
            <form onSubmit={handleAutoBid} className="flex flex-col space-y-4">
              <input
                type="number"
                min={currentPrice + vehicle.bidIncrement}
                step="0.01"
                value={autoBidLimit}
                onChange={(e) => setAutoBidLimit(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter your maximum bid limit"
              />
              <button
                type="submit"
                disabled={bidding}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bidding ? 'Placing Automatic Bid...' : 'Place Automatic Bid'}
              </button>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          </div>
        </div>
      )}

      {/* Bid History */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Bid History</h2>
        <div className="space-y-4">
          {bids.length > 0 ? (
            bids.map((bid) => (
              <div
                key={bid.id}
                className="flex justify-between items-center border-b pb-2"
              >
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