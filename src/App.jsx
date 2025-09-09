import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./auth/AuthContext";
import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Auth/Login";
import OrderManagementSystem from "./components/OrderManagementSystem";

// Protect routes
function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

// Shared layout for authenticated pages
function PrivateLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`app ${collapsed ? "collapsed" : ""}`}>
      <Sidebar />
      <div className="main">
        <Navbar onToggle={() => setCollapsed((v) => !v)} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Private */}
      <Route
        path="/dashboard"
        element={
          <Private>
            <PrivateLayout>
              <Dashboard />
            </PrivateLayout>
          </Private>
        }
      />
      <Route
        path="/order-management"
        element={
          <Private>
            <PrivateLayout>
              <OrderManagementSystem />
            </PrivateLayout>
          </Private>
        }
      />

      {/* Redirect root */}
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />

      {/* Catch-all */}
      <Route path="*" element={<div className="card">Not Found</div>} />
    </Routes>
  );
}
