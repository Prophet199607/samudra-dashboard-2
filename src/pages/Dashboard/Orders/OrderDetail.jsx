import api from "../../../services/api";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { TAB_CONFIG } from "../../../constants/tabConfig";
import { useFormState } from "../../../hooks/useFormState";
import OrderForm from "../../../components/orders/OrderForm";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  showErrorToast,
  showSuccessToast,
  showLoadingToast,
} from "../../../components/alert/ToastAlert";

import Step1CreateOrder from "../../../components/steps/CreateOrder";
import Step2AssignBranch from "../../../components/steps/AssignBranch";
import Step3ApproveOrder from "../../../components/steps/ApproveOrder";
import Step4AddSalesOrder from "../../../components/steps/AddSalesOrder";
import Step5AddQuotation from "../../../components/steps/AddQuotation";
import Step6CashPayment from "../../../components/steps/CashPayment";
import Step7PaymentConfirm from "../../../components/steps/PaymentConfirm";
import Step8AddInvoice from "../../../components/steps/AddInvoice";
import Step9DeliveryDetails from "../../../components/steps/DeliveryDetails";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewOrder = id === "new";
  const hasFetched = useRef(false);
  const [searchParams] = useSearchParams();
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState(1);
  const [isDelayed, setIsDelayed] = useState(false);
  const [savedSteps, setSavedSteps] = useState(new Set());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { formData, updateField, resetForm } = useFormState();
  const [isDelayModalOpen, setDelayModalOpen] = useState(false);
  const [disabledSteps, setDisabledSteps] = useState(new Set());

  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam && !isNewOrder && selectedOrder) {
      const targetStatus = parseInt(statusParam);

      if (
        targetStatus >= 1 &&
        targetStatus <= 9 &&
        !disabledSteps.has(targetStatus) &&
        (targetStatus === 1 || savedSteps.has(targetStatus - 1))
      ) {
        setActiveTab(targetStatus);
      } else {
        let adjustedStatus = targetStatus;
        while (adjustedStatus <= 9 && disabledSteps.has(adjustedStatus)) {
          adjustedStatus++;
        }
        if (adjustedStatus <= 9) {
          setActiveTab(adjustedStatus);

          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("status", adjustedStatus.toString());
          navigate(`?${newSearchParams.toString()}`, { replace: true });
        }
      }
    }
  }, [
    searchParams,
    selectedOrder,
    savedSteps,
    isNewOrder,
    disabledSteps,
    navigate,
  ]);

  useEffect(() => {
    const fetchOrderDetails = async (ornNumber) => {
      try {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const response = await api.get(`/orders/${ornNumber}`);
        const order = response.data.order;
        setSelectedOrder(order);

        let initialTab = order.status < 9 ? order.status + 1 : order.status;

        const isCashBased =
          order.payment_type &&
          ["Cash", "Cash Deposit"].includes(order.payment_type);
        if (!isCashBased) {
          setDisabledSteps(new Set([6, 7]));

          if (initialTab === 6 || initialTab === 7) {
            initialTab = 8;
          }
        } else {
          setDisabledSteps(new Set());
        }

        setActiveTab(initialTab);

        setSavedSteps(
          new Set(Array.from({ length: order.status }, (_, i) => i + 1))
        );

        const fieldMappings = {
          customer_name: "customerName",
          customer_group: "customerGroup",
          customer_branch: "customerBranch",
          customer_po_no: "customerPONo",
          po_amount: "poAmount",
          orn_number: "ornNumber",
          order_request_date: "ordReqDate",
          remark: "orderRemark",

          sales_branch: "salesBranch",

          payment_type: "paymentType",
          approval_date: "approvalDate",
          approval_remark: "approvalRemark",

          sales_order_no: "salesOrderNumber",
          sales_order_date: "salesOrderDate",

          quotation_no: "quotationNumber",
          quotation_date: "quotationDate",

          payment_receipt: "paymentAttachment",
          payment_confirmed: "paymentConfirmed",
          payment_remark: "paymentRemark",

          invoice_no: "invoiceNumber",
          invoice_amount: "invoiceAmount",

          delivery_type: "deliveryType",
          is_delayed: "isDelayed",
          delay_reason: "delayReason",
          bus_no: "busNo",
          way_bill_no: "wayBillNo",
          tracking_no: "trackingNo",
          vehicle_no: "vehicleNo",
          driver_name: "driverName",
          courier_name: "courierName",
          no_of_boxes: "noOfBoxes",
        };

        Object.entries(fieldMappings).forEach(([dbField, formField]) => {
          if (order[dbField] !== null && order[dbField] !== undefined) {
            let value = order[dbField];

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

    if (id === "new") {
      resetForm();
      setErrors({});
      setSavedSteps(new Set());
      setActiveTab(1);

      if (hasFetched.current) return;
      hasFetched.current = true;

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
  }, [id, resetForm, updateField, navigate]);

  const handleDelaySave = async (reason) => {
    if (!selectedOrder?.orn_number) {
      showErrorToast("Order number is not available.");
      return;
    }
    try {
      const response = await api.put(
        `/orders/${selectedOrder.orn_number}/delay`,
        { delay_reason: reason }
      );
      if (response.data.success) {
        showSuccessToast("Delivery delay reason saved!");
        setIsDelayed(true);
        updateField("delayReason", reason);
        setDelayModalOpen(false);
      }
      setTimeout(() => {
        resetForm();
        navigate("/orders");
      }, 1000);
    } catch (error) {
      showErrorToast("Failed to save delay reason.");
      console.error("Error saving delay reason:", error);
    }
  };

  const handleSubmit = useCallback(
    async (completeOrder = false) => {
      let loadingToastId;
      try {
        loadingToastId = showLoadingToast("Saving step...");

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
            requireField("customerBranch", "Customer's branch is required");
            break;
          case 2:
            requireField("salesBranch", "Sales branch is required");
            break;
          case 3:
            requireField("approvalDate", "Approval date is required");
            requireField("paymentType", "Payment type is required");
            break;
          case 6:
            requireField("paymentAttachment", "Payment receipt is required");
            break;
          case 9:
            requireField("deliveryType", "Delivery type is required");
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

        const formDataToSend = new FormData();

        const baseData = {
          customer_name: formData.customerName,
          customer_group: formData.customerGroup,
          customer_branch: formData.customerBranch,
          customer_po_no: formData.customerPONo,
          po_amount: parseFloat(formData.poAmount || 0),
          orn_number: formData.ornNumber,
          order_request_date: formData.ordReqDate,
          remark: formData.orderRemark,
          status: activeTab,
          currentStep: activeTab,
        };

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
          case 7: // Payment Confirmation
            stepData = {
              payment_confirmed: formData.paymentConfirmed ? 1 : 0,
              payment_remark: formData.paymentRemark,
            };
            break;
          case 8: // Invoice Info
            stepData = {
              invoice_no: formData.invoiceNumber,
              invoice_amount: formData.invoiceAmount,
            };
            break;
          case 9: // Delivery Info
            stepData = {
              delivery_type: formData.deliveryType,
              is_delayed: formData.isDelayed ? 1 : 0,
              delay_reason: formData.delayReason,
              bus_no: formData.busNo,
              way_bill_no: formData.wayBillNo,
              tracking_no: formData.trackingNo,
              vehicle_no: formData.vehicleNo,
              driver_name: formData.driverName,
              courier_name: formData.courierName,
              no_of_boxes: formData.noOfBoxes,
            };
            break;
          default:
            stepData = {
              sales_branch: formData.salesBranch,

              payment_type: formData.paymentType,
              approval_date: formData.approvalDate,
              approval_remark: formData.approvalRemark,

              sales_order_no: formData.salesOrderNumber,
              sales_order_date: formData.salesOrderDate,

              quotation_no: formData.quotationNumber,
              quotation_date: formData.quotationDate,

              payment_confirmed: formData.paymentConfirmed ? 1 : 0,
              payment_remark: formData.paymentRemark,

              invoice_no: formData.invoiceNumber,
              invoice_amount: formData.invoiceAmount,

              delivery_type: formData.deliveryType,
              is_delayed: formData.isDelayed ? 1 : 0,
              delay_reason: formData.delayReason,
              bus_no: formData.busNo,
              way_bill_no: formData.wayBillNo,
              tracking_no: formData.trackingNo,
              vehicle_no: formData.vehicleNo,
              driver_name: formData.driverName,
              courier_name: formData.courierName,
              no_of_boxes: formData.noOfBoxes,
            };
            break;
        }

        const orderData = { ...baseData, ...stepData };

        Object.keys(orderData).forEach((key) => {
          if (
            orderData[key] !== null &&
            orderData[key] !== undefined &&
            orderData[key] !== ""
          ) {
            formDataToSend.append(key, orderData[key]);
          }
        });

        if (
          activeTab >= 6 &&
          formData.paymentAttachment &&
          formData.paymentAttachment instanceof File
        ) {
          formDataToSend.append("payment_receipt", formData.paymentAttachment);
        }

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
            const updatedPaymentType = response.data.order.payment_type;
            const isCashBased = ["Cash", "Cash Deposit"].includes(
              updatedPaymentType
            );

            if (activeTab === 3) {
              if (!isCashBased) {
                setDisabledSteps(new Set([6, 7]));
              } else {
                setDisabledSteps(new Set());
              }
            }

            setSelectedOrder(response.data.order);
            setSavedSteps((prev) => new Set([...prev, activeTab]));
            showSuccessToast(
              `Step ${activeTab} saved successfully!`,
              loadingToastId
            );

            if (activeTab === 9 || completeOrder) {
              setTimeout(() => {
                resetForm();
                navigate("/orders");
              }, 1000);
            } else if (activeTab < 9) {
              setTimeout(() => {
                let nextTab = activeTab + 1;

                if (activeTab === 5 && !isCashBased) {
                  nextTab = 8;
                } else {
                  while (nextTab <= 9 && disabledSteps.has(nextTab)) {
                    nextTab++;
                  }
                }

                if (nextTab <= 9) {
                  setActiveTab(nextTab);

                  const newSearchParams = new URLSearchParams(searchParams);
                  newSearchParams.set("status", nextTab.toString());
                  navigate(`?${newSearchParams.toString()}`, { replace: true });
                }
              }, 1000);
            }
            setTimeout(() => {
              resetForm();
              navigate("/orders");
            }, 1000);
          }
        }
      } catch (error) {
        console.error("Error saving order:", error);
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
    [
      activeTab,
      formData,
      isNewOrder,
      selectedOrder,
      navigate,
      resetForm,
      disabledSteps,
      searchParams,
    ]
  );

  const handleBackToList = useCallback(() => {
    navigate("/orders");
  }, [navigate]);

  const renderStepContent = (props) => {
    const stepProps = {
      ...props,
      formData,
      updateField,
      isNewOrder,
      errors,
    };

    let currentStepToRender = activeTab;
    if (disabledSteps.has(activeTab)) {
      let nextStep = activeTab + 1;
      while (nextStep <= 9 && disabledSteps.has(nextStep)) {
        nextStep++;
      }
      if (nextStep <= 9) {
        setActiveTab(nextStep);
        currentStepToRender = nextStep;
      }
    }

    switch (currentStepToRender) {
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
        return <Step7PaymentConfirm {...stepProps} />;
      case 8:
        return <Step8AddInvoice {...stepProps} />;
      case 9:
        return <Step9DeliveryDetails {...stepProps} />;
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
      disabledSteps={disabledSteps}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      renderStepContent={renderStepContent}
      handleSubmit={handleSubmit}
      handleBackToList={handleBackToList}
      TAB_CONFIG={TAB_CONFIG}
      formData={formData}
      isDelayed={isDelayed}
      isDelayModalOpen={isDelayModalOpen}
      setDelayModalOpen={setDelayModalOpen}
      handleDelaySave={handleDelaySave}
      updateField={updateField}
    />
  );
};

export default OrderDetail;
