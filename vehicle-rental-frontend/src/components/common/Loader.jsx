const Loader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-sm text-gray-600">
        Loading, please wait...
      </p>
    </div>
  );
};

export default Loader;
