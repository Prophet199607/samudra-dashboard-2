import React, { useEffect, useState, useCallback, useMemo } from "react";
import InputField from "../common/Input/InputField";
import DatePicker from "../common/Input/DatePicker";
import externalApi from "../../services/externalApi";
import SelectField from "../common/Input/SelectField";
import TextAreaField from "../common/Input/TextAreaField";
import { useExternalApiData } from "../../hooks/useExternalApiData";

const CreateOrder = ({ formData, updateField, isNewOrder, errors = {} }) => {
  const [branches, setBranches] = useState([]);
  const [branchesError, setBranchesError] = useState("");
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [selectedCustomerCode, setSelectedCustomerCode] = useState("");

  const formatThousand = (value) => {
    if (!value) return "";
    const num = value.toString().replace(/,/g, "");
    if (!num || isNaN(num)) return "";
    return Number(num).toLocaleString();
  };

  const parseThousand = (value) => {
    return value.replace(/,/g, "");
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const handleDateChange = (date) => {
    updateField("ordReqDate", formatDate(date));
  };

  const handleInputChange = (field, value) => {
    updateField(field, value);
  };

  const handleCustomerChange = (value) => {
    const selectedCustomer = customerOptions.find(
      (customer) => customer.value === value
    );

    if (selectedCustomer) {
      updateField("customerName", selectedCustomer.label);
      updateField("customerCode", selectedCustomer.value);
      setSelectedCustomerCode(selectedCustomer.value);
    } else {
      updateField("customerName", "");
      setSelectedCustomerCode("");
    }

    updateField("customerBranch", "");
    setBranches([]);

    if (value) {
      fetchCustomerBranches(value);
    }
  };

  const handleBranchChange = (value) => {
    const selectedBranch = branchOptions.find(
      (branch) => branch.value === value
    );

    if (selectedBranch) {
      updateField("customerBranch", selectedBranch.label);
    } else {
      updateField("customerBranch", value);
    }
  };

  const handleSelectChange = (field, value) => {
    updateField(field, value);
  };

  const fetchCustomerDetails = useCallback(async (customerCode) => {
    try {
      const response = await externalApi.post("/Master/GetCustomerDetails", {
        Code: customerCode,
      });

      console.log("Customer details response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching customer details:", error);
      throw error;
    }
  }, []);

  const fetchCustomerBranches = useCallback(
    async (customerCode) => {
      setBranchesLoading(true);
      setBranchesError("");

      try {
        const response = await fetchCustomerDetails(customerCode);

        if (response && response.Branches) {
          const branchOptions = response.Branches.map((branch) => ({
            value: branch.Branch,
            label: branch.Branch,
          }));

          setBranches(branchOptions);
          console.log("Fetched branches:", branchOptions);
        } else {
          setBranches([]);
        }
      } catch (error) {
        setBranchesError("Failed to load customer branches");
        console.error("Error fetching branches:", error);
      } finally {
        setBranchesLoading(false);
      }
    },
    [fetchCustomerDetails]
  );

  const {
    data: customers = [],
    loading: customersLoading,
    error: customersError,
  } = useExternalApiData("/Master/GetCustomers", {
    method: "POST",
    postData: {
      Code: "",
      Name: "",
    },
  });

  const {
    data: customerGroups = [],
    loading: groupsLoading,
    error: groupsError,
  } = useExternalApiData("/Master/GetCustomerGroups");

  const customerOptions = useMemo(
    () =>
      Array.isArray(customers)
        ? customers
            .map((customer) => ({
              value: customer.Cust_Code || "",
              label: customer.Cust_Name || "",
            }))
            .filter((option) => option.value && option.label)
        : [],
    [customers]
  );

  const customerGroupOptions = useMemo(
    () =>
      Array.isArray(customerGroups)
        ? customerGroups
            .map((group) => ({
              value: group.Description || group.value || "",
              label: group.Description || group.label || "Unknown Group",
            }))
            .filter((option) => option.value && option.label)
        : [],
    [customerGroups]
  );

  const branchOptions = branches;

  useEffect(() => {
    if (isNewOrder || !formData.customerName || customerOptions.length === 0) {
      return;
    }
    if (!isNewOrder && formData.customerName && customerOptions.length > 0) {
      const existingCustomer = customerOptions.find(
        (customer) =>
          customer.label === formData.customerName ||
          customer.value === formData.customerName
      );

      if (existingCustomer) {
        setSelectedCustomerCode(existingCustomer.value);
        updateField("customerName", existingCustomer.label);

        if (branches.length === 0) {
          fetchCustomerBranches(existingCustomer.value);
        }
      }
    }
  }, [
    isNewOrder,
    formData.customerName,
    customerOptions,
    updateField,
    branches.length,
    fetchCustomerBranches,
  ]);

  return (
    <div className="space-y-6">
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
            value={selectedCustomerCode || ""}
            onChange={(e) => {
              handleCustomerChange(e.target.value);
            }}
            options={customerOptions}
            placeholder={
              customersLoading ? "Loading customers..." : "Select a customer"
            }
            required
            disabled={customersLoading}
            error={errors.customerName || errors.customer_name}
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
            error={errors.customerGroup || errors.customer_group}
          />
          {groupsError && (
            <div className="text-red-600 text-sm">{groupsError}</div>
          )}

          <SelectField
            label="Customer's Branch"
            value={formData.customerBranch || ""}
            onChange={(e) => {
              handleBranchChange(e.target.value);
            }}
            options={branchOptions}
            placeholder={
              branchesLoading
                ? "Loading branches..."
                : formData.customerName
                ? "Select customer branch"
                : "Select customer first"
            }
            required
            disabled={branchesLoading || !formData.customerName}
            error={errors.customerBranch || errors.customer_branch}
          />
          {branchesLoading && (
            <div className="text-blue-600 text-sm">Loading branches...</div>
          )}
          {branchesError && (
            <div className="text-red-600 text-sm">{branchesError}</div>
          )}
          {formData.customerName &&
            branchOptions.length === 0 &&
            !branchesLoading && (
              <div className="text-yellow-600 text-sm">
                No branches available for this customer
              </div>
            )}
        </div>

        <div className="space-y-4">
          <InputField
            label="ORN Number"
            value={formData.ornNumber || ""}
            onChange={(e) => handleInputChange("ornNumber", e.target.value)}
            placeholder="Enter Order Request Number"
            required
            disabled
            error={errors.ornNumber || errors.orn_number}
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
            error={errors.poAmount || errors.po_amount}
          />
          <TextAreaField
            label="Remark"
            value={formData.orderRemark || ""}
            onChange={(e) => handleInputChange("orderRemark", e.target.value)}
            placeholder="Enter any additional remark or note"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
