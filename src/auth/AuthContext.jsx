import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const AuthCtx = createContext(null);

const DEFAULT_USERS = {
  1: "1",
  admin: "admin123",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { username, location }

  useEffect(() => {
    const saved = localStorage.getItem("samudra_auth");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (username, password, location) => {
    const ok = DEFAULT_USERS[username] && DEFAULT_USERS[username] === password;
    if (!ok) return { ok: false, message: "Invalid username or password." };
    if (!location) return { ok: false, message: "Please select a location." };
    const u = { username, location };
    setUser(u);
    localStorage.setItem("samudra_auth", JSON.stringify(u));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("samudra_auth");
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}
