import React, { useMemo, useState } from "react";
import { TAB_CONFIG } from "../../constants/tabConfig";

const OrderSummary = ({
  formData,
  selectedOrder,
  currentStep = Infinity,
  savedSteps,
}) => {
  const [openSections, setOpenSections] = useState(
    TAB_CONFIG.reduce((acc, tab) => ({ ...acc, [tab.id]: false }), {})
  );

  const toggle = (id) => {
    setOpenSections((prevOpenSections) => {
      if (prevOpenSections[id]) {
        return { ...prevOpenSections, [id]: false };
      }

      const newOpenSections = Object.keys(prevOpenSections).reduce(
        (acc, sectionKey) => ({ ...acc, [sectionKey]: false }),
        {}
      );
      newOpenSections[id] = true;
      return newOpenSections;
    });
  };

  const stepDetailsMap = useMemo(() => {
    if (!selectedOrder?.order_details) {
      return new Map();
    }
    return selectedOrder.order_details.reduce((map, detail) => {
      if (
        !map.has(detail.status) ||
        new Date(detail.created_at) >
          new Date(map.get(detail.status).created_at)
      ) {
        map.set(detail.status, detail);
      }
      return map;
    }, new Map());
  }, [selectedOrder]);

  const statusColors = useMemo(() => {
    const colors = TAB_CONFIG.reduce((acc, tab) => {
      acc[tab.id] = tab.color;
      return acc;
    }, {});

    if (selectedOrder?.is_delayed === 1) {
      colors[9] = "bg-red-600";
    } else if (savedSteps?.has(9)) {
      colors[9] = "bg-green-600";
    }
    return colors;
  }, [selectedOrder, savedSteps]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const formatThousand = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const num = value.toString().replace(/,/g, "");
    if (!num || isNaN(num)) return "";
    return Number(num).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const safe = (value) => (value ? value : "—");

  const steps = useMemo(() => {
    if (!formData) return [];

    const stepData = {
      1: [
        {
          label: "Order Request Date",
          value: formData.ordReqDate,
        },
        { label: "Order Request Number", value: formData.ornNumber },
        { label: "Customer Name", value: formData.customerName },
        { label: "PO Number", value: formData.customerPONo },
        {
          label: "PO Amount",
          value: formData.poAmount
            ? `LKR ${formatThousand(formData.poAmount)}`
            : "",
        },
        { label: "Customer Group", value: formData.customerGroup },
        { label: "Customer Branch", value: formData.customerBranch },
        { label: "Order Remark", value: formData.orderRemark },
      ],
      2: [{ label: "Sales Branch", value: formData.salesBranch }],
      3: [
        { label: "Payment Type", value: formData.paymentType },
        {
          label: "Approval Date",
          value: formData.approvalDate,
        },
        { label: "Approval Remark", value: formData.approvalRemark },
      ],
      4: [
        { label: "Sales Order Number", value: formData.salesOrderNumber },
        {
          label: "Sales Order Amount",
          value: formData.salesOrderAmount
            ? `LKR ${formatThousand(formData.salesOrderAmount)}`
            : "",
        },
        {
          label: "Sales Order Date",
          value: formData.salesOrderDate,
        },
      ],
      5: [
        { label: "Quotation Number", value: formData.quotationNumber },
        {
          label: "Quotation Amount",
          value: formData.quotationAmount
            ? `LKR ${formatThousand(formData.quotationAmount)}`
            : "",
        },
        {
          label: "Quotation Date",
          value: formData.quotationDate,
        },
      ],
      6: formData.paymentAttachment
        ? [{ label: "Payment Receipt", value: "Uploaded Successfully" }]
        : [],
      7: formData.paymentConfirmed
        ? [{ label: "Payment Status", value: "Payment Verified & Confirmed" }]
        : [
            {
              label: "Payment Status",
              value: "Payment Not Verified & Rejected",
            },
          ],
      8: [
        { label: "Invoice Number", value: formData.invoiceNumber },
        {
          label: "Invoice Amount",
          value: formData.invoiceAmount
            ? `LKR ${formatThousand(formData.invoiceAmount)}`
            : "",
        },
      ],
      9: [
        { label: "Cash In No", value: formData.cashInNo },
        {
          label: "Cash In Amount",
          value: formData.cashInAmount
            ? `LKR ${formatThousand(formData.cashInAmount)}`
            : "",
        },
        { label: "Cash In Remark", value: formData.cashInRemark },
      ],
      10: [
        { label: "Delivery Type", value: formData.deliveryType },
        { label: "Bus No", value: formData.busNo },
        { label: "Way Bill No", value: formData.wayBillNo },
        { label: "Tracking No", value: formData.tackingNo },
        { label: "Vehicle No", value: formData.vehicleNo },
        { label: "Driver Name", value: formData.driverName },
        { label: "Courier Name", value: formData.courierName },
        { label: "No Of Boxes", value: formData.noOfBoxes },
      ],
    };

    return TAB_CONFIG.map((tab) => ({
      id: tab.id,
      title: tab.title,
      items: stepData[tab.id] || [],
    }));
  }, [formData]);

  if (!formData) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl mb-5">
        <div className="px-5 pt-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <h3 className="text-base font-semibold text-gray-900">
              Order Summary
            </h3>
          </div>
          <p className="text-gray-500 pb-5">No order data available</p>
        </div>
      </div>
    );
  }

  const highlightCards = [
    { label: "Customer", value: safe(formData.customerName) },
    { label: "Order No", value: safe(formData.ornNumber) },
    {
      label: "PO Amount",
      value: formData.poAmount
        ? `LKR ${formatThousand(formData.poAmount)}`
        : "—",
    },
  ];

  // Determine which sections to show based on currentStep
  const maxIndexExclusive = Number.isFinite(currentStep)
    ? Math.max(0, currentStep - 1)
    : steps.length;
  const visibleSteps = steps.filter((_, idx) => idx < maxIndexExclusive);

  if (visibleSteps.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl mb-5">
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">
              Order Summary
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {highlightCards.map((card) => (
            <div
              key={card.label}
              className="border border-gray-200 rounded-lg p-3 bg-gray-50"
            >
              <p className="text-xs font-medium text-gray-500">{card.label}</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {visibleSteps.map((section, index) => {
          const hasAnyValue = section.items.some((i) => i.value);
          if (!hasAnyValue) return null;
          const stepId = index + 1;
          const stepDetail = stepDetailsMap.get(stepId);
          const isSaved = savedSteps?.has?.(stepId);
          const dotColor = isSaved ? statusColors[stepId] : "bg-gray-300";
          return (
            <div key={section.id}>
              <button
                type="button"
                className="w-full px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50 text-left"
                onClick={() => toggle(section.id)}
              >
                <div className="flex flex-col items-start gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
                    <span className="text-sm font-semibold text-gray-900">
                      {section.title}
                    </span>
                    {stepDetail && (
                      <div className="text-xs text-gray-500 font-normal ml-4">
                        by{" "}
                        <span className="font-medium text-gray-700">
                          {stepDetail.user?.username || "System"}
                        </span>{" "}
                        on{" "}
                        <span className="font-medium text-gray-700">
                          {formatDateTime(stepDetail.created_at)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform flex-shrink-0 mt-2 sm:mt-0 ${
                    openSections[section.id] ? "rotate-180" : "rotate-0"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {openSections[section.id] && (
                <div className="px-5 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.items
                      .filter((i) => i.value)
                      .map((item) => (
                        <div
                          key={item.label}
                          className="rounded-lg border border-gray-200 p-3 bg-white"
                        >
                          <p className="text-xs font-medium text-gray-500">
                            {item.label}
                          </p>
                          <p className="text-sm font-semibold text-gray-900 mt-0.5 break-words">
                            {item.value}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderSummary;
