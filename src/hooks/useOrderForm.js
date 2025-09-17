import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormState } from "./useFormState";
import { useFormValidation } from "./useFormValidation";
import api from "../services/api";

export const useOrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(1);
  const [isNewOrder, setIsNewOrder] = useState(true);
  const [formData, updateField, resetForm] = useFormState();
  const [savedSteps, setSavedSteps] = useState(new Set());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const validation = useFormValidation(formData, activeTab);

  const initializeOrder = useCallback(
    async (id) => {
      if (id === "new") {
        setIsNewOrder(true);
        setSelectedOrder(null);
        setSavedSteps(new Set());
        resetForm();

        if (location.state?.ornNumber) {
          updateField("ornNumber", location.state.ornNumber);
        }
      } else if (id) {
        try {
          const response = await api.get(`/orders/${id}`);
          const order = response.data.order;
          setSelectedOrder(order);
          setActiveTab(order.status);
          setSavedSteps(
            new Set(Array.from({ length: order.status }, (_, i) => i + 1))
          );
          setIsNewOrder(false);

          // Populate form data with order details
          Object.keys(order).forEach((key) => {
            if (order[key] !== null && order[key] !== undefined) {
              updateField(key, order[key]);
            }
          });
        } catch (error) {
          console.error("Error fetching order:", error);
          navigate("/orders");
        }
      }
    },
    [navigate, resetForm, updateField, location.state]
  );

  const handleSubmit = useCallback(async () => {
    if (!validation.isValid) {
      alert(`Required fields missing: ${validation.missingFields.join(", ")}`);
      return;
    }

    try {
      const stepData = getStepData(activeTab);

      if (isNewOrder && activeTab === 1) {
        const response = await api.post("/orders", stepData);
        if (response.data.success) {
          setSelectedOrder(response.data.order);
          setSavedSteps(new Set([1]));
          setIsNewOrder(false);
          navigate(`/order/${response.data.order.id}`, { replace: true });
        }
      } else {
        const response = await api.put(`/orders/${selectedOrder.id}`, {
          ...stepData,
          currentStep: activeTab,
        });

        if (response.data.success) {
          setSelectedOrder(response.data.order);
          // Add current step to saved steps
          setSavedSteps((prev) => new Set([...prev, activeTab]));

          // If current step is completed and next step is available, move to it
          if (activeTab < 9) {
            setActiveTab(activeTab + 1);
          } else if (activeTab === 9) {
            // Final step completed
            alert("Order process completed successfully!");
          }
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save order");
    }
  }, [
    activeTab,
    validation,
    isNewOrder,
    selectedOrder,
    getStepData,
    navigate,
    setActiveTab,
    setSavedSteps,
  ]);

  const handleBackToList = useCallback(() => {
    navigate("/orders");
  }, [navigate]);

  return {
    formState: {
      formData,
      updateField,
      savedSteps,
      activeTab,
      selectedOrder,
      validation,
      isNewOrder,
    },
    handlers: {
      handleSubmit,
      setActiveTab,
      handleBackToList,
    },
    initializeOrder,
  };
};
