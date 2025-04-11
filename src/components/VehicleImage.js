export default function VehicleImage({ imageUrl, name }) {
  return (
    <div>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-64 object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">No image available</span>
        </div>
      )}
    </div>
  );
}