import { useState } from 'react';
import { supabase } from '../utils/supabase';
import cuid from 'cuid';

export default function AutoBidForm({ vehicle, bids, user, minimumBid, onBidPlaced }) {
  const [autoBidLimit, setAutoBidLimit] = useState('');
  const [bidding, setBidding] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
  
    if (!user) {
      alert('You must be logged in to set an automatic bid.');
      return;
    }
  
    const upperLimit = parseFloat(autoBidLimit || minimumBid);
  
    if (isNaN(upperLimit) || upperLimit < minimumBid) {
      setError(`Automatic bid limit must be at least $${minimumBid.toFixed(2)}`);
      return;
    }
  
    setBidding(true);
    try {
      const { error } = await supabase
        .from('AutoBid')
        .upsert(
          [{
            id: cuid(),
            vehicleId: vehicle.id,
            userId: user.id,
            upperLimit: upperLimit,
          }],
          { onConflict: ['vehicleId', 'userId'] }
        );
  
      if (error) throw error;
  
      setAutoBidLimit('');
      onBidPlaced();
    } catch (error) {
      console.error('Error setting automatic bid:', error.message);
      setError(error.message);
    } finally {
      setBidding(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Place an Automatic Bid</h2>
      <p className="text-sm text-gray-500 mb-2">
        Set your maximum bid limit. The system will automatically place bids for you up to this limit if you are outbid.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() =>
              setAutoBidLimit((prev) =>
                Math.max(
                  minimumBid,
                  parseFloat(prev || minimumBid) - vehicle.bidIncrement
                )
              )
            }
            disabled={parseFloat(autoBidLimit) <= minimumBid}
            className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            -
          </button>

          <span className="text-lg font-semibold">
            ${parseFloat(autoBidLimit || minimumBid).toFixed(2)}
          </span>

          <button
            type="button"
            onClick={() =>
              setAutoBidLimit((prev) =>
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
          {bidding ? 'Setting Automatic Bid...' : 'Set Automatic Bid'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}