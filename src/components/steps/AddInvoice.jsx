import React from "react";
import OrderSummary from "../common/OrderSummary";
import InputField from "../common/Input/InputField";

const AddInvoice = ({ formData, updateField }) => {
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
      {/* Order Summary */}
      <OrderSummary formData={formData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Invoice Number"
          value={formData.invoiceNumber}
          onChange={(e) => updateField("invoiceNumber", e.target.value)}
          placeholder="Enter invoice number"
          required
        />
        <InputField
          label="Invoice Amount"
          type="text"
          value={formatThousand(formData.invoiceAmount)}
          onChange={(e) => {
            const rawValue = parseThousand(e.target.value);
            updateField("invoiceAmount", rawValue);
          }}
          inputMode="decimal"
          placeholder="Enter final invoice amount"
          required
        />
      </div>
    </div>
  );
};

export default AddInvoice;
