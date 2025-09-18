import React, { useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useFormState } from "../../../hooks/useFormState";
import { TAB_CONFIG } from "../../../constants/dropdownOptions";
import OrderForm from "../../../components/orders/OrderForm";
import api from "../../../services/api";
import {
  showErrorToast,
  showSuccessToast,
  showLoadingToast,
} from "../../../components/alert/ToastAlert";

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
  const [searchParams] = useSearchParams();
  const hasFetched = useRef(false);
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
          showErrorToast("Failed to generate ORN");
        }
      };
      generateOrn();
    } else {
      fetchOrderDetails(id);
    }
  }, [id, resetForm, updateField]);

  useEffect(() => {
    // Handle URL status parameter
    const statusParam = searchParams.get("status");
    if (statusParam && !isNewOrder && selectedOrder) {
      const targetStatus = parseInt(statusParam);
      if (
        targetStatus >= 1 &&
        targetStatus <= 9 &&
        savedSteps.has(targetStatus - 1)
      ) {
        setActiveTab(targetStatus);
      }
    }
  }, [searchParams, selectedOrder, savedSteps, isNewOrder]);

  const fetchOrderDetails = async (orderId) => {
    try {
      if (hasFetched.current) return;
      hasFetched.current = true;

      const response = await api.get(`/orders/${orderId}`);
      const order = response.data.order;
      setSelectedOrder(order);

      // Set initial active tab based on order status
      const initialTab = order.status < 9 ? order.status + 1 : order.status;
      setActiveTab(initialTab);

      setSavedSteps(
        new Set(Array.from({ length: order.status }, (_, i) => i + 1))
      );

      // Map database fields to form fields
      const fieldMappings = {
        customer_name: "customerName",
        customer_group: "customerGroup",
        customer_branch: "customerBranch",
        customer_po_no: "customerPONo",
        po_amount: "poAmount",
        orn_number: "ornNumber",
        order_request_date: "ordReqDate",
        remarks: "orderRemark",
        sales_branch: "salesBranch",
        branch_remark: "branchRemark",
        approved_date: "approvedDate",
        approve_remark: "approveRemark",
        payment_type: "paymentType",
        approved_by: "approvedBy",
        sales_order_number: "salesOrderNumber",
        sales_order_date: "salesOrderDate",
        sales_person: "salesPerson",
        quotation_number: "quotationNumber",
        quotation_date: "quotationDate",
        quotation_amount: "quotationAmount",
        payment_date: "paymentDate",
        cash_cheque_no: "cashChequeNo",
        cash_cheque_amount: "cashChequeAmount",
        invoice_number: "invoiceNumber",
        invoice_amount: "invoiceAmount",
        invoice_date: "invoiceDate",
        vehicle_no: "vehicleNo",
        driver: "driver",
        no_of_boxes: "noOfBoxes",
        delivery_date: "deliveryDate",
        cash_in_no: "cashInNo",
        way_bill_no: "wayBillNo",
        hand_over_to: "handOverTo",
        completion_remark: "completionRemark",
      };

      // Populate form data from database
      Object.entries(fieldMappings).forEach(([dbField, formField]) => {
        if (order[dbField] !== null && order[dbField] !== undefined) {
          updateField(formField, order[dbField]);
        }
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      showErrorToast("Failed to fetch order");
      navigate("/orders");
    }
  };

  const handleSubmit = useCallback(async () => {
    let loadingToastId;
    try {
      loadingToastId = showLoadingToast("Saving step...");

      // Prepare data for API
      const orderData = {
        customer_name: formData.customerName,
        customer_group: formData.customerGroup,
        customer_branch: formData.customerBranch,
        customer_po_no: formData.customerPONo,
        po_amount: parseFloat(formData.poAmount || 0),
        orn_number: formData.ornNumber,
        order_request_date: formData.ordReqDate,
        remarks: formData.orderRemark,
        status: activeTab,
      };

      if (isNewOrder && activeTab === 1) {
        const response = await api.post("/orders/new", orderData);
        if (response.data.success) {
          setSelectedOrder(response.data.order);
          setSavedSteps(new Set([1]));
          showSuccessToast("Order created successfully!", loadingToastId);

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
          showSuccessToast(
            `Step ${activeTab} saved successfully!`,
            loadingToastId
          );

          if (activeTab < 9) {
            setActiveTab(activeTab + 1);
          }
        }
      }
    } catch (error) {
      console.error("Error saving order:", error);
      showErrorToast(
        error.response?.data?.message || "Failed to save order",
        loadingToastId
      );
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
      title={
        isNewOrder ? "New Order" : `Order Details: ${selectedOrder?.orn_number}`
      }
      selectedOrder={selectedOrder}
      savedSteps={savedSteps}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      renderStepContent={renderStepContent}
      handleSubmit={handleSubmit}
      handleBackToList={handleBackToList}
      TAB_CONFIG={TAB_CONFIG}
      formData={formData}
    />
  );
};

export default OrderDetail;
