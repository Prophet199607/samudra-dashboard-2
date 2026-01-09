import React from "react";
import { FaTruck } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";

export default function Sidebar({ collapsed, mobileOpen, onMobileToggle }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`sidebar hidden sm:block ${
          collapsed ? "w-[80px]" : "w-[260px]"
        }`}
      >
        <div className="brand">
          {collapsed ? (
            <h1 className="text-base font-extrabold text-center">SOM</h1>
          ) : (
            <h1 className="text-2xl font-bold text-center">
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

        <NavLink
          end
          to="/prv-collections"
          className={({ isActive }) => "menuItem" + (isActive ? " active" : "")}
          title="PRV Collection"
        >
          <FaHistory size={20} />
          {!collapsed && <span className="label">PRV Collection</span>}
        </NavLink>

        <NavLink
          end
          to="/users"
          className={({ isActive }) => "menuItem" + (isActive ? " active" : "")}
          title="Users"
        >
          <div className="text-xl">👥</div>
          {!collapsed && <span className="label">Users</span>}
        </NavLink>

        <NavLink
          end
          to="/permissions"
          className={({ isActive }) => "menuItem" + (isActive ? " active" : "")}
          title="Permissions"
        >
          <div className="text-xl">🛡️</div>
          {!collapsed && <span className="label">Permissions</span>}
        </NavLink>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-16 left-0 right-0 bg-[var(--sidebar-bg)]
          sm:hidden transition-all duration-300 text-white z-20
          ${mobileOpen ? "max-h-60 p-4" : "max-h-0 overflow-hidden"}`}
      >
        <NavLink
          end
          to="/dashboard"
          onClick={onMobileToggle}
          className={({ isActive }) =>
            "block py-2 px-2 rounded hover:bg-white/10" +
            (isActive ? " bg-white/20" : "")
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          end
          to="/orders"
          onClick={onMobileToggle}
          className={({ isActive }) =>
            "block py-2 px-2 rounded hover:bg-white/10" +
            (isActive ? " bg-white/20" : "")
          }
        >
          Distribution WIP
        </NavLink>

        <NavLink
          end
          to="/prv-collections"
          onClick={onMobileToggle}
          className={({ isActive }) =>
            "block py-2 px-2 rounded hover:bg-white/10" +
            (isActive ? " bg-white/20" : "")
          }
        >
          PRV Collection
        </NavLink>

        <NavLink
          end
          to="/users"
          onClick={onMobileToggle}
          className={({ isActive }) =>
            "block py-2 px-2 rounded hover:bg-white/10" +
            (isActive ? " bg-white/20" : "")
          }
        >
          Users
        </NavLink>

        <NavLink
          end
          to="/permissions"
          onClick={onMobileToggle}
          className={({ isActive }) =>
            "block py-2 px-2 rounded hover:bg-white/10" +
            (isActive ? " bg-white/20" : "")
          }
        >
          Permissions
        </NavLink>
      </aside>
    </>
  );
}
