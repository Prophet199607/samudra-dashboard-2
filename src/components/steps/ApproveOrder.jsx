import React from "react";
import DatePicker from "../common/Input/DatePicker";
import SelectField from "../common/Input/SelectField";
import TextAreaField from "../common/Input/TextAreaField";
// import { useExternalApiData } from "../../hooks/useExternalApiData";

const ApproveOrder = ({ formData, updateField, errors = {} }) => {
  // const {
  //   data: paymentTypes = [],
  //   loading: paymentTypesLoading,
  //   error: paymentTypesError,
  // } = useExternalApiData("/Master/GetPaymentModes");

  // const paymentOptions = Array.isArray(paymentTypes)
  //   ? paymentTypes
  //       .map((payment) => ({
  //         value: payment.PayType || payment.value || "",
  //         label: payment.PayType || payment.label || "Unknown Payment",
  //       }))
  //       .filter((option) => option.value && option.label)
  //   : [];

  const paymentOptions = [
    { value: "Cash", label: "Cash" },
    { value: "Cash Deposit", label: "Cash Deposit" },
    { value: "Cheque", label: "Cheque" },
    { value: "Credit", label: "Credit" },
  ];

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const handleDateChange = (date) => {
    updateField("approvalDate", formatDate(date));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <DatePicker
            label="Approval Date"
            value={formData.approvalDate || ""}
            selectedDate={formData.approvalDate || ""}
            setSelectedDate={handleDateChange}
            required
          />
          <SelectField
            label="Payment Type"
            value={formData.paymentType || ""}
            onChange={(e) => updateField("paymentType", e.target.value)}
            options={paymentOptions}
            placeholder="Select a payment type"
            required
            error={errors.paymentType || errors.payment_type}
          />
          {/* {paymentTypesError && (
            <div className="text-red-600 text-sm">{paymentTypesError}</div>
          )} */}
        </div>

        <div className="space-y-4">
          <TextAreaField
            label="Approval Remark"
            value={formData.approvalRemark || ""}
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
