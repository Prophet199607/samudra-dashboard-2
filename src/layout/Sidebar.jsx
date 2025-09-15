import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { FaTruck } from "react-icons/fa";
// import { TbFileLike } from "react-icons/tb";
// import { FaBuildingColumns, FaCircleCheck } from "react-icons/fa6";
// import { GiWallet } from "react-icons/gi";

function SectionTitle({ children }) {
  return <div className="menuTitle">{children}</div>;
}

export default function Sidebar({ collapsed }) {
  const [openItemReq, setOpenItemReq] = useState(true);
  const location = useLocation();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="brand">
        {!collapsed && (
          <h1 className="text-2xl font-bold text-center text-capitalize">
            Samudra Order Management
          </h1>
        )}
      </div>

      {/* <SectionTitle>Dashboard</SectionTitle> */}
      <NavLink
        end
        to="/dashboard"
        className={({ isActive }) => "menuItem" + (isActive ? " active" : "")}
        title="Dashboard"
      >
        <MdSpaceDashboard size={20} />
        <span className="label">Dashboard</span>
      </NavLink>

      <NavLink
        end
        to="/orders"
        className={({ isActive }) => "menuItem" + (isActive ? " active" : "")}
        title="Order Management"
      >
        <FaTruck size={20} />
        <span className="label">Distribution WIP</span>
      </NavLink>

      {/*<SectionTitle>Procurement</SectionTitle>
       Item Request collapsible 
      <div
        className={"menuItem" + (location.pathname.startsWith("/procurement") ? " active" : "")}
        onClick={() => setOpenItemReq(v => !v)}
        style={{ cursor: "pointer" }}
        title="Item Request"
      >
        <TbFileLike size={20} />
        <span className="label">Item Request</span>
        {openItemReq ? <MdExpandLess className="chev" /> : <MdExpandMore className="chev" />}
      </div>*/}

      {/*{openItemReq && (
        <div className="subWrap">
          <NavLink to="/procurement/request-po" className={({ isActive }) => "subItem" + (isActive ? " active" : "")}>
            • <span>Request PO</span>
          </NavLink>
          <NavLink to="/procurement/supervisor-approval" className={({ isActive }) => "subItem" + (isActive ? " active" : "")}>
            • <span>Supervisor Approval</span>
          </NavLink>
          <NavLink to="/procurement/md-approval" className={({ isActive }) => "subItem" + (isActive ? " active" : "")}>
            • <span>MD Approval</span>
          </NavLink>
          <NavLink to="/procurement/process-po" className={({ isActive }) => "subItem" + (isActive ? " active" : "")}>
            • <span>Process PO</span>
          </NavLink>
        </div>
      )}*/}

      {/*<SectionTitle>Inventory</SectionTitle>
      <div className="menuItem" title="Inventory">
        <MdInventory2 size={20} />
        <span className="label">Inventory</span>
      </div>*/}

      {/*<SectionTitle>Accounting</SectionTitle>
      <div className="menuItem" title="Accounting">
        <GiWallet size={20} />
        <span className="label">Accounting</span>
      </div>*/}

      {/*<SectionTitle>Loyalty</SectionTitle>
      <div className="menuItem" title="Loyalty">
        <FaCircleCheck size={20} />
        <span className="label">Loyalty</span>
      </div>*/}

      {/*<SectionTitle>Suppliers</SectionTitle>
      <NavLink
        to="/suppliers"
        className={({ isActive }) => "menuItem" + (isActive ? " active" : "")}
        title="Suppliers"
      >
        <FaBuildingColumns size={20} />
        <span className="label">Suppliers</span>
      </NavLink>*/}
    </aside>
  );
}
