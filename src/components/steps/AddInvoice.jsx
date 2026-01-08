import React from "react";
import InputField from "../common/Input/InputField";

const AddInvoice = ({ formData, updateField, isCollection }) => {
  const formatThousand = (value) => {
    if (!value) return "";
    const num = value.toString().replace(/,/g, "");
    if (!num || isNaN(num)) return "";
    return Number(num).toLocaleString();
  };

  const parseThousand = (value) => {
    return value.replace(/,/g, "");
  };

  const fieldConfig = isCollection
    ? {
        numLabel: "Receipt Number",
        numField: "receiptNo",
        numPlace: "Enter receipt number",
        amtLabel: "Receipt Amount",
        amtField: "receiptAmount",
        amtPlace: "Enter receipt amount",
      }
    : {
        numLabel: "Invoice Number",
        numField: "invoiceNumber",
        numPlace: "Enter invoice number",
        amtLabel: "Invoice Amount",
        amtField: "invoiceAmount",
        amtPlace: "Enter final invoice amount",
      };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label={fieldConfig.numLabel}
          value={formData[fieldConfig.numField]}
          onChange={(e) => updateField(fieldConfig.numField, e.target.value)}
          placeholder={fieldConfig.numPlace}
          required
        />
        <InputField
          label={fieldConfig.amtLabel}
          type="text"
          value={formatThousand(formData[fieldConfig.amtField])}
          onChange={(e) => {
            const rawValue = parseThousand(e.target.value);
            updateField(fieldConfig.amtField, rawValue);
          }}
          inputMode="decimal"
          placeholder={fieldConfig.amtPlace}
          required
        />
      </div>
    </div>
  );
};

export default AddInvoice;
