import React from "react";

const CheckBoxField = ({ id, label, checked, onChange, className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={!!checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
      />
      <label htmlFor={id} className="ml-2 text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
};

export default CheckBoxField;
