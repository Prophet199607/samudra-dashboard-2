import React from "react";
import OrderSummary from "../common/OrderSummary";
import ConfirmationModal from "../common/model/ConfirmationModal";

const OrderForm = ({
  title,
  selectedOrder,
  disabledSteps,
  savedSteps,
  activeTab,
  setActiveTab,
  renderStepContent,
  handleSubmit,
  handleBackToList,
  TAB_CONFIG,
  formData,
  isDelayModalOpen,
  setDelayModalOpen,
  handleDelaySave,
  handlePaymentAction,
  showRejectModal,
  setShowRejectModal,
  handleConfirmReject,
}) => {
  const isStep10Valid = () => {
    if (activeTab !== 10) return true;
    const {
      deliveryType,
      busNo,
      wayBillNo,
      trackingNo,
      courierName,
      vehicleNo,
      driverName,
      noOfBoxes,
    } = formData;

    if (!deliveryType) return false;

    if (noOfBoxes && String(noOfBoxes).trim()) return true;

    switch (deliveryType) {
      case "Bus":
        return !!(busNo && String(busNo).trim());
      case "Train":
        return !!(wayBillNo && String(wayBillNo).trim());
      case "Courier":
        return !!(
          (trackingNo && String(trackingNo).trim()) ||
          (courierName && String(courierName).trim())
        );
      case "Own Vehicle":
        return !!(
          (vehicleNo && String(vehicleNo).trim()) ||
          (driverName && String(driverName).trim())
        );
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-2 sm:p-4">
      <div className="max-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 mb-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {selectedOrder ? (
                  <>
                    Order:{" "}
                    <span className="text-xl sm:text-2xl font-bold text-gray-700">
                      {selectedOrder.orn_number}
                    </span>
                  </>
                ) : (
                  <span className="text-xl sm:text-2xl font-bold text-gray-700">
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
          <div className="border-t border-gray-200 p-2">
            <nav className="flex items-center justify-start sm:justify-center overflow-x-auto scrollbar-hide pb-2">
              {TAB_CONFIG.map((tab, index) => {
                const isCompleted = savedSteps.has(tab.id);
                const isActive = activeTab === tab.id;
                const isDisabled = disabledSteps.has(tab.id);
                const canNavigate =
                  // !isDisabled &&
                  // (savedSteps.has(tab.id - 1) ||
                  //   tab.id === 1 ||
                  //   (tab.id === 3 && [4, 5, 6].includes(activeTab)));
                  !isDisabled && (tab.id === 1 || savedSteps.has(tab.id - 1));

                let stepColorClass = tab.color;
                if (tab.id === 10) {
                  if (selectedOrder?.is_delayed === 1) {
                    stepColorClass = "bg-red-600";
                  } else if (isCompleted) {
                    stepColorClass = "bg-green-600";
                  } else {
                    stepColorClass = "bg-gray-500";
                  }
                }
                return (
                  <div key={tab.id} className="flex items-center mt-2">
                    {index > 0 && (
                      <div
                        className={`h-0.5 w-6 sm:w-12 transition-colors duration-200 ${
                          isDisabled
                            ? "bg-gray-100"
                            : isCompleted
                            ? stepColorClass
                            : "bg-gray-300"
                        }`}
                      ></div>
                    )}

                    <button
                      onClick={() => canNavigate && setActiveTab(tab.id)}
                      disabled={!canNavigate || isDisabled}
                      className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                        isDisabled
                          ? "bg-gray-100 text-gray-300 border-2 border-gray-200 cursor-not-allowed"
                          : isActive
                          ? `${stepColorClass} text-white border-2 border-gray-700 shadow-lg outline-2 outline-offset-3 outline-black`
                          : isCompleted
                          ? `${stepColorClass} text-white border-2 border-gray-600 shadow-md`
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

            <div className="flex items-center justify-start sm:justify-center overflow-x-auto scrollbar-hide mt-2">
              {TAB_CONFIG.map((tab, index) => {
                const isCompleted = savedSteps.has(tab.id);
                const isDisabled = disabledSteps.has(tab.id);
                const isActive = activeTab === tab.id;
                return (
                  <div key={tab.id} className="flex items-center">
                    {index > 0 && (
                      <div className="h-0.5 w-6 sm:w-12 opacity-0"></div>
                    )}
                    <div
                      className={`text-xs font-medium text-center flex-shrink-0 w-12 ${
                        isDisabled
                          ? "text-gray-300"
                          : isActive
                          ? "text-gray-900 font-bold"
                          : isCompleted
                          ? "text-gray-700"
                          : "text-gray-500"
                      }`}
                    >
                      {tab.title}
                    </div>
                  </div>
                );
              })}
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

          {activeTab > 1 && (
            <OrderSummary
              formData={formData}
              selectedOrder={selectedOrder}
              currentStep={activeTab}
              savedSteps={savedSteps}
            />
          )}

          <div className="mb-8">
            {renderStepContent({
              isDelayModalOpen,
              setDelayModalOpen,
              handleDelaySave,
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 gap-4">
            <div className="flex-grow flex justify-start">
              {/* {activeTab === 10 && !savedSteps.has(10) && ( */}
              {activeTab === 10 &&
                !disabledSteps.has(10) &&
                savedSteps.has(9) &&
                !savedSteps.has(10) && (
                  <button
                    onClick={() => setDelayModalOpen(true)}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg
                    ${
                      selectedOrder?.is_delayed === 1
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }
                  `}
                  >
                    <span>
                      {selectedOrder?.is_delayed === 1
                        ? "Delivery Delayed"
                        : "Delivery Delay"}
                    </span>
                  </button>
                )}
            </div>

            <div className="flex space-x-2 w-full sm:w-auto justify-center">
              {activeTab >= 1 &&
                activeTab <= 9 &&
                !disabledSteps.has(activeTab) &&
                (activeTab === 1 || savedSteps.has(activeTab - 1)) &&
                !savedSteps.has(activeTab) &&
                !(activeTab === 4 || activeTab === 5) &&
                activeTab !== 7 && (
                  <button
                    onClick={() => handleSubmit()}
                    className="px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 bg-blue-700 text-white shadow-md hover:shadow-lg"
                  >
                    <span>Save Step {activeTab}</span>
                  </button>
                )}

              {activeTab === 10 &&
                !disabledSteps.has(10) &&
                savedSteps.has(9) &&
                !savedSteps.has(10) && (
                  <button
                    onClick={() => handleSubmit(true)}
                    disabled={!isStep10Valid()}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 shadow-md hover:shadow-lg
                    ${
                      !isStep10Valid()
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }
                  `}
                  >
                    <span>🎉</span>
                    <span>Complete Order</span>
                  </button>
                )}
            </div>
            {activeTab === 7 &&
              !disabledSteps.has(7) &&
              savedSteps.has(6) &&
              !savedSteps.has(7) && (
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handlePaymentAction(true)}
                    className="bg-green-600 text-white px-3 py-2 text-sm rounded-md hover:bg-green-700 transition-colors font-medium shadow-sm"
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePaymentAction(false)}
                    className="bg-red-600 text-white px-3 py-2 text-sm rounded-md hover:bg-red-700 transition-colors font-medium shadow-sm"
                  >
                    Reject
                  </button>
                </div>
              )}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
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
                  Remaining: {10 - Math.max(savedSteps.size, activeTab)}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      {showRejectModal && (
        <ConfirmationModal
          title="Reject Payment"
          message="Are you sure you want to reject this payment? This will revert the order status and remove the payment receipt."
          onConfirm={handleConfirmReject}
          onCancel={() => setShowRejectModal(false)}
        />
      )}
    </div>
  );
};

export default OrderForm;
