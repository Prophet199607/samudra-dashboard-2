import React, { useRef, useState } from "react";
import { MdMenu } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/auth-context.js";

export default function Navbar({ onToggle, onMobileToggle, collapsed }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useOnClickOutside(ref, () => setOpen(false));

  const doLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar flex items-center justify-between bg-white border-b border-[var(--border)] px-4 h-16 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile toggle */}
        <button
          className="iconBtn sm:hidden"
          onClick={onMobileToggle}
          aria-label="Toggle mobile sidebar"
        >
          <MdMenu size={22} />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          className="iconBtn hidden sm:block"
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          <MdMenu size={20} />
        </button>

        {!collapsed && (
          <div className="pageTitle hidden sm:block">Welcome, Samudra Team</div>
        )}
      </div>

      <div className="relative" ref={ref}>
        <button onClick={() => setOpen((v) => !v)} className="user">
          {user?.name ?? "onimta"} ▾
        </button>

        {open && (
          <div className="dropdown absolute right-0 mt-2 bg-white border rounded-md shadow-md">
            <button className="dropItem w-full text-left" onClick={doLogout}>
              <FaPowerOff /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
