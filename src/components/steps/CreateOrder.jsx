import React from "react";
import OrderSummary from "../common/OrderSummary";
import InputField from "../common/Input/InputField";
import DatePicker from "../common/Input/DatePicker";
import SelectField from "../common/Input/SelectField";
import TextAreaField from "../common/Input/TextAreaField";
import { DROPDOWN_OPTIONS } from "../../constants/dropdownOptions";
import { useApiData } from "../../hooks/useApiData";

const CreateOrder = ({ formData, updateField, isNewOrder }) => {
  const formatThousand = (value) => {
    if (!value) return "";
    const num = value.toString().replace(/,/g, "");
    if (!num || isNaN(num)) return "";
    return Number(num).toLocaleString();
  };

  const parseThousand = (value) => {
    return value.replace(/,/g, "");
  };

  // Fetch data using React Query
  const {
    data: customers = [],
    isLoading: customersLoading,
    error: customersError,
  } = useApiData("/customers");

  const {
    data: customerGroups = [],
    isLoading: groupsLoading,
    error: groupsError,
  } = useApiData("/customer-groups");

  // Format dropdown options
  const customerOptions = customers.map((customer) => ({
    value: customer.Cust_Name,
    label: customer.Cust_Name,
  }));

  const customerGroupOptions = customerGroups.map((group) => ({
    value: group.Description,
    label: group.Description,
  }));

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      {!isNewOrder && <OrderSummary formData={formData} />}

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
            options={customerOptions}
            placeholder={
              customersLoading ? "Loading customers..." : "Select a customer"
            }
            required
            disabled={customersLoading}
          />
          {customersError && (
            <div className="text-red-600 text-sm">{customersError}</div>
          )}

          <SelectField
            label="Customer Group"
            value={formData.customerGroup}
            onChange={(e) => updateField("customerGroup", e.target.value)}
            options={customerGroupOptions}
            placeholder={
              groupsLoading ? "Loading groups..." : "Select a customer group"
            }
            required
            disabled={groupsLoading}
          />
          {groupsError && (
            <div className="text-red-600 text-sm">{groupsError}</div>
          )}

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
