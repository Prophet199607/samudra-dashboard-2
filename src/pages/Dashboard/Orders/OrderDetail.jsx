import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormState } from "../../../hooks/useFormState";
import { useFormValidation } from "../../../hooks/useFormValidation";
import { TAB_CONFIG } from "../../../constants/dropdownOptions";
import { mockOrders } from "../../../services/mockData";

// Import all step components
import Step1CreateOrder from "../../../components/steps/CreateOrder";
import Step2AssignBranch from "../../../components/steps/AssignBranch";
import Step3ApproveOrder from "../../../components/steps/ApproveOrder";
import Step4AddSalesOrder from "../../../components/steps/AddSalesOrder";
import Step5AddQuotation from "../../../components/steps/AddQuotation";
import Step6CashPayment from "../../../components/steps/CashPayment";
import Step7AddInvoice from "../../../components/steps/AddInvoice";
import Step8DeliveryDetails from "../../../components/steps/DeliveryDetails";
import Step9FinalDetails from "../../../components/steps/FinalDetails";

// Import the new flow components
import NewOrder from "../../../components/orders/NewOrder";
import ViewOrder from "./../../../components/orders/ViewOrder";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(1);
  const [formData, updateField, resetForm] = useFormState();
  const [savedSteps, setSavedSteps] = useState(new Set());
  const validation = useFormValidation(formData, activeTab);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isNewOrder, setIsNewOrder] = useState(id === "new");

  useEffect(() => {
    if (id && id !== "new") {
      const order = mockOrders.find((order) => order.id === id);
      if (order) {
        setSelectedOrder(order);
        setActiveTab(order.status);
        setSavedSteps(
          new Set(Array.from({ length: order.status }, (_, i) => i + 1))
        );
      } else {
        navigate("/orders");
      }
    } else if (id === "new") {
      setIsNewOrder(true);
      setSelectedOrder(null);
      setSavedSteps(new Set());
      resetForm();
    }
  }, [id, navigate, resetForm]);

  const handleBackToList = () => {
    navigate("/orders");
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
    const stepProps = { formData, updateField, isNewOrder };

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

  if (isNewOrder && !selectedOrder) {
    return (
      <NewOrder
        savedSteps={savedSteps}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        renderStepContent={renderStepContent}
        handleSubmit={handleSubmit}
        validation={validation}
        TAB_CONFIG={TAB_CONFIG}
        handleBackToList={handleBackToList}
      />
    );
  }

  return (
    <ViewOrder
      selectedOrder={selectedOrder}
      savedSteps={savedSteps}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      renderStepContent={renderStepContent}
      handleSubmit={handleSubmit}
      validation={validation}
      handleBackToList={handleBackToList}
      TAB_CONFIG={TAB_CONFIG}
    />
  );
};

export default OrderDetail;
