"use client";

import { useState } from "react";

const PlaceOrder = ({ onBackToDashboard }) => {
  const [formData, setFormData] = useState({
    quantity: 1,
    product: "D",
    validity: "DAY",
    price: 0,
    tag: "",
    instrument_token: "",
    order_type: "MARKET",
    transaction_type: "BUY",
    disclosed_quantity: 0,
    trigger_price: 0,
    is_amo: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8086/orders/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Order response:", result);
      alert("Order placed successfully");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center text-purple-700 dark:text-purple-300">
        Place Order
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ["quantity", "Quantity"],
          ["product", "Product"],
          ["validity", "Validity"],
          ["price", "Price"],
          ["tag", "Tag"],
          ["instrument_token", "Instrument Token"],
          ["order_type", "Order Type"],
          ["transaction_type", "Transaction Type"],
          ["disclosed_quantity", "Disclosed Quantity"],
          ["trigger_price", "Trigger Price"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
            <input
              type={key === "price" || key.includes("quantity") || key === "trigger_price" ? "number" : "text"}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        ))}

        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_amo"
            checked={formData.is_amo}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            After Market Order (AMO)
          </label>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Submit Order
          </button>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
