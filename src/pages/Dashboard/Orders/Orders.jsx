import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { TAB_CONFIG } from "../../../constants/dropdownOptions";
import DataTable from "../../../components/common/DataTable";
import { mockOrders } from "../../../services/mockData";

const Orders = () => {
  const navigate = useNavigate();

  const tableColumns = [
    { key: "id", label: "Order ID" },
    { key: "customerName", label: "Customer Name" },
    {
      key: "date",
      label: "Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
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

        // Get the tab title from TAB_CONFIG
        const tabTitle =
          TAB_CONFIG.find((tab) => tab.id === value)?.title || `Step ${value}`;

        return (
          <div className="flex items-center">
            <div
              className={`h-2.5 w-2.5 rounded-full mr-2 ${
                statusColors[value] || "bg-gray-500"
              }`}
            ></div>
            <span>{tabTitle}</span>
          </div>
        );
      },
    },
    {
      key: "totalAmount",
      label: "Amount",
      render: (value) => `LKR ${parseFloat(value).toFixed(2)}`,
    },
  ];

  const handleOrderClick = (order) => {
    navigate(`/order/${order.id}`);
  };

  const handleCreateNewOrder = () => {
    navigate("/order/new");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 w-full">
      <div className="w-full mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-5 mb-5 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3x2 font-bold text-gray-900 mb-2">
                Order Management
              </h1>
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
            data={mockOrders}
            columns={tableColumns}
            onRowClick={handleOrderClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Orders;
