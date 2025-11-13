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

    // Step 7: Payment Confirm
    paymentConfirmed: false,
    paymentRemark: "",

    // Step 8: Invoice Info
    invoiceNumber: "",
    invoiceAmount: "",

    // Step 9: Delivery Info
    deliveryType: "",
    isDelayed: false,
    delayReason: "",
    busNo: "",
    wayBillNo: "",
    trackingNo: "",
    vehicleNo: "",
    driverName: "",
    courierName: "",
    noOfBoxes: "",
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

      if (field === "isDelayed" && value === false && prev.isDelayed === true) {
        newData.isDelayed = false;
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
        7: ["paymentConfirmed", "paymentRemark"],
        8: ["invoiceNumber", "invoiceAmount"],
        9: [
          "deliveryType",
          "isDelayed",
          "delayReason",
          "busNo",
          "wayBillNo",
          "trackingNo",
          "vehicleNo",
          "driverName",
          "courierName",
          "noOfBoxes",
        ],
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
      paymentConfirmed: false,
      paymentRemark: "",
      invoiceNumber: "",
      invoiceAmount: "",
      deliveryType: "",
      isDelayed: false,
      delayReason: "",
      busNo: "",
      wayBillNo: "",
      trackingNo: "",
      vehicleNo: "",
      driverName: "",
      courierName: "",
      noOfBoxes: "",
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
