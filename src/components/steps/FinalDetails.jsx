import React from "react";
import OrderSummary from "../common/OrderSummary";
import DatePicker from "../common/Input/DatePicker";
import InputField from "../common/Input/InputField";

const FinalDetails = ({ formData, updateField }) => (
  <div className="space-y-6">
    {/* Order Summary */}
    <OrderSummary formData={formData} />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <InputField
          label="Cash IN Number"
          value={formData.cashInNo}
          onChange={(e) => updateField("cashInNo", e.target.value)}
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

export default FinalDetails;
