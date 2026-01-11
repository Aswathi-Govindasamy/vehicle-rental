import { useEffect, useState } from "react";
import {
  getAllUsers,
  toggleUserBlock,
} from "../../api/admin.api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    const data = await getAllUsers();
    setUsers(data.users);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggle = async (id) => {
    await toggleUserBlock(id);
    loadUsers();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-300">
        Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          Users
        </h2>

        {users.length === 0 && (
          <p className="text-gray-400">No users found</p>
        )}

        {/* GRID */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-gray-900 border border-gray-800 rounded-2xl shadow
                         hover:shadow-lg transition p-6 flex flex-col"
            >
              {/* USER INFO */}
              <div>
                <p className="text-white font-semibold">
                  {u.name}
                </p>
                <p className="text-sm text-gray-400 break-all">
                  {u.email}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Role:{" "}
                  <span className="font-medium text-gray-300">
                    {u.role.toUpperCase()}
                  </span>
                </p>
              </div>

              {/* STATUS */}
              <span
                className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full w-fit
                  ${
                    u.isBlocked
                      ? "bg-red-900/40 text-red-400"
                      : "bg-green-900/40 text-green-400"
                  }`}
              >
                {u.isBlocked ? "BLOCKED" : "ACTIVE"}
              </span>

              {/* ACTION */}
              <div className="mt-auto pt-5">
                <button
                  onClick={() => handleToggle(u._id)}
                  className={`w-full px-4 py-2 rounded-md text-sm font-medium text-white
                    transition
                    ${
                      u.isBlocked
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                >
                  {u.isBlocked ? "Unblock User" : "Block User"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
