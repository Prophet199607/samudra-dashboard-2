import React from "react";
import DatePicker from "../common/Input/DatePicker";
import InputField from "../common/Input/InputField";

const AddQuotation = ({ formData, updateField }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        label="Quotation Number"
        value={formData.quotationNumber}
        onChange={(e) => updateField("quotationNumber", e.target.value)}
        placeholder="Enter quotation reference number"
        required
      />
      <DatePicker
        label="Quotation Date"
        value={formData.quotationDate}
        selectedDate={formData.quotationDate}
        setSelectedDate={(date) => updateField("quotationDate", date)}
        required
      />
    </div>
  </div>
);

export default AddQuotation;
