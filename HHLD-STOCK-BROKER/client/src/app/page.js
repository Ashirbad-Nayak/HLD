"use client";
import { useState } from "react";
import Dashboard from "./dashboard/page.jsx";
import PlaceOrder from "./_components/placeorder.jsx";
import GetOrders from "./_components/getorders.jsx";

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState("dashboard");


  

  return (
    <div>
      {/* Header with App Title and Buttons */}
      <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-200 to-blue-200 dark:from-gray-800 dark:to-gray-900 shadow relative">
  <div className="absolute left-6" />
  <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-300 mx-auto">
    Stock Broker App
  </h1>
  <div className="flex gap-3 absolute right-6">
    <button
      className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
      onClick={() => setSelectedComponent("placeOrder")}
    >
      Place Order
    </button>
   
    <button
      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      onClick={() => setSelectedComponent("getOrders")}
    >
      Get Orders
    </button>
  </div>
</div>

      {/* Replace Dashboard with selected action component */}
      {selectedComponent === "dashboard" && <Dashboard />}
{selectedComponent === "placeOrder" && <PlaceOrder onBackToDashboard={() => setSelectedComponent("dashboard")} />}
{selectedComponent === "getOrders" && <GetOrders onBackToDashboard={() => setSelectedComponent("dashboard")} />}
    </div>
  );
}
