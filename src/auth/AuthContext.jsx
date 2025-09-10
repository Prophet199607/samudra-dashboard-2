import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import api from "../services/api";
import { ClipLoader } from "react-spinners";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const hasFetched = useRef(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const token = localStorage.getItem("token");
    const [authResult] = await Promise.all([
      (async () => {
        if (token) {
          try {
            const res = await api.get("/auth/user");
            return res.data.user;
          } catch (err) {
            localStorage.removeItem("token");
            return null;
          }
        }
        return null;
      })(),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]);

    if (authResult) {
      setUser(authResult);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username, password, loca_code) => {
    try {
      const res = await api.post("/login", {
        username,
        password,
        location: loca_code,
      });

      localStorage.setItem("token", res.data.access_token);
      setUser(res.data.user);

      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        message: err.response?.data?.error || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ClipLoader color="#3B82F6" size={50} speedMultiplier={0.5} />
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
