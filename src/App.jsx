import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./auth/auth-context.js";
import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Auth/Login";
import Orders from "./pages/Dashboard/Orders/Orders";
import OrderDetail from "./pages/Dashboard/Orders/OrderDetail";
import { ToastContainer } from "./components/alert/ToastAlert";

function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PrivateLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar  */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileToggle={() => setMobileOpen(false)}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-h-screen">
        <Navbar
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
          onMobileToggle={() => setMobileOpen((v) => !v)}
        />

        <main className="flex-1 bg-[var(--page-bg)] p-4 overflow-auto">
          {children}
        </main>
      </div>

      {/* Toasts */}
      <div className="fixed top-0 right-0 z-[99999] pointer-events-none">
        <div className="pointer-events-auto">
          <ToastContainer />
        </div>
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
        path="/orders"
        element={
          <Private>
            <PrivateLayout>
              <Orders />
            </PrivateLayout>
          </Private>
        }
      />
      <Route
        path="/order/:id"
        element={
          <Private>
            <PrivateLayout>
              <OrderDetail />
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
