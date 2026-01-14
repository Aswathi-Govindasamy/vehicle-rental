import { Link } from "react-router-dom";

const VehicleCard = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
      
      {/* IMAGE */}
      <div className="h-40 bg-gray-200 rounded-t-xl overflow-hidden">
  {vehicle.images?.length > 0 ? (
    <img
      src={vehicle.images[0]}
      alt={vehicle.model}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="h-full flex items-center justify-center text-gray-500">
      No Image
    </div>
  )}
</div>


      {/* CONTENT */}
      <div className="p-4">
        <h4 className="font-semibold text-lg text-gray-900">
          {vehicle.make} {vehicle.model}
        </h4>

        <p className="text-sm text-gray-600 mt-1">
          ₹{vehicle.pricePerDay} / day
        </p>

        <Link
          to={`/vehicles/${vehicle._id}`}
          className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default VehicleCard;
