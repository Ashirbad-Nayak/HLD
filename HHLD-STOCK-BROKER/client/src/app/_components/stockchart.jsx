"use client";
import 'chartjs-adapter-moment';
import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { useCurrentStockDataStore } from '../zustand/useCurrentStockDataStore';

const StockChart = () => {
  const { currentStock } = useCurrentStockDataStore();
  const [marketData, setMarketData] = useState([]);
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  const getMarketData = async () => {
    try {
      if (!currentStock || !currentStock.instrumentKey) return;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_MD_BE_URI}/marketData/getDataMonthlyInterval`,
        { params: { instrumentKey: currentStock.instrumentKey } }
      );
      setMarketData(res.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  useEffect(() => {
    getMarketData();
  }, [currentStock]);

  useEffect(() => {
    if (marketData && chartContainer.current) {
      const ctx = chartContainer.current.getContext('2d');

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const dates = marketData.data?.candles.map(item => item[0]);
      const prices = marketData.data?.candles.map(item => item[4]);

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Price (₹)',
            data: prices,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            pointRadius: 3,
            fill: true,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#374151',
                font: { size: 13, weight: '600' }
              }
            },
            tooltip: {
              backgroundColor: '#111827',
              titleFont: { weight: '600' },
              bodyFont: { weight: '500' },
              titleColor: '#f9fafb',
              bodyColor: '#e5e7eb'
            }
          },
          scales: {
            x: {
              type: 'time',
              time: { unit: 'month' },
              title: {
                display: true,
                text: 'Date',
                color: '#6b7280',
                font: { size: 13, weight: '600' }
              },
              ticks: {
                color: '#6b7280'
              },
              grid: {
                color: '#e5e7eb'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Price (₹)',
                color: '#6b7280',
                font: { size: 13, weight: '600' }
              },
              ticks: {
                color: '#6b7280'
              },
              grid: {
                color: '#e5e7eb'
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [marketData]);

  return (
    <div className="w-full h-full">
      <div className="text-center text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
        {currentStock?.name || "📈 Select a Stock to View Chart"}
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-200 dark:border-gray-700 h-[calc(100%-4rem)]">
        <canvas ref={chartContainer} className="w-full h-full" />
      </div>
    </div>
  );
};

export default StockChart;
