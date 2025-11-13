import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import SelectField from "../Input/SelectField";
import TextAreaField from "../Input/TextAreaField";

const DeliveryDelay = ({ onClose, onSave }) => {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const delayReasons = [
    "Traffic congestion",
    "Vehicle breakdown",
    "Weather conditions",
    "Incorrect delivery address",
    "High order volume",
    "Other",
  ];

  const reasonOptions = delayReasons.map((reason) => ({
    value: reason,
    label: reason,
  }));

  const handleSave = () => {
    const finalReason = reason === "Other" ? customReason : reason;
    onSave(finalReason);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(17, 25, 40, 0.45)",
        backdropFilter: "blur(10px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.125)",
      }}
      onClick={onClose}
    >
      <div
        className="relative p-6 bg-white bg-opacity-90 rounded-lg shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-2 right-2 z-10 p-1 rounded-full hover:bg-gray-200 focus:outline-none transition"
          aria-label="Close"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <div className="p-2">
          <h2 className="text-lg font-bold mb-4">Delivery Delay Details</h2>
          <div>
            <SelectField
              label="Reason for Delay"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              options={reasonOptions}
              placeholder="Select a reason for delay"
            />
          </div>
          {reason === "Other" && (
            <div>
              <TextAreaField
                label="Custom Reason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter custom reason"
              />
            </div>
          )}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDelay;
