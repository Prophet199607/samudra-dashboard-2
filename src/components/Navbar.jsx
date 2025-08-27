import React, { useRef, useState } from "react";
import { MdMenu } from "react-icons/md";
import { FaPowerOff, FaPaperPlane } from "react-icons/fa";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar({ onToggle }) {
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
    <header className="navbar">
      <div className="flex items-center gap-3">
        <button className="iconBtn" onClick={onToggle} aria-label="Toggle sidebar">
          <MdMenu size={20} />
        </button>
        <div className="pageTitle">Welcome, Samudra Team</div>
      </div>

      <div className="relative" ref={ref}>
        <button onClick={() => setOpen(v => !v)} className="user">
          {user?.username ?? "onimta"} ▾
        </button>

        {open && (
          <div className="dropdown">
            <button className="dropItem w-full text-left" onClick={doLogout}>
              <FaPowerOff /> Logout
            </button>
            <button className="dropItem w-full text-left" onClick={() => alert("Go Away")}>
              <FaPaperPlane /> Go Away
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
