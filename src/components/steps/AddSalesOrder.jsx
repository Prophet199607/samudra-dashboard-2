import React from "react";
import DatePicker from "../common/Input/DatePicker";
import InputField from "../common/Input/InputField";

const AddSalesOrder = ({ formData }) => (
  <div className="space-y-6">
    {/* 
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
    */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <div className="text-sm text-gray-500 font-semibold mb-1">
            Sales Order Number
          </div>
          <div className="text-md text-gray-600 font-bold">
            {formData.salesOrderNumber || (
              <span className="text-gray-400">N/A</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 font-semibold mb-1">
            Sales Order Amount
          </div>
          <div className="text-md text-gray-600 font-bold">
            {formData.salesOrderAmount || (
              <span className="text-gray-400">N/A</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 font-semibold mb-1">
            Sales Order Date
          </div>
          <div className="text-md text-gray-600 font-bold">
            {formData.salesOrderDate ? (
              new Date(formData.salesOrderDate).toLocaleDateString()
            ) : (
              <span className="text-gray-400">N/A</span>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AddSalesOrder;
