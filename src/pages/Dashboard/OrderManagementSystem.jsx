import React, { useState, useCallback } from "react";
import { useFormState } from "../../hooks/useFormState";
import { useFormValidation } from "../../hooks/useFormValidation";
import { TAB_CONFIG } from "../../constants/dropdownOptions";
import DataTable from "../../components/common/DataTable";
import { mockOrders } from "../../services/mockData";

// Import all step components
import Step1CreateOrder from "../../components/steps/CreateOrder";
import Step2AssignBranch from "../../components/steps/AssignBranch";
import Step3ApproveOrder from "../../components/steps/ApproveOrder";
import Step4AddSalesOrder from "../../components/steps/AddSalesOrder";
import Step5AddQuotation from "../../components/steps/AddQuotation";
import Step6CashPayment from "../../components/steps/CashPayment";
import Step7AddInvoice from "../../components/steps/AddInvoice";
import Step8DeliveryDetails from "../../components/steps/DeliveryDetails";
import Step9FinalDetails from "../../components/steps/FinalDetails";

const OrderManagementSystem = () => {
  const [showOrdersList, setShowOrdersList] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [formData, updateField, resetForm] = useFormState();
  const [savedSteps, setSavedSteps] = useState(new Set());
  const validation = useFormValidation(formData, activeTab);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const tableColumns = [
    { key: "id", label: "Order ID" },
    { key: "customerName", label: "Customer Name" },
    {
      key: "date",
      label: "Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
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

        // Get the tab title from TAB_CONFIG
        const tabTitle =
          TAB_CONFIG.find((tab) => tab.id === value)?.title || `Step ${value}`;

        return (
          <div className="flex items-center">
            <div
              className={`h-2.5 w-2.5 rounded-full mr-2 ${
                statusColors[value] || "bg-gray-500"
              }`}
            ></div>
            <span>{tabTitle}</span>
          </div>
        );
      },
    },
    {
      key: "totalAmount",
      label: "Amount",
      render: (value) => `LKR ${parseFloat(value).toFixed(2)}`,
    },
  ];

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setActiveTab(order.status);
    setSavedSteps(
      new Set(Array.from({ length: order.status }, (_, i) => i + 1))
    );
    setShowOrdersList(false);
  };

  const handleBackToList = () => {
    setShowOrdersList(true);
    setSelectedOrder(null);
    setSavedSteps(new Set());
    resetForm();
  };

  const handleTabClick = (tabId) => {
    const maxCompletedStep = Math.max(...Array.from(savedSteps), 0);
    const canNavigate = savedSteps.has(tabId) || tabId === maxCompletedStep + 1;

    if (canNavigate) {
      setActiveTab(tabId);
      if (savedSteps.has(tabId)) {
        setSavedSteps((prev) => new Set([...prev, tabId]));
      }
    }
  };

  const handleSubmit = useCallback(() => {
    if (!validation.isValid) {
      alert(
        `Please fill in the following required fields: ${validation.missingFields.join(
          ", "
        )}`
      );
      return;
    }

    setSavedSteps((prev) => new Set([...prev, activeTab]));
    console.log(`Step ${activeTab} Data:`, formData);
    alert(`Step ${activeTab} saved successfully!`);

    if (activeTab < 9) {
      setActiveTab(activeTab + 1);
      setSavedSteps((prev) => new Set([...prev, activeTab + 1]));
    }
  }, [formData, activeTab, validation]);

  const renderStepContent = () => {
    const stepProps = { formData, updateField, isNewOrder: !selectedOrder };

    switch (activeTab) {
      case 1:
        return <Step1CreateOrder {...stepProps} />;
      case 2:
        return <Step2AssignBranch {...stepProps} />;
      case 3:
        return <Step3ApproveOrder {...stepProps} />;
      case 4:
        return <Step4AddSalesOrder {...stepProps} />;
      case 5:
        return <Step5AddQuotation {...stepProps} />;
      case 6:
        return <Step6CashPayment {...stepProps} />;
      case 7:
        return <Step7AddInvoice {...stepProps} />;
      case 8:
        return <Step8DeliveryDetails {...stepProps} />;
      case 9:
        return <Step9FinalDetails {...stepProps} />;
      default:
        return <Step1CreateOrder {...stepProps} />;
    }
  };

  if (showOrdersList) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 w-full">
        <div className="w-full mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-5 mb-5 border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3x2 font-bold text-gray-900 mb-2">
                  Order Management
                </h1>
              </div>
              <button
                onClick={() => {
                  setShowOrdersList(false);
                  setSelectedOrder(null);
                  setSavedSteps(new Set());
                  setActiveTab(1);
                  resetForm();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                + Create New Order
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
            <DataTable
              data={mockOrders}
              columns={tableColumns}
              onRowClick={handleOrderClick}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-1 sm:p-4">
      <div className="max-full mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-5 mb-5 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3x2 font-bold text-gray-900 mb-2">
                {selectedOrder ? `Order ${selectedOrder.id}` : "New Order"}
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBackToList}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                ← Back to Orders
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-100">
          <div className="border-b border-gray-200 p-4">
            <nav className="flex items-center justify-center scrollbar-hide">
              {TAB_CONFIG.map((tab, index) => {
                const isCompleted = savedSteps.has(tab.id);
                const isActive = activeTab === tab.id;
                const canNavigate = savedSteps.has(tab.id - 1) || tab.id === 1;

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
                  <div key={tab.id} className="flex items-center">
                    {/* Connection line between circles */}
                    {index > 0 && (
                      <div
                        className={`h-0.5 w-16 ${
                          isCompleted ? statusColors[tab.id] : "bg-gray-300"
                        }`}
                      ></div>
                    )}

                    <button
                      onClick={() => canNavigate && setActiveTab(tab.id)}
                      disabled={!canNavigate}
                      className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                        isActive
                          ? `${
                              statusColors[tab.id]
                            } text-white border-2 border-gray-700 shadow-lg outline-2 outline-offset-3 outline-black`
                          : isCompleted
                          ? `${
                              statusColors[tab.id]
                            } text-white border-2 border-gray-600 shadow-md`
                          : canNavigate
                          ? "bg-gray-300 text-gray-600 border-2 border-gray-400 hover:bg-gray-400"
                          : "bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed"
                      }`}
                    >
                      <span className="text-sm font-bold">{tab.id}</span>
                    </button>
                  </div>
                );
              })}
            </nav>

            {/* Tab titles below circles */}
            <div className="flex justify-center mt-3 space-x-8">
              {TAB_CONFIG.map((tab) => (
                <div
                  key={tab.id}
                  className="text-xs font-medium text-gray-700 text-center"
                  style={{ minWidth: "80px" }}
                >
                  {tab.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <div className="mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-start space-x-3">
              <span className="text-3xl">
                {TAB_CONFIG[activeTab - 1]?.icon}
              </span>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  Step {activeTab}: {TAB_CONFIG[activeTab - 1]?.title}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {TAB_CONFIG[activeTab - 1]?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">{renderStepContent()}</div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 gap-4">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const prevTab = activeTab - 1;
                  if (prevTab >= 1 && savedSteps.has(prevTab)) {
                    setActiveTab(prevTab);
                  }
                }}
                disabled={activeTab === 1 || !savedSteps.has(activeTab - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              >
                <span>←</span>
                <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={() => {
                  const nextTab = activeTab + 1;
                  if (
                    savedSteps.has(activeTab) &&
                    nextTab <= 9 &&
                    !savedSteps.has(nextTab)
                  ) {
                    setActiveTab(nextTab);
                  } else if (savedSteps.has(nextTab)) {
                    setActiveTab(nextTab);
                  }
                }}
                disabled={
                  activeTab === 9 ||
                  (!savedSteps.has(activeTab) && !savedSteps.has(activeTab + 1))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              >
                <span className="hidden sm:inline">Next</span>
                <span>→</span>
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSubmit}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  validation.isValid
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!validation.isValid}
              >
                <span>
                  {savedSteps.has(activeTab) ? "Update" : "Save"} Step{" "}
                  {activeTab}
                </span>
              </button>

              {activeTab === 9 && savedSteps.size === 9 && (
                <button
                  onClick={() => alert("Order completed successfully!")}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <span>🎉</span>
                  <span>Complete Order</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Completed: {savedSteps.size}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>Current: Step {activeTab}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                <span>
                  Remaining: {9 - Math.max(savedSteps.size, activeTab)}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagementSystem;
