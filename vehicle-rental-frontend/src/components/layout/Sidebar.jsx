const Sidebar = ({ children }) => {
  return (
    <div className="flex">
      <aside className="w-56 min-h-screen bg-white border-r border-gray-200 px-4 py-6">
        <div className="space-y-3">
          {children}
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
