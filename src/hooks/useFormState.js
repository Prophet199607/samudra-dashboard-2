import { useState, useCallback } from "react";

export const useFormState = () => {
  const [formData, setFormData] = useState({
    // Step 1: Basic Order Info
    ordReqDate: "",
    ornNumber: "",
    customerName: "",
    customerPONo: "",
    poAmount: "",
    customerGroup: "",
    orderRemark: "",
    customerBranch: "",

    // Step 2: Branch Assignment
    salesBranch: "",

    // Step 3: Approval Info
    paymentType: "",
    approvalDate: "",
    approvalRemark: "",

    // Step 4: Sales Order Info
    salesOrderNumber: "",
    salesOrderDate: "",

    // Step 5: Quotation Info
    quotationNumber: "",
    quotationDate: "",

    // Step 6: Payment Info
    paymentAttachment: null,
    paymentRemark: "",

    // Step 7: Invoice Info
    invoiceNumber: "",
    invoiceAmount: "",

    // Step 8: Delivery Info
    vehicleNo: "",
    driverName: "",
    noOfBoxes: "",

    // Step 9: Final Details
    cashInNo: "",
    wayBillNo: "",
    handOverTo: "",
  });

  const updateField = useCallback((field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Handle special cases
      if (
        field === "poAmount" ||
        field === "invoiceAmount" ||
        field === "cashChequeAmount"
      ) {
        newData[field] = value
          ? parseFloat(value.toString().replace(/,/g, ""))
          : "";
      }

      return newData;
    });
  }, []);

  const updateStepData = useCallback((step, data) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  const getStepData = useCallback(
    (step) => {
      const stepFields = {
        1: [
          "ordReqDate",
          "ornNumber",
          "customerName",
          "customerPONo",
          "poAmount",
          "customerGroup",
          "orderRemark",
          "customerBranch",
        ],
        2: ["salesBranch", "branchRemark"],
        3: ["approvalDate", "approvalRemark", "paymentType"],
        4: ["salesOrderNumber", "salesOrderDate"],
        5: ["quotationNumber", "quotationDate"],
        6: ["paymentAttachment"],
        7: ["invoiceNumber", "invoiceAmount"],
        8: ["vehicleNo", "driverName", "noOfBoxes"],
        9: ["cashInNo", "wayBillNo", "handOverTo"],
      };

      return Object.fromEntries(
        stepFields[step].map((field) => [field, formData[field]])
      );
    },
    [formData]
  );

  const resetForm = useCallback(() => {
    setFormData({
      ordReqDate: "",
      ornNumber: "",
      customerName: "",
      customerPONo: "",
      poAmount: "",
      customerGroup: "",
      orderRemark: "",
      customerBranch: "",
      salesBranch: "",
      branchRemark: "",
      paymentType: "",
      approvalDate: "",
      approvalRemark: "",
      salesOrderNumber: "",
      salesOrderDate: "",
      quotationNumber: "",
      quotationDate: "",
      paymentAttachment: null,
      invoiceNumber: "",
      invoiceAmount: "",
      vehicleNo: "",
      driverName: "",
      noOfBoxes: "",
      cashInNo: "",
      wayBillNo: "",
      handOverTo: "",
    });
  }, []);

  return {
    formData,
    updateField,
    updateStepData,
    getStepData,
    resetForm,
  };
};
