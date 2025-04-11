import { useState } from 'react';
import { supabase } from '../utils/supabase';
import cuid from 'cuid';

export default function ManualBidForm({ vehicle, bids, user, minimumBid, onBidPlaced }) {
  const [manualBid, setManualBid] = useState(null);
  const [bidding, setBidding] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
  
    if (!user) {
      alert('You must be logged in to place a bid.');
      return;
    }
  
    const bidAmount = parseFloat(manualBid || minimumBid);
  
    if (isNaN(bidAmount) || bidAmount < minimumBid) {
      setError(`Bid must be at least $${minimumBid.toFixed(2)}`);
      return;
    }
  
    if (bids[0]?.user?.id === user.id) {
      setError('You are already the highest bidder.');
      return;
    }
  
    setBidding(true);
    try {
      const { error } = await supabase
        .from('Bid')
        .insert([{
          id: cuid(),
          vehicleId: vehicle.id,
          userId: user.id,
          amount: bidAmount,
          createdAt: new Date().toLocaleString() // Set createdAt to the local timestamp
        }]);
  
      if (error) throw error;
  
      setManualBid(null);
      onBidPlaced();
    } catch (error) {
      console.error('Error placing bid:', error.message);
      setError(error.message);
    } finally {
      setBidding(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Place a Manual Bid</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() =>
              setManualBid((prev) =>
                Math.max(
                  minimumBid,
                  parseFloat(prev || minimumBid) - vehicle.bidIncrement
                )
              )
            }
            disabled={manualBid <= minimumBid}
            className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            -
          </button>

          <span className="text-lg font-semibold">
            ${manualBid?.toFixed(2) || minimumBid.toFixed(2)}
          </span>

          <button
            type="button"
            onClick={() =>
              setManualBid((prev) =>
                parseFloat(prev || minimumBid) + vehicle.bidIncrement
              )
            }
            className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            +
          </button>
        </div>

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
  );
}