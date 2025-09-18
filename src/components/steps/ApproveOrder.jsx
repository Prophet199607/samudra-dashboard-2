import React from "react";
import OrderSummary from "../common/OrderSummary";
import DatePicker from "../common/Input/DatePicker";
import SelectField from "../common/Input/SelectField";
import TextAreaField from "../common/Input/TextAreaField";
import { DROPDOWN_OPTIONS } from "../../constants/dropdownOptions";
import { useApiData } from "../../hooks/useApiData";

const ApproveOrder = ({ formData, updateField }) => {
  // Fetch data using React Query
  const {
    data: paymentTypes = [],
    isLoading: paymentTypesLoading,
    error: paymentTypesError,
  } = useApiData("/payment-types");

  // Format dropdown options
  const paymentOptions = paymentTypes.map((payment) => ({
    value: payment.Description,
    label: payment.Description,
  }));

  return (
    <div className="space-y-6">
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
            options={paymentOptions}
            placeholder={
              paymentTypesLoading
                ? "Loading payments..."
                : "Select a payment type"
            }
            required
            disabled={paymentTypesLoading}
          />
          {paymentTypesError && (
            <div className="text-red-600 text-sm">{paymentTypesError}</div>
          )}
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
};

export default ApproveOrder;
