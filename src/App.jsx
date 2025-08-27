import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./auth/AuthContext";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  // Show login page without app chrome
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Authenticated layout
  return (
    <div className={`app ${collapsed ? "collapsed" : ""}`}>
      <Sidebar />
      <div className="main">
        <Navbar onToggle={() => setCollapsed(v => !v)} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Private><Dashboard /></Private>} />
            <Route path="*" element={<div className="card">Not Found</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
