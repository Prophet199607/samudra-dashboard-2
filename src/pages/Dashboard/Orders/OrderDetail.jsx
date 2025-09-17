import React, { useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useFormState } from "../../../hooks/useFormState";
import { TAB_CONFIG } from "../../../constants/dropdownOptions";
import OrderForm from "../../../components/orders/OrderForm";
import api from "../../../services/api";

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

const OrderDetail = () => {
  const { id } = useParams();
  const hasFetched = useRef(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState(1);
  const [savedSteps, setSavedSteps] = React.useState(new Set());
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const isNewOrder = id === "new";

  const { formData, updateField, updateStepData, getStepData, resetForm } =
    useFormState();

  useEffect(() => {
    if (id === "new") {
      resetForm();
      setSavedSteps(new Set());
      setActiveTab(1);

      if (hasFetched.current) return;
      hasFetched.current = true;

      // Generate ORN number for new order
      const generateOrn = async () => {
        try {
          const response = await api.get("/orders/generate-orn");
          if (response.data.success) {
            updateField("ornNumber", response.data.orn_number);
          }
        } catch (error) {
          console.error("Error generating ORN:", error);
        }
      };
      generateOrn();
    } else {
      fetchOrderDetails(id);
    }
  }, [id, resetForm, updateField]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      const order = response.data.order;
      setSelectedOrder(order);
      setActiveTab(order.status);
      setSavedSteps(
        new Set(Array.from({ length: order.status }, (_, i) => i + 1))
      );

      // Populate form data
      Object.keys(order).forEach((key) => {
        if (order[key] !== null && order[key] !== undefined) {
          updateField(key, order[key]);
        }
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      navigate("/orders");
    }
  };

  const handleSubmit = useCallback(async () => {
    try {
      // Prepare data for API
      const orderData = {
        customer_name: formData.customerName,
        customer_group: formData.customerGroup,
        customer_branch: formData.customerBranch,
        customer_po_no: formData.customerPONo,
        po_amount: parseFloat(formData.poAmount || 0),
        orn_number: formData.ornNumber,
        order_request_date: formData.order_request_date || formData.ordReqDate,
        remarks: formData.orderRemark || formData.remarks,
        status: activeTab,
      };

      if (isNewOrder && activeTab === 1) {
        const response = await api.post("/orders/new", orderData);
        if (response.data.success) {
          setSelectedOrder(response.data.order);
          setSavedSteps(new Set([1]));
          alert("Order created successfully!");
          navigate(`/order/${response.data.order.id}`, { replace: true });
        }
      } else if (selectedOrder) {
        const response = await api.put(`/orders/${selectedOrder.id}`, {
          ...orderData,
          currentStep: activeTab,
        });

        if (response.data.success) {
          setSelectedOrder(response.data.order);
          setSavedSteps((prev) => new Set([...prev, activeTab]));
          alert(`Step ${activeTab} saved successfully!`);

          if (activeTab < 9) {
            setActiveTab(activeTab + 1);
          }
        }
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert(error.response?.data?.message || "Failed to save order");
    }
  }, [activeTab, formData, isNewOrder, selectedOrder, navigate]);

  const handleBackToList = useCallback(() => {
    navigate("/orders");
  }, [navigate]);

  const renderStepContent = () => {
    const stepProps = {
      formData,
      updateField,
      isNewOrder,
    };

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
        return null;
    }
  };

  return (
    <OrderForm
      title={isNewOrder ? "New Order" : `Order ${selectedOrder?.id}`}
      selectedOrder={selectedOrder}
      savedSteps={savedSteps}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      renderStepContent={renderStepContent}
      handleSubmit={handleSubmit}
      handleBackToList={handleBackToList}
      TAB_CONFIG={TAB_CONFIG}
    />
  );
};

export default OrderDetail;
