import React from "react";

const FileUpload = ({
  label,
  onChange,
  accept = "*",
  className = "",
  value,
  required = false,
  error,
}) => (
  <div className={`mb-4 ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="file"
      onChange={onChange}
      accept={accept}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
    {value && (
      <p className="mt-1 text-sm text-gray-600">
        Selected: {typeof value === "string" ? value : value.name}
      </p>
    )}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default FileUpload;
