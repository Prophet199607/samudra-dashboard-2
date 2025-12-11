import React from "react";
import DatePicker from "../common/Input/DatePicker";
import InputField from "../common/Input/InputField";

const AddQuotation = ({ formData, updateField }) => (
  <div className="space-y-6">
    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div> */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <div className="text-sm text-gray-500 font-semibold mb-1">
            Quotation Number
          </div>
          <div className="text-md text-gray-600 font-bold">
            {formData.quotationNumber || (
              <span className="text-gray-400">N/A</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 font-semibold mb-1">
            Quotation Amount
          </div>
          <div className="text-md text-gray-600 font-bold">
            {formData.quotationAmount || (
              <span className="text-gray-400">N/A</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 font-semibold mb-1">
            Quotation Date
          </div>
          <div className="text-md text-gray-600 font-bold">
            {formData.quotationDate ? (
              new Date(formData.quotationDate).toLocaleDateString()
            ) : (
              <span className="text-gray-400">N/A</span>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AddQuotation;
