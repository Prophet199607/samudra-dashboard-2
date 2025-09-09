import React from "react";
import OrderSummary from "../common/OrderSummary";
import DatePicker from "../common/Input/DatePicker";
import InputField from "../common/Input/InputField";

const AddSalesOrder = ({ formData, updateField }) => (
  <div className="space-y-6">
    {/* Order Summary */}
    <OrderSummary formData={formData} />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        label="Sales Order Number"
        value={formData.salesOrderNumber}
        onChange={(e) => updateField("salesOrderNumber", e.target.value)}
        placeholder="Enter sales order number"
        required
      />
      <DatePicker
        label="Sales Order Date"
        value={formData.salesOrderDate}
        selectedDate={formData.salesOrderDate}
        setSelectedDate={(date) => updateField("salesOrderDate", date)}
        required
      />
    </div>
  </div>
);

export default AddSalesOrder;
