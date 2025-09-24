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
  const [errors, setErrors] = React.useState({});
  const isNewOrder = id === "new";

  const { formData, updateField, updateStepData, getStepData, resetForm } =
    useFormState();

  useEffect(() => {
    if (id === "new") {
      resetForm();
      setErrors({});
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

  const fetchOrderDetails = async (ornNumber) => {
    try {
      if (hasFetched.current) return;
      hasFetched.current = true;

      const response = await api.get(`/orders/${ornNumber}`);
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

        payment_type: "paymentType",
        approval_date: "approvalDate",
        approval_remark: "approvalRemark",

        sales_order_no: "salesOrderNumber",
        sales_order_date: "salesOrderDate",

        quotation_no: "quotationNumber",
        quotation_date: "quotationDate",

        payment_receipt: "paymentAttachment",

        invoice_no: "invoiceNumber",
        invoice_amount: "invoiceAmount",

        vehicle_no: "vehicleNo",
        driver_name: "driverName",
        no_of_boxes: "noOfBoxes",

        cash_in_number: "cashInNo",
        way_bill_no: "wayBillNo",
        handover_to: "handOverTo",
      };

      // Populate form data from database
      Object.entries(fieldMappings).forEach(([dbField, formField]) => {
        if (order[dbField] !== null && order[dbField] !== undefined) {
          let value = order[dbField];

          // Clean up payment_receipt path (remove escaped slashes)
          if (dbField === "payment_receipt" && typeof value === "string") {
            value = value.replace(/\\/g, "");
          }

          updateField(formField, value);
        }
      });
    } catch (error) {
      console.error("Error fetching order:", error);
      showErrorToast("Failed to fetch order");
      navigate("/orders");
    }
  };

  const handleSubmit = useCallback(
    async (completeOrder = false) => {
      let loadingToastId;
      try {
        loadingToastId = showLoadingToast("Saving step...");

        // Client-side validation per step
        const newErrors = {};
        const requireField = (key, message) => {
          if (!formData[key]) newErrors[key] = message;
        };

        switch (activeTab) {
          case 1:
            requireField("ordReqDate", "Order request date is required");
            requireField("ornNumber", "ORN number is required");
            requireField("customerName", "Customer name is required");
            requireField("customerGroup", "Customer group is required");
            break;
          case 2:
            requireField("salesBranch", "Sales branch is required");
            break;
          case 3:
            requireField("approvalDate", "Approval date is required");
            requireField("paymentType", "Payment type is required");
            break;
          default:
            break;
        }

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return;
        } else {
          setErrors({});
        }

        // Create FormData for file upload
        const formDataToSend = new FormData();

        // Prepare base data for API
        const baseData = {
          customer_name: formData.customerName,
          customer_group: formData.customerGroup,
          customer_branch: formData.customerBranch,
          customer_po_no: formData.customerPONo,
          po_amount: parseFloat(formData.poAmount || 0),
          orn_number: formData.ornNumber,
          order_request_date: formData.ordReqDate,
          remarks: formData.orderRemark,
          status: activeTab,
          currentStep: activeTab,
        };

        // Add step-specific data
        let stepData = {};
        switch (activeTab) {
          case 2: // Assign Branch
            stepData = {
              sales_branch: formData.salesBranch,
            };
            break;
          case 3: // Approval Info
            stepData = {
              payment_type: formData.paymentType,
              approval_date: formData.approvalDate,
              approval_remark: formData.approvalRemark,
            };
            break;
          case 4: // Sales Order Info
            stepData = {
              sales_order_no: formData.salesOrderNumber,
              sales_order_date: formData.salesOrderDate,
            };
            break;
          case 5: // Quotation Info
            stepData = {
              quotation_no: formData.quotationNumber,
              quotation_date: formData.quotationDate,
            };
            break;
          case 6: // Payment Info (File upload step)
            break;
          case 7: // Invoice Info
            stepData = {
              invoice_no: formData.invoiceNumber,
              invoice_amount: formData.invoiceAmount,
            };
            break;
          case 8: // Invoice Info
            stepData = {
              vehicle_no: formData.vehicleNo,
              driver_name: formData.driverName,
              no_of_boxes: formData.noOfBoxes,
            };
            break;
          case 9: // Cash In Info
            stepData = {
              cash_in_number: formData.cashInNo,
              way_bill_no: formData.wayBillNo,
              handover_to: formData.handOverTo,
            };
            break;
          default:
            // Include all fields for other steps
            stepData = {
              sales_branch: formData.salesBranch,

              payment_type: formData.paymentType,
              approval_date: formData.approvalDate,
              approval_remark: formData.approvalRemark,

              sales_order_no: formData.salesOrderNumber,
              sales_order_date: formData.salesOrderDate,

              quotation_no: formData.quotationNumber,
              quotation_date: formData.quotationDate,

              invoice_no: formData.invoiceNumber,
              invoice_amount: formData.invoiceAmount,

              vehicle_no: formData.vehicleNo,
              driver_name: formData.driverName,
              no_of_boxes: formData.noOfBoxes,

              cash_in_number: formData.cashInNo,
              way_bill_no: formData.wayBillNo,
              handover_to: formData.handOverTo,
            };
            break;
        }

        const orderData = { ...baseData, ...stepData };

        // Add all order data to FormData
        Object.keys(orderData).forEach((key) => {
          if (
            orderData[key] !== null &&
            orderData[key] !== undefined &&
            orderData[key] !== ""
          ) {
            formDataToSend.append(key, orderData[key]);
          }
        });

        // Add file if it exists and it's step 6 or later
        if (
          activeTab >= 6 &&
          formData.paymentAttachment &&
          formData.paymentAttachment instanceof File
        ) {
          formDataToSend.append("payment_receipt", formData.paymentAttachment);
        }

        // Set appropriate headers for FormData
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        if (isNewOrder && activeTab === 1) {
          const response = await api.post(
            "/orders/new",
            formDataToSend,
            config
          );
          if (response.data.success) {
            setSelectedOrder(response.data.order);
            setSavedSteps(new Set([1]));
            showSuccessToast("Order created successfully!", loadingToastId);

            setTimeout(() => {
              resetForm();
              navigate("/orders");
            }, 1000);
          }
        } else if (selectedOrder) {
          const response = await api.put(
            `/orders/${selectedOrder.orn_number}`,
            formDataToSend,
            config
          );

          if (response.data.success) {
            setSelectedOrder(response.data.order);
            setSavedSteps((prev) => new Set([...prev, activeTab]));
            showSuccessToast(
              `Step ${activeTab} saved successfully!`,
              loadingToastId
            );
            setTimeout(() => {
              resetForm();
              navigate("/orders");
            }, 1000);

            if (activeTab === 9 || completeOrder) {
              setTimeout(() => {
                resetForm();
                navigate("/orders");
              }, 1000);
            } else if (activeTab < 9) {
              setActiveTab(activeTab + 1);
            }
          }
        }
      } catch (error) {
        console.error("Error saving order:", error);
        // Map backend validation errors (422) to field errors
        if (error.response?.status === 422 && error.response?.data?.errors) {
          const backendErrors = error.response.data.errors;
          const normalized = {};
          Object.entries(backendErrors).forEach(([key, value]) => {
            normalized[key] = Array.isArray(value) ? value[0] : value;
          });
          setErrors(normalized);
        } else {
          showErrorToast(
            error.response?.data?.message || "Failed to save order",
            loadingToastId
          );
        }
      }
    },
    [activeTab, formData, isNewOrder, selectedOrder, navigate, resetForm]
  );

  const handleBackToList = useCallback(() => {
    navigate("/orders");
  }, [navigate]);

  const renderStepContent = () => {
    const stepProps = {
      formData,
      updateField,
      isNewOrder,
      errors,
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
