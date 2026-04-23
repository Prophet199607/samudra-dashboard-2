import React, { useState } from "react";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import Login from "./pages/Auth/Login";
import { useAuth } from "./auth/auth-context.js";
import Users from "./pages/Dashboard/Users/Users";
import Dashboard from "./pages/Dashboard/Dashboard";
import Orders from "./pages/Dashboard/Orders/Orders";
import { Routes, Route, Navigate } from "react-router-dom";
import OrderDetail from "./pages/Dashboard/Orders/OrderDetail";
import { ToastContainer } from "./components/alert/ToastAlert";
import Collections from "./pages/Dashboard/Collection/Collections.jsx";
import CollectionDetail from "./pages/Dashboard/Collection/CollectionDetail";
import Permissions from "./pages/Dashboard/Permissions/Permissions";

function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function PermissionRoute({ children, permission }) {
  const { hasPermission } = useAuth();

  if (permission && !hasPermission(permission)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-4xl font-bold text-red-600 mb-2">Access Denied</h1>
        <p className="text-gray-600">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return children;
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
              <PermissionRoute permission="view dashboard">
                <Dashboard />
              </PermissionRoute>
            </PrivateLayout>
          </Private>
        }
      />
      <Route
        path="/orders"
        element={
          <Private>
            <PrivateLayout>
              <PermissionRoute permission="view distribution">
                <Orders />
              </PermissionRoute>
            </PrivateLayout>
          </Private>
        }
      />
      <Route
        path="/order/:id"
        element={
          <Private>
            <PrivateLayout>
              <PermissionRoute permission="view distribution">
                <OrderDetail />
              </PermissionRoute>
            </PrivateLayout>
          </Private>
        }
      />

      <Route
        path="/prv-collections"
        element={
          <Private>
            <PrivateLayout>
              <PermissionRoute permission="view previous collections">
                <Collections />
              </PermissionRoute>
            </PrivateLayout>
          </Private>
        }
      />
      <Route
        path="/prv-collection/:id"
        element={
          <Private>
            <PrivateLayout>
              <PermissionRoute permission="view previous collections">
                <CollectionDetail />
              </PermissionRoute>
            </PrivateLayout>
          </Private>
        }
      />

      <Route
        path="/permissions"
        element={
          <Private>
            <PrivateLayout>
              <PermissionRoute permission="view permissions">
                <Permissions />
              </PermissionRoute>
            </PrivateLayout>
          </Private>
        }
      />

      <Route
        path="/users"
        element={
          <Private>
            <PrivateLayout>
              <PermissionRoute permission="view user management">
                <Users />
              </PermissionRoute>
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
