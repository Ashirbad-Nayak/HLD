# Stock Broker Platform - README

## Overview

This is a full-stack stock broker application that allows users to:

* Create and manage watchlists
* Search and add stocks to watchlists
* View real-time stock prices
* View historical stock data (charts)
* Place, cancel, and view stock orders

The platform leverages modern tech including:

* **React**, **Zustand** (state management)
* **WebSockets** for real-time data
* **gRPC & Protobuf** for communication with Upstox APIs
* **OpenSearch**, **MongoDB**, **Lambda**, **API Gateway**, and more

---

## Client (Frontend)

### Features:

* Sidebar:

  * Add/Get Watchlists
  * Add Stocks to a Watchlist
  * Search stocks using OpenSearch API Gateway
* Real-time stock price updates using WebSocket
* Charts using historical data via Upstox API
* Order Management (Place, Cancel, Get Orders)

### Key Flow:

* **Search Stocks**: Uses Lambda + API Gateway to query OpenSearch index
* **Watchlist Management**: Communicates with the Watchlist Service (MongoDB)
* **Real-Time Prices**: Connects to Market Data Service over WebSocket
* **Charts**: Calls market data service API to fetch historical chart data
* **Order Actions**: Uses Order Manager Service for placing, canceling, and viewing orders

---

## Watchlist Service

* Connected to MongoDB using Mongoose
* Schema:

```json
Watchlist {
  title: String,
  stocks: [
    {
      name: String,
      instrumentKey: String
    }
  ]
}
```

* APIs:

  * Add Watchlist
  * Get Watchlists
  * Add Stock to Watchlist

---

## Market Data Service

### Responsibilities:

* Load Stock Data into OpenSearch
* Search stocks from OpenSearch (via Lambda)
* Handle real-time market data via WebSocket (Upstox)
* Provide historical stock data for chart rendering

### OpenSearch Integration:

* Load stock data via `/stocks/loadData` (called once via Postman)
* Indexes data 

### WebSocket Integration:

* gRPC + Protobuf to decode messages from Upstox
* When client connects:

  * Initializes proto file
  * Gets Upstox WS URL
  * Connects and forwards instrument keys
  * Receives decoded messages
  * Emits updates to the client via event `market data`

---

## Order Manager Service

### APIs:

* Place Order
* Cancel Order
* Get Orders

### Notes:

* Uses Upstox Order APIs
* Parses JSON payload from UI to form PlaceOrderRequest
* Uses API version `2.0`


---

## Technologies Used

* **Frontend**: React, Zustand, Tailwind, WebSocket, Chart.js
* **Backend**: Node.js, Express, MongoDB (Mongoose), gRPC, Protobuf
* **Search**: OpenSearch, Lambda (AWS), API Gateway
* **3rd Party**: Upstox API

---

## Functional Capabilities

1. Create Watchlist
2. Search Stocks (OpenSearch via Lambda)
3. Real-time Market Price via gRPC WebSocket
4. View Market Charts (1 year) via API
5. Place, Cancel, and View Orders

---

## Data Sources

* **Stock Metadata**: Uploaded from Upstox CSV to OpenSearch
* **Real-time Prices**: Upstox WebSocket via Protobuf
* **Charts**: Upstox Market Data API

---

## Deployment Notes

* API Gateway setup to allow CORS from frontend
* Lambda deployed via zipped project with OpenSearch logic
* gRPC setup using compiled protobuf files from Upstox
* MongoDB instance required for Watchlist Service

---