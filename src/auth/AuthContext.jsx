import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { ClipLoader } from "react-spinners";
import { AuthContext } from "./auth-context.js";

export const AuthProvider = ({ children }) => {
  const hasFetched = useRef(false);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/user");
        setUser(res.data.user);
        setPermissions(res.data.permissions || []);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (name, password, loca_code) => {
    try {
      const res = await api.post("/login", {
        name,
        password,
        location: loca_code,
      });

      localStorage.setItem("token", res.data.access_token);
      setUser(res.data.user);
      setPermissions(res.data.permissions || []);

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
    setPermissions([]);
  };

  const hasRole = (roleName) => {
    return user?.roles?.includes(roleName);
  };

  const hasPermission = (permissionName) => {
    // Super Admin override
    if (hasRole("super admin")) return true;

    // Check specific permission
    return permissions.includes(permissionName);
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
    <AuthContext.Provider
      value={{ user, permissions, login, logout, hasPermission, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};
