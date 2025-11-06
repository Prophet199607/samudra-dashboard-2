import React, { useMemo, useState } from "react";

const OrderSummary = ({ formData, currentStep = Infinity, savedSteps }) => {
  const [openSections, setOpenSections] = useState({
    basic: true,
    branch: false,
    approval: false,
    salesOrder: false,
    quotation: false,
    invoice: false,
    delivery: false,
    final: false,
  });

  const toggle = (key) => {
    setOpenSections((prevOpenSections) => {
      // If the clicked section is already open, close it.
      if (prevOpenSections[key]) {
        return { ...prevOpenSections, [key]: false };
      }

      // Otherwise, close all other sections and open the clicked one.
      const newOpenSections = Object.keys(prevOpenSections).reduce(
        (acc, sectionKey) => ({ ...acc, [sectionKey]: false }),
        {}
      );
      newOpenSections[key] = true;
      return newOpenSections;
    });
  };

  const formatThousand = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const num = value.toString().replace(/,/g, "");
    if (!num || isNaN(num)) return "";
    return Number(num).toLocaleString();
  };

  const safe = (value) => (value ? value : "—");

  const steps = useMemo(() => {
    if (!formData) return [];
    return [
      {
        key: "basic",
        title: "Basic Order Info",
        items: [
          { label: "Order Request Date", value: formData.ordReqDate },
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
      },
      {
        key: "branch",
        title: "Branch Assignment",
        items: [{ label: "Sales Branch", value: formData.salesBranch }],
      },
      {
        key: "approval",
        title: "Approval",
        items: [
          { label: "Payment Type", value: formData.paymentType },
          { label: "Approval Date", value: formData.approvalDate },
          { label: "Approval Remark", value: formData.approvalRemark },
        ],
      },
      {
        key: "salesOrder",
        title: "Sales Order",
        items: [
          { label: "Sales Order Number", value: formData.salesOrderNumber },
          { label: "Sales Order Date", value: formData.salesOrderDate },
        ],
      },
      {
        key: "quotation",
        title: "Quotation",
        items: [
          { label: "Quotation Number", value: formData.quotationNumber },
          { label: "Quotation Date", value: formData.quotationDate },
        ],
      },
      {
        key: "invoice",
        title: "Invoice",
        items: [
          { label: "Invoice Number", value: formData.invoiceNumber },
          {
            label: "Invoice Amount",
            value: formData.invoiceAmount
              ? `LKR ${formatThousand(formData.invoiceAmount)}`
              : "",
          },
        ],
      },
      {
        key: "delivery",
        title: "Delivery",
        items: [
          { label: "Vehicle No", value: formData.vehicleNo },
          { label: "Driver Name", value: formData.driverName },
          { label: "No Of Boxes", value: formData.noOfBoxes },
        ],
      },
      {
        key: "final",
        title: "Final Details",
        items: [
          { label: "Cash In No", value: formData.cashInNo },
          { label: "Way Bill No", value: formData.wayBillNo },
          { label: "Hand Over To", value: formData.handOverTo },
        ],
      },
    ];
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

  const statusColors = {
    1: "bg-blue-600",
    2: "bg-purple-600",
    3: "bg-indigo-600",
    4: "bg-teal-600",
    5: "bg-green-600",
    6: "bg-yellow-600",
    7: "bg-orange-600",
    8: "bg-red-600",
    9: "bg-pink-600",
  };

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
          const isSaved = savedSteps?.has?.(stepId);
          const dotColor = isSaved ? statusColors[stepId] : "bg-gray-300";
          return (
            <div key={section.key}>
              <button
                type="button"
                className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50"
                onClick={() => toggle(section.key)}
              >
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${dotColor}`} />
                  <span className="text-sm font-semibold text-gray-900">
                    {section.title}
                  </span>
                </div>
                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform ${
                    openSections[section.key] ? "rotate-180" : "rotate-0"
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

              {openSections[section.key] && (
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
