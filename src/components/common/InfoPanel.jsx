import React from "react";

const InfoPanel = ({ title, children, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-900 border-blue-200",
    green: "bg-green-50 text-green-900 border-green-200",
    yellow: "bg-yellow-50 text-yellow-900 border-yellow-200",
    purple: "bg-purple-50 text-purple-900 border-purple-200",
    indigo: "bg-indigo-50 text-indigo-900 border-indigo-200",
    red: "bg-red-50 text-red-900 border-red-200",
    gray: "bg-gray-50 text-gray-900 border-gray-200",
  };

  return (
    <div className={`p-4 rounded-md border mb-4 ${colorClasses[color]}`}>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {children}
    </div>
  );
};

export default InfoPanel;
