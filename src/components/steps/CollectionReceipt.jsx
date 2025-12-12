import React from "react";
import InputField from "../common/Input/InputField";
import TextAreaField from "../common/Input/TextAreaField";

const CollectionReceipt = ({ formData, updateField }) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Cash In No"
          value={formData.cashInNo}
          onChange={(e) => updateField("cashInNo", e.target.value)}
          placeholder="Enter cash in number"
          required
        />
        <InputField
          label="Cash In Amount"
          type="text"
          value={formatThousand(formData.cashInAmount)}
          onChange={(e) => {
            const rawValue = parseThousand(e.target.value);
            updateField("cashInAmount", rawValue);
          }}
          inputMode="decimal"
          placeholder="Enter final cash in amount"
          required
        />
        <div className="space-y-4">
          <TextAreaField
            label="Cash In Remark"
            value={formData.cashInRemark || ""}
            onChange={(e) => updateField("cashInRemark", e.target.value)}
            placeholder="Enter cash in comments or conditions"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default CollectionReceipt;
