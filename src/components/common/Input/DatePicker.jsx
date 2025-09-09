import React, { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";

const DatePicker = ({
  label,
  selectedDate,
  setSelectedDate,
  placeholder = "Select a date",
  required = false,
  className = "",
  disabled = false,
  ...props
}) => {
  const wrapperRef = useRef(null);
  const fpRef = useRef(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    // If no date is selected, default to today
    const defaultDate = selectedDate || new Date();
    if (!selectedDate && setSelectedDate) {
      setSelectedDate(defaultDate.toISOString().split("T")[0]);
    }

    // Initialize flatpickr with wrap enabled
    fpRef.current = flatpickr(wrapperRef.current, {
      wrap: true,
      dateFormat: "Y-m-d",
      defaultDate,
      onChange: (selectedDates, dateStr) => {
        if (setSelectedDate) {
          const value = dateStr || new Date().toISOString().split("T")[0];
          setSelectedDate(value);
        }
      },
      ...props,
    });

    return () => {
      if (fpRef.current) {
        fpRef.current.destroy();
        fpRef.current = null;
      }
    };
  }, [selectedDate, setSelectedDate, props]);

  return (
    <div className={`mb-4 w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Wrap container for flatpickr */}
      <div
        ref={wrapperRef}
        className="relative w-full flex items-center border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
      >
        <input
          type="text"
          data-input
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 text-gray-900 bg-transparent rounded-md placeholder-gray-400 focus:outline-none`}
        />
        <button
          type="button"
          data-toggle
          className="absolute right-3 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DatePicker;
