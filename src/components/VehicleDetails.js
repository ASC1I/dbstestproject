export default function VehicleDetails({ vehicle, currentPrice, minimumBid }) {
  return (
    <div>
      <p className="text-gray-600 mb-4">{vehicle.description}</p>
      <p className="text-gray-800">
        <strong>Starting Price:</strong> ${vehicle.startPrice.toFixed(2)}
      </p>
      <p className="text-gray-800">
        <strong>Current Price:</strong> ${currentPrice.toFixed(2)}
      </p>
      <p className="text-gray-800">
        <strong>Minimum Next Bid:</strong> ${minimumBid.toFixed(2)}
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
  );
}