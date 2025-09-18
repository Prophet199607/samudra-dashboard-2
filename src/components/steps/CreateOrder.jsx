import React, { useEffect } from "react";
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

  // Format the date in YYYY-MM-DD format for the backend
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  // Update the DatePicker onChange handler
  const handleDateChange = (date) => {
    updateField("ordReqDate", formatDate(date));
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    updateField(field, value);
  };

  // Handle select changes
  const handleSelectChange = (field, value) => {
    updateField(field, value);
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

  // Map database fields to form fields
  useEffect(() => {
    if (!isNewOrder && formData.customer_name) {
      // Ensure form fields are populated from database data
      const fieldMappings = {
        customer_name: "customerName",
        customer_group: "customerGroup",
        customer_branch: "customerBranch",
        customer_po_no: "customerPONo",
        po_amount: "poAmount",
        orn_number: "ornNumber",
        order_request_date: "ordReqDate",
        remarks: "orderRemark",
      };

      Object.entries(fieldMappings).forEach(([dbField, formField]) => {
        if (formData[dbField] && !formData[formField]) {
          updateField(formField, formData[dbField]);
        }
      });
    }
  }, [isNewOrder, formData, updateField]);

  return (
    <div className="space-y-6">
      {/* Order Summary - shows data from both form and database */}
      {!isNewOrder && <OrderSummary formData={formData} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <DatePicker
            label="Order Request Date"
            value={formData.ordReqDate || ""}
            selectedDate={formData.ordReqDate || ""}
            setSelectedDate={handleDateChange}
            required
          />

          <SelectField
            label="Customer Name"
            value={formData.customerName || ""}
            onChange={(e) => handleSelectChange("customerName", e.target.value)}
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
            value={formData.customerGroup || ""}
            onChange={(e) =>
              handleSelectChange("customerGroup", e.target.value)
            }
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
            value={formData.customerBranch || ""}
            onChange={(e) =>
              handleSelectChange("customerBranch", e.target.value)
            }
            options={DROPDOWN_OPTIONS.customerBranches}
            placeholder="Select customer branch"
          />
        </div>

        <div className="space-y-4">
          <InputField
            label="ORN Number"
            value={formData.ornNumber || ""}
            onChange={(e) => handleInputChange("ornNumber", e.target.value)}
            placeholder="Enter Order Request Number"
            required
            disabled={!isNewOrder}
          />
          <InputField
            label="Customer PO Number"
            value={formData.customerPONo || ""}
            onChange={(e) => handleInputChange("customerPONo", e.target.value)}
            placeholder="Enter customer purchase order number"
          />
          <InputField
            label="PO Amount"
            type="text"
            value={formatThousand(formData.poAmount) || ""}
            onChange={(e) => {
              const rawValue = parseThousand(e.target.value);
              handleInputChange("poAmount", rawValue);
            }}
            inputMode="decimal"
            placeholder="Enter purchase order amount"
          />
          <TextAreaField
            label="Remarks"
            value={formData.orderRemark || ""}
            onChange={(e) => handleInputChange("orderRemark", e.target.value)}
            placeholder="Enter any additional remarks or notes"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
