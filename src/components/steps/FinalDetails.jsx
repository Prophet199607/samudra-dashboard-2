import React from "react";
import InputField from "../common/Input/InputField";

const FinalDetails = ({ formData, updateField }) => {
  const formatThousand = (value) => {
    if (!value) return "";
    const num = value.toString().replace(/,/g, "");
    if (!num || isNaN(num)) return "";
    return Number(num).toLocaleString();
  };

  const parseThousand = (value) => {
    return value.replace(/,/g, "");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputField
            label="Cash IN Number"
            value={formatThousand(formData.cashInNo) || ""}
            onChange={(e) => {
              const rawValue = parseThousand(e.target.value);
              handleInputChange("cashInNo", rawValue);
            }}
            inputMode="decimal"
            placeholder="Enter cash-in reference number"
            required
          />
          <InputField
            label="Way Bill Number"
            value={formData.wayBillNo}
            onChange={(e) => updateField("wayBillNo", e.target.value)}
            placeholder="Enter final bill number"
          />
        </div>

        <div className="space-y-4">
          <InputField
            label="Handover To"
            value={formData.handOverTo}
            onChange={(e) => updateField("handOverTo", e.target.value)}
            placeholder="Enter person to receive the goods"
          />
        </div>
      </div>
    </div>
  );
};

export default FinalDetails;
