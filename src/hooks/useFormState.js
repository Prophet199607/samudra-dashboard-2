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
    approvedDate: "",
    approveRemark: "",
    paymentType: "",

    // Step 4: Sales Order Info
    salesOrderNumber: "",
    salesOrderDate: "",

    // Step 5: Quotation Info
    quotationNumber: "",
    quotationDate: "",

    // Step 6: Payment Attachment
    cashPaymentAttachment: null,

    // Step 7: Invoice Info
    invoiceNumber: "",
    invoiceAmount: "",

    // Step 8: Delivery Info
    vehicleNo: "",
    driver: "",
    noOfBoxes: "",

    // Step 9: Final Details
    cashInNo: "",
    wayBillNo: "",
    handOverTo: "",

    // Additional fields from document analysis
    billNo: "",
    busNo: "",
    cashChequeNo: "",
    cashChequeAmount: "",
    paymentDate: "",
  });

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      date: "",
      ornNumber: "",
      customerName: "",
      customerPONo: "",
      poAmount: "",
      customerGroup: "",
      remark: "",
      customerBranch: "",
      salesBranch: "",
      approvedDate: "",
      approveRemark: "",
      paymentType: "",
      salesOrderNumber: "",
      salesOrderDate: "",
      quotationNumber: "",
      quotationDate: "",
      cashPaymentAttachment: null,
      invoiceNumber: "",
      invoiceAmount: "",
      vehicleNo: "",
      driver: "",
      noOfBoxes: "",
      wayBillNo: "",
      handOverTo: "",
      cashInNo: "",
      finalHandoverTo: "",
      billNo: "",
      busNo: "",
      cashChequeNo: "",
      cashChequeAmount: "",
      paymentDate: "",
    });
  }, []);

  return [formData, updateField, resetForm];
};
