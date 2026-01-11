const RazorpayButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 active:scale-95 transition"
    >
      Pay Now
    </button>
  );
};

export default RazorpayButton;
