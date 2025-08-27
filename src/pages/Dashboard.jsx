import React from "react";

const Stat = ({ value, label }) => (
  <div className="card">
    <div className="cardValue">{value}</div>
    <div className="cardTitle">{label}</div>
  </div>
);

export default function Dashboard() {
  return (
    <div className="content-inner space-y-4">
      {/*Content*/}
    </div>
  );
}
