const VehicleForm = ({ data, onChange, onSubmit }) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4 max-w-xl"
    >
      <input
        name="make"
        placeholder="Make"
        value={data.make}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="model"
        placeholder="Model"
        value={data.model}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="year"
        placeholder="Year"
        value={data.year}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="type"
        placeholder="Type"
        value={data.type}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="pricePerDay"
        placeholder="Price per day"
        value={data.pricePerDay}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="location"
        placeholder="Location"
        value={data.location}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 active:scale-95 transition"
      >
        Save
      </button>
    </form>
  );
};

export default VehicleForm;
