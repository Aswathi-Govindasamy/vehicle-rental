import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global auth error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url;

    // 🔐 Remove token ONLY on 401
    if (
      err.response?.status === 401 &&
      !url?.includes("/auth/login")
    ) {
      localStorage.removeItem("token");
    }

    return Promise.reject(err);
  }
);



export default api;
