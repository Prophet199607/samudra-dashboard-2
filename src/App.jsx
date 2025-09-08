import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./auth/AuthContext";
import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Authenticated layout */}
      <Route
        path="/dashboard"
        element={
          <Private>
            <div className={`app ${collapsed ? "collapsed" : ""}`}>
              <Sidebar />
              <div className="main">
                <Navbar onToggle={() => setCollapsed((v) => !v)} />
                <div className="content">
                  <Dashboard />
                </div>
              </div>
            </div>
          </Private>
        }
      />

      {/* Redirect root → dashboard if logged in */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<div className="card">Not Found</div>} />
    </Routes>
  );
}
