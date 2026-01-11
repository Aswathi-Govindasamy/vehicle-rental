import { useEffect, useState } from "react";
import { getVehicles } from "../../api/renter.api";
import VehicleCard from "../../components/vehicle/VehicleCard";

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Search filters
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    minPrice: "",
    maxPrice: "",
  });

  // Fetch vehicles from backend
  const fetchVehicles = async (params = {}) => {
    try {
      setLoading(true);
      const res = await getVehicles(params);
      setVehicles(res.vehicles);
    } catch (error) {
      console.error("Failed to fetch vehicles");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSearch = () => {
    fetchVehicles(filters);
  };

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen">

      {/* ================= HERO / CAROUSEL ================= */}
      <div className="relative h-[420px] w-full">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
          alt="Hero"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60 flex items-center">
          <div className="max-w-6xl mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Rent Vehicles Anytime, Anywhere
            </h1>
            <p className="text-gray-300 mt-4 max-w-2xl">
              Premium cars, bikes & commercial vehicles from verified owners
            </p>
          </div>
        </div>
      </div>

      {/* ================= SEARCH BAR ================= */}
      <div className="mt-20 relative z-10 px-4">
         <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
    Search Vehicles
  </h1>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-6xl mx-auto shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={filters.type}
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value })
              }
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-200"
            >
              <option value="">All Types</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="suv">SUV</option>
              <option value="van">Van</option>
              <option value="truck">Truck</option>
            </select>

            <input
              type="number"
              placeholder="Min ₹"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-200"
            />

            <input
              type="number"
              placeholder="Max ₹"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-200"
            />

            <button
              onClick={handleSearch}
              className="bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg px-4 py-3 font-semibold"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ================= VEHICLE LIST ================= */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-10 text-center">
          Available Vehicles
        </h2>

        {loading ? (
          <div className="text-center text-gray-400">
            Loading vehicles...
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center text-gray-400">
            No vehicles found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
