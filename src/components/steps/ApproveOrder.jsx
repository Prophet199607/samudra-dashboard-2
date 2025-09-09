import React from "react";
import OrderSummary from "../common/OrderSummary";
import DatePicker from "../common/Input/DatePicker";
import SelectField from "../common/Input/SelectField";
import TextAreaField from "../common/Input/TextAreaField";
import { DROPDOWN_OPTIONS } from "../../constants/dropdownOptions";

const ApproveOrder = ({ formData, updateField }) => (
  <div className="space-y-6">
    {/* Order Summary */}
    <OrderSummary formData={formData} />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <DatePicker
          label="Approval Date"
          value={formData.approvedDate}
          selectedDate={formData.approvedDate}
          setSelectedDate={(date) => updateField("approvedDate", date)}
          required
        />
        <SelectField
          label="Payment Type"
          value={formData.paymentType}
          onChange={(e) => updateField("paymentType", e.target.value)}
          options={DROPDOWN_OPTIONS.paymentTypes}
          placeholder="Select payment method"
          required
        />
      </div>

      <div className="space-y-4">
        <TextAreaField
          label="Approval Remarks"
          value={formData.approveRemark}
          onChange={(e) => updateField("approveRemark", e.target.value)}
          placeholder="Enter approval comments or conditions"
          rows={4}
        />
      </div>
    </div>
  </div>
);

export default ApproveOrder;
