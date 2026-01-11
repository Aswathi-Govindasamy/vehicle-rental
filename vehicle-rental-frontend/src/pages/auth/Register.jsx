import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/auth.api";
import useAuth from "../../auth/UseAuth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("renter");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser({
        name,
        email,
        password,
        role,
      });

      login(data);

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Create Account
        </h2>

        {error && (
          <p className="mb-5 text-sm text-red-400 bg-red-900/30 border border-red-800 rounded-md p-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md
                         text-gray-200 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md
                         text-gray-200 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md
                         text-gray-200 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-indigo-500
                         transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md
                         text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500
                         transition"
            >
              <option value="renter">Renter</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-indigo-600 text-white font-medium
                       hover:bg-indigo-700 disabled:opacity-60
                       transition duration-200"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:text-indigo-300 transition"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
