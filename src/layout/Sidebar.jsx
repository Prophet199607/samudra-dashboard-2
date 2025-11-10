import React from "react";
import { FaTruck } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";

export default function Sidebar({ collapsed }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Brand */}
      <div className="brand">
        {collapsed ? (
          <h1 className="text-base font-extrabold text-center">SOM</h1>
        ) : (
          <h1 className="text-2xl font-bold text-center text-capitalize">
            Samudra Order Management
          </h1>
        )}
      </div>

      <NavLink
        end
        to="/dashboard"
        className={({ isActive }) => "menuItem" + (isActive ? " active" : "")}
        title="Dashboard"
      >
        <MdSpaceDashboard size={20} />
        {!collapsed && <span className="label">Dashboard</span>}
      </NavLink>

      <NavLink
        end
        to="/orders"
        className={({ isActive }) => "menuItem" + (isActive ? " active" : "")}
        title="Order Management"
      >
        <FaTruck size={20} />
        {!collapsed && <span className="label">Distribution WIP</span>}
      </NavLink>
    </aside>
  );
}
