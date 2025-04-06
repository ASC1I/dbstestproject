export default function VehicleCard({ vehicle }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm mb-4">
      <h2 className="text-xl font-bold">{vehicle.name}</h2>
      <p className="text-gray-600">{vehicle.description}</p>
      <p className="text-gray-800">
        <strong>Starting Price:</strong> ${vehicle.startPrice.toFixed(2)}
      </p>
      <p className="text-gray-800">
        <strong>Current Price:</strong> ${vehicle.currentPrice.toFixed(2)}
      </p>
      <p className="text-gray-800">
        <strong>Bid Increment:</strong> ${vehicle.bidIncrement.toFixed(2)}
      </p>
      <p className="text-gray-800">
        <strong>Location:</strong> {vehicle.location}
      </p>
      <p className="text-gray-800">
        <strong>Color:</strong> {vehicle.color}
      </p>
      <p className="text-gray-800">
        <strong>Status:</strong> {vehicle.status}
      </p>
      <p className="text-gray-800">
        <strong>End Time:</strong> {new Date(vehicle.endTime).toLocaleString()}
      </p>
      {vehicle.imageUrl && (
        <img
          src={vehicle.imageUrl}
          alt={vehicle.name}
          className="w-full h-48 object-cover mt-4 rounded"
        />
      )}
    </div>
  );
}