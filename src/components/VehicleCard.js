export default function VehicleCard({ vehicle }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm mb-4 flex flex-col sm:flex-row items-center">
      {vehicle.imageUrl && (
        <img
          src={vehicle.imageUrl}
          alt={vehicle.name}
          className="w-24 h-24 object-cover rounded mr-4"
        />
      )}
      <div className="flex-1">
        <h2 className="text-lg font-bold">{vehicle.name}</h2>
        <p className="text-sm text-gray-600">{vehicle.description}</p>
        <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-800">
          <div>
            <strong>Start Price:</strong> ${vehicle.startPrice.toFixed(2)}
          </div>
          <div>
            <strong>Current Price:</strong> ${vehicle.currentPrice.toFixed(2)}
          </div>
          <div>
            <strong>Bid Increment:</strong> ${vehicle.bidIncrement.toFixed(2)}
          </div>
          <div>
            <strong>Location:</strong> {vehicle.location}
          </div>
          <div>
            <strong>Color:</strong> {vehicle.color}
          </div>
          <div>
            <strong>Status:</strong> {vehicle.status}
          </div>
          <div className="col-span-2">
            <strong>End Time:</strong> {new Date(vehicle.endTime).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}