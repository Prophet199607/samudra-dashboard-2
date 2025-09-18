import React from "react";
import OrderSummary from "../common/OrderSummary";

const OrderForm = ({
  title,
  selectedOrder,
  savedSteps,
  activeTab,
  setActiveTab,
  renderStepContent,
  handleSubmit,
  handleBackToList,
  TAB_CONFIG,
  formData,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-1 sm:p-4">
      <div className="max-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-5 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {selectedOrder ? (
                  <>
                    Order:{" "}
                    <span className="text-2xl sm:text-2xl font-bold text-gray-700">
                      {selectedOrder.orn_number}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl sm:text-2xl font-bold text-gray-700">
                    {title}
                  </span>
                )}
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

        {/* Progress Steps */}
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

            {/* Step titles */}
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

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          {/* Step Header */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-start space-x-3">
              <span className="text-3xl">
                {TAB_CONFIG[activeTab - 1]?.icon}
              </span>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  Step {activeTab}: {TAB_CONFIG[activeTab - 1]?.title}
                </h2>
              </div>
            </div>
          </div>

          {activeTab > 1 && <OrderSummary formData={formData} />}

          <div className="mb-8">{renderStepContent()}</div>

          {/* Navigation and Submit */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 gap-4">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const prevTab = activeTab - 1;
                  if (prevTab >= 1) {
                    setActiveTab(prevTab);
                  }
                }}
                disabled={activeTab === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              >
                <span>←</span>
                <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={() => {
                  const nextTab = activeTab + 1;
                  if (nextTab <= 9) {
                    setActiveTab(nextTab);
                  }
                }}
                disabled={activeTab === 9 || !savedSteps.has(activeTab)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
              >
                <span className="hidden sm:inline">Next</span>
                <span>→</span>
              </button>
            </div>

            <div className="flex space-x-2">
              {/* Only show Save button for current step, not previous steps */}
              {!savedSteps.has(activeTab) && (
                <button
                  onClick={() => {
                    handleSubmit();
                  }}
                  className="px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 bg-blue-700 text-white shadow-md hover:shadow-lg"
                >
                  <span>Save Step {activeTab}</span>
                </button>
              )}

              {activeTab === 9 && savedSteps.has(9) && (
                <button
                  onClick={() => {
                    handleSubmit(true);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-md hover:shadow-lg"
                >
                  <span>🎉</span>
                  <span>Complete Order</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Summary */}
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

export default OrderForm;
