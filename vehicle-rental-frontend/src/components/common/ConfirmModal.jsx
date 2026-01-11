const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[320px] p-6 text-center animate-fadeIn">
        <p className="text-gray-800 text-base mb-6">
          {message}
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
          >
            Yes
          </button>

          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
