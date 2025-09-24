import React from "react";

const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  className = "",
  disabled = false,
  error,
}) => (
  <div className={`mb-4 ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-3 py-2 border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
        error
          ? "focus:ring-red-500 focus:border-red-500"
          : "focus:ring-blue-500 focus:border-blue-500"
      } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
      required={required}
    >
      <option value="">{placeholder || `Select ${label}`}</option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default SelectField;
