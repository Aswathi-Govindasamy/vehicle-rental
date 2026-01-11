import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addVehicle } from "../../api/owner.api";

const AddVehicle = () => {
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    type: "car",
    pricePerDay: "",
    location: "",
    description: "",
  });

  const [images, setImages] = useState([]); // ✅ NEW
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files); // ✅ STORE SELECTED IMAGES
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      // add text fields
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // add images
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      await addVehicle(formData);
      navigate("/owner/vehicles");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-8">
          Add Vehicle
        </h2>

        {error && (
          <p className="mb-6 text-sm text-red-400 bg-red-900/30 border border-red-800 px-4 py-3 rounded-md">
            {error}
          </p>
        )}

       <form onSubmit={handleSubmit} className="space-y-5">

  {/* MAKE */}
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">
      Vehicle Make (Brand)
    </label>
    <input
      name="make"
      placeholder="e.g. Honda, BMW, Maruti"
      value={form.make}
      onChange={handleChange}
      required
      className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5
                 text-sm text-gray-200 placeholder-gray-500"
    />
  </div>

  {/* MODEL */}
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">
      Vehicle Model
    </label>
    <input
      name="model"
      placeholder="e.g. City, Swift, M5"
      value={form.model}
      onChange={handleChange}
      required
      className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5
                 text-sm text-gray-200 placeholder-gray-500"
    />
  </div>

  {/* YEAR */}
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">
      Manufacturing Year
    </label>
    <input
      name="year"
      type="number"
      placeholder="e.g. 2022"
      value={form.year}
      onChange={handleChange}
      required
      className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5
                 text-sm text-gray-200 placeholder-gray-500"
    />
  </div>

  {/* TYPE */}
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">
      Vehicle Type
    </label>
    <select
      name="type"
      value={form.type}
      onChange={handleChange}
      className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5
                 text-sm text-gray-200"
    >
      <option value="car">Car</option>
      <option value="bike">Bike</option>
      <option value="suv">SUV</option>
      <option value="van">Van</option>
      <option value="truck">Truck</option>
    </select>
  </div>

  {/* PRICE */}
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">
      Price Per Day (₹)
    </label>
    <input
      name="pricePerDay"
      type="number"
      placeholder="e.g. 2500"
      value={form.pricePerDay}
      onChange={handleChange}
      required
      className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5
                 text-sm text-gray-200 placeholder-gray-500"
    />
  </div>

  {/* LOCATION */}
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">
      Location
    </label>
    <input
      name="location"
      placeholder="e.g. Bangalore, Chennai"
      value={form.location}
      onChange={handleChange}
      required
      className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5
                 text-sm text-gray-200 placeholder-gray-500"
    />
  </div>

  {/* DESCRIPTION */}
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">
      Description (Optional)
    </label>
    <textarea
      name="description"
      placeholder="Any additional details about the vehicle"
      value={form.description}
      onChange={handleChange}
      rows={4}
      className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5
                 text-sm text-gray-200 placeholder-gray-500"
    />
  </div>

  {/* IMAGES */}
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">
      Vehicle Images
    </label>
    <input
      type="file"
      multiple
      accept="image/*"
      onChange={handleImageChange}
      className="w-full text-sm text-gray-300"
    />
    <p className="text-xs text-gray-500 mt-1">
      You can upload multiple images (JPG, PNG)
    </p>
  </div>

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg
               hover:bg-indigo-700 transition"
  >
    {loading ? "Adding..." : "Add Vehicle"}
  </button>

</form>

      </div>
    </div>
  );
};

export default AddVehicle;
