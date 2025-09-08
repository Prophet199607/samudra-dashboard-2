import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const hasFetched = useRef(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await api.get("/auth/user");
        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem("token");
      }
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
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
