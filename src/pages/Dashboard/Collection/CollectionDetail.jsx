import api from "../../../services/api";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { TAB_CONFIG as ORIGINAL_TAB_CONFIG } from "../../../constants/tabConfig";
import { useFormState } from "../../../hooks/useFormState";
import CollectionForm from "../../../components/collections/CollectionForm";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  showErrorToast,
  showSuccessToast,
  showLoadingToast,
} from "../../../components/alert/ToastAlert";

import Step1CreateOrder from "../../../components/steps/CreateOrder";
import Step6CashPayment from "../../../components/steps/CashPayment";
import Step7PaymentConfirm from "../../../components/steps/PaymentConfirm";
import Step8AddInvoice from "../../../components/steps/AddInvoice";
import Step9CollectionReceipt from "../../../components/steps/CollectionReceipt";

const COLLECTION_TAB_CONFIG = ORIGINAL_TAB_CONFIG.filter((tab) =>
  [6, 7, 8, 9].includes(tab.id)
);

const CollectionDetail = () => {
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
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [disabledSteps, setDisabledSteps] = useState(new Set());

  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam && !isNewOrder && selectedOrder) {
      const targetStatus = parseInt(statusParam);

      if (
        targetStatus >= 1 &&
        targetStatus <= 10 &&
        !disabledSteps.has(targetStatus) &&
        (targetStatus === 1 || savedSteps.has(targetStatus - 1))
      ) {
        setActiveTab(targetStatus);
      } else {
        let adjustedStatus = targetStatus;
        while (adjustedStatus <= 10 && disabledSteps.has(adjustedStatus)) {
          adjustedStatus++;
        }
        if (adjustedStatus <= 10) {
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
    const fetchOrderDetails = async (pcNumber) => {
      try {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const response = await api.get(`/prv-collections/${pcNumber}`);
        const collection = response.data.collection;
        setSelectedOrder(collection);

        let initialTab = collection.status;
        if (initialTab < 6) initialTab = 6;
        if (initialTab > 9) initialTab = 9;

        setActiveTab(initialTab);

        setSavedSteps(
          new Set(
            Array.from({ length: 10 }, (_, i) => i + 1).filter(
              (step) => step <= collection.status && step >= 6
            )
          )
        );

        const fieldMappings = {
          customer_code: "customerCode",
          customer_name: "customerName",
          pc_number: "ornNumber",

          payment_receipt: "paymentAttachment",
          payment_confirmed: "paymentConfirmed",
          payment_remark: "paymentRemark",

          invoice_no: "invoiceNumber",
          invoice_amount: "invoiceAmount",

          cash_in_no: "cashInNo",
          cash_in_amount: "cashInAmount",
          cash_in_remark: "cashInRemark",
        };

        Object.entries(fieldMappings).forEach(([dbField, formField]) => {
          if (
            collection[dbField] !== null &&
            collection[dbField] !== undefined
          ) {
            let value = collection[dbField];

            if (dbField === "payment_receipt" && typeof value === "string") {
              value = value.replace(/\\/g, "");
            }

            updateField(formField, value);
          }
        });
      } catch (error) {
        console.error("Error fetching collection:", error);
        showErrorToast("Failed to fetch collection");
        navigate("/prv-collections");
      }
    };

    if (id === "new") {
      resetForm();
      setErrors({});
      setSavedSteps(new Set());
      setActiveTab(6);

      if (hasFetched.current) return;
      hasFetched.current = true;

      const generatePC = async () => {
        try {
          const response = await api.get("/prv-collections/generate-pc");
          if (response.data.success) {
            updateField("ornNumber", response.data.pc_number);
          }
        } catch (error) {
          console.error("Error generating PC Number:", error);
          showErrorToast("Failed to generate PC Number");
        }
      };
      generatePC();
    } else {
      fetchOrderDetails(id);
    }
  }, [id, resetForm, updateField, navigate]);

  const handleDelaySave = async (reason) => {
    if (!selectedOrder?.pc_number) {
      showErrorToast("PC number is not available.");
      return;
    }
    try {
      const response = await api.put(
        `/prv-collections/${selectedOrder.pc_number}/delay`,
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
        navigate("/prv-collections");
      }, 1000);
    } catch (error) {
      showErrorToast("Failed to save delay reason.");
      console.error("Error saving delay reason:", error);
    }
  };

  const handleSubmit = useCallback(
    async (completeOrder = false, overrides = {}) => {
      let loadingToastId;
      try {
        loadingToastId = showLoadingToast("Saving step...");

        const currentFormData = { ...formData, ...overrides };

        const newErrors = {};
        const requireField = (key, message) => {
          if (!currentFormData[key]) newErrors[key] = message;
        };

        switch (activeTab) {
          case 6:
            requireField("ornNumber", "PC number is required");
            requireField("customerName", "Customer name is required");

            if (isNewOrder && !currentFormData.paymentAttachment) {
              newErrors["paymentAttachment"] = "Payment receipt is required";
            }
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
          customer_code: formData.customerCode,
          customer_name: formData.customerName,
          pc_number: formData.ornNumber,
          orn_number: formData.ornNumber,
          status: activeTab,
          currentStep: activeTab,
        };

        let stepData = {};
        switch (activeTab) {
          case 6: // Payment Info (File upload step)
            // Step 6 now acts as creation step too
            break;
          case 7: // Payment Confirmation
            stepData = {
              payment_confirmed: currentFormData.paymentConfirmed ? 1 : 0,
              payment_remark: currentFormData.paymentRemark,
            };
            break;
          case 8: // Invoice Info
            stepData = {
              invoice_no: currentFormData.invoiceNumber,
              invoice_amount: currentFormData.invoiceAmount,
            };
            break;
          case 9: // Collection Receipt
            stepData = {
              cash_in_no: currentFormData.cashInNo,
              cash_in_amount: currentFormData.cashInAmount,
              cash_in_remark: currentFormData.cashInRemark,
            };
            break;
          default:
            stepData = {
              payment_confirmed: currentFormData.paymentConfirmed ? 1 : 0,
              payment_remark: currentFormData.paymentRemark,

              invoice_no: currentFormData.invoiceNumber,
              invoice_amount: currentFormData.invoiceAmount,

              cash_in_no: currentFormData.cashInNo,
              cash_in_amount: currentFormData.cashInAmount,
              cash_in_remark: currentFormData.cashInRemark,
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
          currentFormData.paymentAttachment &&
          currentFormData.paymentAttachment instanceof File
        ) {
          formDataToSend.append(
            "payment_receipt",
            currentFormData.paymentAttachment
          );
        }

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        if (isNewOrder && activeTab === 6) {
          const response = await api.post(
            "/prv-collections/new",
            formDataToSend,
            config
          );
          if (response.data.success) {
            setSelectedOrder(response.data.collection);
            setSavedSteps(new Set([6]));
            showSuccessToast(
              "Collection created successfully!",
              loadingToastId
            );

            setTimeout(() => {
              resetForm();
              navigate("/prv-collections");
            }, 1000);
          }
        } else if (selectedOrder) {
          const response = await api.put(
            `/prv-collections/${selectedOrder.pc_number}`,
            formDataToSend,
            config
          );

          if (response.data.success) {
            setSelectedOrder(response.data.collection);
            setSavedSteps((prev) => new Set([...prev, activeTab]));
            showSuccessToast(
              `Step ${activeTab} saved successfully!`,
              loadingToastId
            );

            if (activeTab === 9 || completeOrder) {
              setTimeout(() => {
                resetForm();
                navigate("/prv-collections");
              }, 1000);
            } else if (
              activeTab === 7 &&
              currentFormData.paymentConfirmed === false
            ) {
              // Do not advance step if payment is rejected
            } else if (activeTab < 9) {
              setTimeout(() => {
                let nextTab = activeTab + 1;
                while (nextTab <= 9 && disabledSteps.has(nextTab)) {
                  nextTab++;
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
              navigate("/prv-collections");
            }, 1000);
          }
        }
      } catch (error) {
        console.error("Error saving collection:", error);
        if (error.response?.status === 422 && error.response?.data?.errors) {
          const backendErrors = error.response.data.errors;
          const normalized = {};
          Object.entries(backendErrors).forEach(([key, value]) => {
            normalized[key] = Array.isArray(value) ? value[0] : value;
          });
          setErrors(normalized);
        } else {
          showErrorToast(
            error.response?.data?.message || "Failed to save collection",
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
    navigate("/prv-collections");
  }, [navigate]);

  const handlePaymentAction = (isConfirmed) => {
    if (isConfirmed) {
      updateField("paymentConfirmed", true);
      handleSubmit(false, { paymentConfirmed: true });
    } else {
      setShowRejectModal(true);
    }
  };

  const handleConfirmReject = () => {
    setShowRejectModal(false);
    updateField("paymentConfirmed", false);
    handleSubmit(false, { paymentConfirmed: false });
  };

  const renderStepContent = (props) => {
    const stepProps = {
      ...props,
      formData,
      updateField,
      isNewOrder,
      errors,
      referenceLabel: "PC Number",
    };

    let currentStepToRender = activeTab;
    if (disabledSteps.has(activeTab)) {
      let nextStep = activeTab + 1;
      while (nextStep <= 10 && disabledSteps.has(nextStep)) {
        nextStep++;
      }
      if (nextStep <= 10) {
        setActiveTab(nextStep);
        currentStepToRender = nextStep;
      }
    }

    switch (currentStepToRender) {
      case 1:
      case 6:
        // Render combined view for Step 6 (Create Order Info + Cash Payment)
        return (
          <div className="space-y-8">
            <Step1CreateOrder {...stepProps} isCollection={true} />
            <hr className="border-gray-200" />
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Payment Details
              </h3>
              <Step6CashPayment {...stepProps} />
            </div>
          </div>
        );
      case 7:
        return (
          <Step7PaymentConfirm
            {...stepProps}
            handlePaymentAction={handlePaymentAction}
          />
        );
      case 8:
        return <Step8AddInvoice {...stepProps} />;
      case 9:
        return <Step9CollectionReceipt {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <CollectionForm
      title={
        isNewOrder
          ? "New Collection"
          : `Collection Details: ${selectedOrder?.pc_number}`
      }
      selectedOrder={selectedOrder}
      savedSteps={savedSteps}
      disabledSteps={disabledSteps}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      renderStepContent={renderStepContent}
      handleSubmit={handleSubmit}
      handleBackToList={handleBackToList}
      TAB_CONFIG={COLLECTION_TAB_CONFIG}
      formData={formData}
      isDelayed={isDelayed}
      isDelayModalOpen={isDelayModalOpen}
      setDelayModalOpen={setDelayModalOpen}
      handleDelaySave={handleDelaySave}
      updateField={updateField}
      handlePaymentAction={handlePaymentAction}
      showRejectModal={showRejectModal}
      setShowRejectModal={setShowRejectModal}
      handleConfirmReject={handleConfirmReject}
    />
  );
};

export default CollectionDetail;
