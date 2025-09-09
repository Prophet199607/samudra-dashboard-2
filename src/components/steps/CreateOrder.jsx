import React from "react";
import OrderSummary from "../common/OrderSummary";
import InputField from "../common/Input/InputField";
import DatePicker from "../common/Input/DatePicker";
import SelectField from "../common/Input/SelectField";
import TextAreaField from "../common/Input/TextAreaField";
import { DROPDOWN_OPTIONS } from "../../constants/dropdownOptions";

const CreateOrder = ({ formData, updateField }) => {
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

      {/* <InfoPanel title="Create New Order Request" color="blue">
      <p className="text-sm text-blue-700">
        Enter the basic order information and customer details to initiate a new
        order request.
      </p>
    </InfoPanel> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <DatePicker
            label="Order Request Date"
            value={formData.ordReqDate}
            selectedDate={formData.ordReqDate}
            setSelectedDate={(date) => updateField("ordReqDate", date)}
            required
          />

          <SelectField
            label="Customer Name"
            value={formData.customerName}
            onChange={(e) => updateField("customerName", e.target.value)}
            options={DROPDOWN_OPTIONS.customerNames}
            placeholder="Select a customer"
            required
          />
          <SelectField
            label="Customer Group"
            value={formData.customerGroup}
            onChange={(e) => updateField("customerGroup", e.target.value)}
            options={DROPDOWN_OPTIONS.customerGroups}
            placeholder="Select customer group"
          />
          <SelectField
            label="Customer's Branch"
            value={formData.customerBranch}
            onChange={(e) => updateField("customerBranch", e.target.value)}
            options={DROPDOWN_OPTIONS.customerBranches}
            placeholder="Select customer branch"
          />
        </div>

        <div className="space-y-4">
          <InputField
            label="ORN Number"
            value={formData.ornNumber}
            onChange={(e) => updateField("ornNumber", e.target.value)}
            placeholder="Enter Order Request Number"
            required
          />
          <InputField
            label="Customer PO Number"
            value={formData.customerPONo}
            onChange={(e) => updateField("customerPONo", e.target.value)}
            placeholder="Enter customer purchase order number"
          />
          <InputField
            label="PO Amount"
            type="text"
            value={formatThousand(formData.poAmount)}
            onChange={(e) => {
              const rawValue = parseThousand(e.target.value);
              updateField("poAmount", rawValue);
            }}
            inputMode="decimal"
            placeholder="Enter purchase order amount"
          />
          <TextAreaField
            label="Remarks"
            value={formData.orderRemark}
            onChange={(e) => updateField("orderRemark", e.target.value)}
            placeholder="Enter any additional remarks or notes"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
