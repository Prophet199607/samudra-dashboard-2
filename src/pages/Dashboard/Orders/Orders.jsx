import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TAB_CONFIG } from "../../../constants/tabConfig";
import DataTable from "../../../components/common/DataTable";
import api from "../../../services/api";
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
      render: (value) => {
        const tab = TAB_CONFIG.find((tab) => tab.id === value);
        const statusColors = {
          1: "bg-blue-600",
          2: "bg-purple-600",
          3: "bg-indigo-600",
          4: "bg-teal-600",
          5: "bg-green-600",
          6: "bg-yellow-600",
          7: "bg-orange-600",
          8: "bg-red-600",
          9: "bg-pink-600",
        };

        return (
          <div className="flex items-center">
            <div
              className={`h-2.5 w-2.5 rounded-full mr-2 ${
                statusColors[value] || "bg-gray-500"
              }`}
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
    const targetStep = order.status < 9 ? order.status + 1 : order.status;
    navigate(`/order/${order.orn_number}?status=${targetStep}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-2">
      <div className="max-w-[1600px] mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-5 mb-3 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
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

        <div className="bg-white rounded-xl shadow-lg p-5 border border-gray-100">
          <DataTable
            data={orders}
            columns={tableColumns}
            onRowClick={handleOrderClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Orders;
