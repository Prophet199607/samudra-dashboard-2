import React from "react";

const OrderSummary = ({ formData }) => {
  const formatThousand = (value) => {
    if (!value) return "";
    const num = value.toString().replace(/,/g, "");
    if (!num || isNaN(num)) return "";
    return Number(num).toLocaleString();
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md border mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Order Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        {/* Step 1: Basic Order Info */}
        <div>
          <span className="font-medium text-gray-600">Order Request Date:</span>
          <p className="text-gray-900">
            {formData.ordReqDate || "Not specified"}
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-600">
            Order Request Number:
          </span>
          <p className="text-gray-900">
            {formData.ornNumber || "Not specified"}
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Customer Name:</span>
          <p className="text-gray-900">
            {formData.customerName || "Not specified"}
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-600">PO Number:</span>
          <p className="text-gray-900">
            {formData.customerPONo || "Not specified"}
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-600">PO Amount:</span>
          <p className="text-gray-900">
            {formData.poAmount
              ? `LKR ${formatThousand(formData.poAmount)}`
              : "Not specified"}
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Customer Group:</span>
          <p className="text-gray-900">
            {formData.customerGroup || "Not specified"}
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Customer Branch:</span>
          <p className="text-gray-900">
            {formData.customerBranch || "Not specified"}
          </p>
        </div>
        <div>
          <span className="font-medium text-gray-600">Order Remark:</span>
          <p className="text-gray-900">
            {formData.orderRemark || "Not specified"}
          </p>
        </div>

        {/* Step 2: Branch Assignment */}
        {formData.salesBranch && (
          <div>
            <span className="font-medium text-gray-600">Sales Branch:</span>
            <p className="text-gray-900">{formData.salesBranch}</p>
          </div>
        )}

        {/* Step 3: Approval Info */}
        {(formData.approvedDate ||
          formData.paymentType ||
          formData.approveRemark) && (
          <>
            {formData.approvedDate && (
              <div>
                <span className="font-medium text-gray-600">
                  Approved Date:
                </span>
                <p className="text-gray-900">{formData.approvedDate}</p>
              </div>
            )}

            {formData.paymentType && (
              <div>
                <span className="font-medium text-gray-600">Payment Type:</span>
                <p className="text-gray-900">{formData.paymentType}</p>
              </div>
            )}
            {formData.approveRemark && (
              <div>
                <span className="font-medium text-gray-600">
                  Approval Remark:
                </span>
                <p className="text-gray-900">{formData.approveRemark}</p>
              </div>
            )}
          </>
        )}

        {/* Step 4: Sales Order Info */}
        {(formData.salesOrderNumber || formData.salesOrderDate) && (
          <>
            {formData.salesOrderNumber && (
              <div>
                <span className="font-medium text-gray-600">
                  Sales Order Number:
                </span>
                <p className="text-gray-900">{formData.salesOrderNumber}</p>
              </div>
            )}
            {formData.salesOrderDate && (
              <div>
                <span className="font-medium text-gray-600">
                  Sales Order Date:
                </span>
                <p className="text-gray-900">{formData.salesOrderDate}</p>
              </div>
            )}
          </>
        )}

        {/* Step 5: Quotation Info */}
        {(formData.quotationNumber || formData.quotationDate) && (
          <>
            {formData.quotationNumber && (
              <div>
                <span className="font-medium text-gray-600">
                  Quotation Number:
                </span>
                <p className="text-gray-900">{formData.quotationNumber}</p>
              </div>
            )}
            {formData.quotationDate && (
              <div>
                <span className="font-medium text-gray-600">
                  Quotation Date:
                </span>
                <p className="text-gray-900">{formData.quotationDate}</p>
              </div>
            )}
          </>
        )}

        {/* Step 7: Invoice Info */}
        {(formData.invoiceNumber || formData.invoiceAmount) && (
          <>
            {formData.invoiceNumber && (
              <div>
                <span className="font-medium text-gray-600">
                  Invoice Number:
                </span>
                <p className="text-gray-900">{formData.invoiceNumber}</p>
              </div>
            )}
            {formData.invoiceAmount && (
              <div>
                <span className="font-medium text-gray-600">
                  Invoice Amount:
                </span>
                <p className="text-gray-900">
                  {formatThousand(formData.invoiceAmount)}
                </p>
              </div>
            )}
          </>
        )}

        {/* Step 8: Delivery Info */}
        {(formData.vehicleNo || formData.driver || formData.noOfBoxes) && (
          <>
            {formData.vehicleNo && (
              <div>
                <span className="font-medium text-gray-600">Vehicle No:</span>
                <p className="text-gray-900">{formData.vehicleNo}</p>
              </div>
            )}
            {formData.driver && (
              <div>
                <span className="font-medium text-gray-600">Driver:</span>
                <p className="text-gray-900">{formData.driver}</p>
              </div>
            )}
            {formData.noOfBoxes && (
              <div>
                <span className="font-medium text-gray-600">No Of Boxes:</span>
                <p className="text-gray-900">{formData.noOfBoxes}</p>
              </div>
            )}
          </>
        )}

        {/* Step 9: Final Details */}
        {(formData.cashInNo || formData.wayBillNo || formData.handOverTo) && (
          <>
            {formData.cashInNo && (
              <div>
                <span className="font-medium text-gray-600">Cash In No:</span>
                <p className="text-gray-900">{formData.cashInNo}</p>
              </div>
            )}
            {formData.wayBillNo && (
              <div>
                <span className="font-medium text-gray-600">Way Bill No:</span>
                <p className="text-gray-900">{formData.wayBillNo}</p>
              </div>
            )}
            {formData.handOverTo && (
              <div>
                <span className="font-medium text-gray-600">Hand Over To:</span>
                <p className="text-gray-900">{formData.handOverTo}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
