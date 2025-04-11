export default function BidHistory({ bids }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Bid History</h2>
      <div className="space-y-4">
        {bids.length > 0 ? (
          bids.map((bid, index) => (
            <div
              key={bid.id || index}
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
  );
}