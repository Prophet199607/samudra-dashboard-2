import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { TAB_CONFIG } from "../../../constants/tabConfig";
import DataTable from "../../../components/common/DataTable";
import { showErrorToast } from "../../../components/alert/ToastAlert";

const Collections = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [collections, setCollections] = useState([]);

  const tableColumns = [
    {
      key: "orn_number",
      label: "ORN Number",
      sortable: true,
      render: (value, rowData) => {
        const maxLength = 25;
        const fullReason = rowData.delay_reason || "";
        const isLong = fullReason.length > maxLength;
        const displayReason = isLong
          ? fullReason.substring(0, maxLength) + "..."
          : fullReason;

        return (
          <div>
            <span>{value}</span>
            {rowData.is_delayed === 1 && rowData.delay_reason && (
              <div
                className="text-xs text-red-600 mt-1 truncate max-w-[180px] cursor-pointer"
                title={fullReason}
              >
                ({displayReason})
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "customer_name",
      label: "Customer Name",
      sortable: true,
    },
    {
      key: "customer_po_no",
      label: "PO Number",
      sortable: true,
      render: (value) => value || "-",
    },
    {
      key: "order_request_date",
      label: "Request Date",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "po_amount",
      label: "Amount",
      sortable: true,
      render: (value) => `LKR ${parseFloat(value).toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value, rowData) => {
        const tab = TAB_CONFIG.find((tab) => tab.id === value);
        let colorClass = tab?.color || "bg-gray-500";

        if (value === 10) {
          if (rowData.is_delayed === 1) {
            colorClass = "bg-red-600";
          } else if (rowData.status === 10) {
            colorClass = "bg-green-600";
          }
        }
        return (
          <div className="flex items-center">
            <div
              className={`h-2.5 w-2.5 rounded-full mr-2 ${colorClass}`}
            ></div>
            <span>{tab?.title || `Step ${value}`}</span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      showErrorToast("Failed to fetch orders");
    }
  };

  const handleCreateNewPreviousCollection = async () => {
    try {
      navigate("/collection/new");
    } catch (error) {
      console.error("Error creating new collection:", error);
      showErrorToast("Failed to create new collection");
    }
  };

  const handleOrderClick = (order) => {
    const targetStep = order.status < 10 ? order.status + 1 : order.status;
    navigate(`/order/${order.orn_number}?status=${targetStep}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-2 sm:p-4">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 mb-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Previous Collection Management
              </h1>
              {/* <p className="text-gray-600">Total Orders: {orders.length}</p> */}
            </div>
            <button
              onClick={handleCreateNewPreviousCollection}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Create New Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;
