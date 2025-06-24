"use client";

import { useState, useEffect } from "react";

const GetOrders = ({ onBackToDashboard }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8086/orders/get");
      const data = await res.json();
      setOrders(data.message.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders");
    }
    setLoading(false);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:8086/orders/cancel/${orderId}`,
        {
          method: "DELETE",
        }
      );
      const result = await res.json();
      if (res.ok) {
        alert(`Order ${orderId} cancelled successfully`);
        fetchOrders();
      } else {
        alert(`Failed to cancel order: ${result.error}`);
      }
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Something went wrong cancelling the order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-purple-700 dark:text-purple-300">
          Your Orders
        </h2>
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
        >
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-600 dark:text-gray-300">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order, index) => {
  const isCancelled = order.status.toLowerCase().includes("cancel");

  return (
    <div
      key={index}
      className={`p-4 rounded-md shadow ${
        isCancelled
          ? "bg-gray-100 dark:bg-gray-700 text-gray-500"
          : "bg-white dark:bg-gray-800"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold">
            {order.tradingSymbol} ({order.transactionType})
          </p>
          <p className="text-sm">Qty: {order.quantity}</p>
          <p className="text-sm">Status: {order.status}</p>
          <p className="text-sm text-gray-400">
            {isCancelled && "Cancelled"}
          </p>
        </div>

        {!isCancelled && (
          <button
            onClick={() => handleCancelOrder(order.orderId)}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
})
}
        </div>
      )}
    </div>
  );
};

export default GetOrders;
