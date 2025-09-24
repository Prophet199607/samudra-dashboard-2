import React from "react";
import DatePicker from "../common/Input/DatePicker";
import SelectField from "../common/Input/SelectField";
import TextAreaField from "../common/Input/TextAreaField";
import { useApiData } from "../../hooks/useApiData";

const ApproveOrder = ({ formData, updateField, errors = {} }) => {
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

  // Format the date in YYYY-MM-DD format for the backend
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  // Update the DatePicker onChange handler
  const handleDateChange = (date) => {
    updateField("approvalDate", formatDate(date));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <DatePicker
            label="Approval Date"
            value={formData.approvalDate}
            selectedDate={formData.approvalDate}
            setSelectedDate={handleDateChange}
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
            error={errors.paymentType || errors.payment_type}
          />
          {paymentTypesError && (
            <div className="text-red-600 text-sm">{paymentTypesError}</div>
          )}
        </div>

        <div className="space-y-4">
          <TextAreaField
            label="Approval Remarks"
            value={formData.approvalRemark}
            onChange={(e) => updateField("approvalRemark", e.target.value)}
            placeholder="Enter approval comments or conditions"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default ApproveOrder;
