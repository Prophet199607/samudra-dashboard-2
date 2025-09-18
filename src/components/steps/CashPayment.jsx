import React from "react";
import FileUpload from "../common/Input/FileUpload";

const CashPayment = ({ formData, updateField }) => (
  <div className="space-y-6">
    <div className="max-w-md">
      <FileUpload
        label="Payment Receipt Attachment"
        onChange={(e) =>
          updateField("cashPaymentAttachment", e.target.files[0])
        }
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        value={formData.cashPaymentAttachment}
      />
      <p className="text-sm text-gray-600 mt-2">
        Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max size: 10MB)
      </p>
    </div>
  </div>
);

export default CashPayment;
