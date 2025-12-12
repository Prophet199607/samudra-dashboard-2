import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { TAB_CONFIG } from "../../../constants/tabConfig";
import DataTable from "../../../components/common/DataTable";
import { showErrorToast } from "../../../components/alert/ToastAlert";

const Orders = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [orders, setOrders] = useState([]);

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

  const handleCreateNewOrder = async () => {
    try {
      navigate("/order/new");
    } catch (error) {
      console.error("Error creating new order:", error);
      showErrorToast("Failed to create new order");
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
                Order Management
              </h1>
              <p className="text-gray-600">Total Orders: {orders.length}</p>
            </div>
            <button
              onClick={handleCreateNewOrder}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Create New Order
            </button>
          </div>
        </div>

        {/* Desktop DataTable */}
        <div className="hidden md:block bg-white rounded-xl shadow-lg p-2 sm:p-5 border border-gray-100">
          <DataTable
            data={orders}
            columns={tableColumns}
            onRowClick={handleOrderClick}
          />
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-4">
          {orders.map((order) => {
            const tab = TAB_CONFIG.find((t) => t.id === order.status);
            const colorClass =
              order.is_delayed === 1
                ? "bg-red-500"
                : order.status === 10
                ? "bg-green-600"
                : tab?.color || "bg-gray-500";

            return (
              <div
                key={order.orn_number}
                onClick={() => handleOrderClick(order)}
                className="bg-white rounded-xl shadow p-4 border border-gray-100 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {order.orn_number}
                  </h3>
                  <div className="flex items-center">
                    <div
                      className={`h-2.5 w-2.5 rounded-full mr-2 ${colorClass}`}
                    />
                    <span className="text-sm text-gray-700">
                      {tab?.title || `Step ${order.status}`}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Customer:</span>{" "}
                    {order.customer_name}
                  </p>
                  <p>
                    <span className="font-medium">PO No:</span>{" "}
                    {order.customer_po_no || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(order.order_request_date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span> LKR{" "}
                    {parseFloat(order.po_amount).toLocaleString()}
                  </p>
                  {order.is_delayed === 1 && order.delay_reason && (
                    <p className="text-xs text-red-600 mt-1">
                      ({order.delay_reason})
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;
