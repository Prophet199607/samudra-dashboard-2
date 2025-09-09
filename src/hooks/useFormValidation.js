import { useMemo } from "react";

export const useFormValidation = (formData, activeStep) => {
  return useMemo(() => {
    const validationRules = {
      1: ["ordReqDate", "ornNumber", "customerName"],
      2: ["salesBranch"],
      3: ["approvedDate", "paymentType"],
      4: ["salesOrderNumber", "salesOrderDate"],
      5: ["quotationNumber", "quotationDate"],
      6: [], // Optional step
      7: ["invoiceNumber", "invoiceAmount"],
      8: ["vehicleNo", "driver"],
      9: ["cashInNo"],
    };

    const requiredFields = validationRules[activeStep] || [];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    return {
      isValid: missingFields.length === 0,
      missingFields,
      canProceed: missingFields.length === 0,
    };
  }, [formData, activeStep]);
};
