# 💬 CHIT-CHAT - WhatsApp-like Real-Time Messaging App

A full-stack real-time chat application inspired by WhatsApp, built with Next.js, WebSockets, Redis Pub/Sub, MongoDB, and Dockerized microservices deployed via AWS ECS.

---

## 🧠 Features Overview

- 🔐 JWT-based authentication with encrypted passwords
- 💬 Real-time chat using WebSockets (Socket.IO)
- 🗃️ Redis Pub/Sub for distributed message delivery
- 👥 User-to-user direct messaging
- 🌐 Microservice architecture with authentication and chat backends
- ☁️ AWS ECS + ECR deployment via GitHub Actions (CI/CD)
- 🐳 Dockerized services

---

## 🛠️ Tech Stack

### Frontend
- **Next.js** (CSR, SSR, Routing, Hydration)
- **Tailwind CSS**
- **Zustand** (Global state)
- **Axios**
- **Socket.IO Client**

### Backend
- **Node.js**, **Express**
- **MongoDB (Atlas & Compass)**
- **JWT + Bcrypt**
- **Socket.IO**
- **Redis Pub/Sub** (via `ioredis`)
- **Docker**, **Docker Compose**

### Deployment & Infra
- **AWS ECS + Fargate**
- **ECR (Docker images)**
- **VPC, Subnets, Security Groups, Load Balancers**
- **CI/CD with GitHub Actions**

---

## 🔐 Authentication Flow

1. User lands on the **Sign Up / Login page**.
2. On submit, the client:
   - Sends credentials to the **Auth Backend** via an API call.
   - The backend:
     - Encrypts the password using **bcrypt**
     - Generates a **JWT token** using `jsonwebtoken`
     - Stores user data (username & hashed password) in **MongoDB**
     - Sends a response with the token set in a **cookie**
3. On login, password is verified using bcrypt and JWT is validated.

---

## 💬 Chat Flow

1. **Post-authentication**, the client:
   - Updates the authenticated username in **Zustand store**
   - Redirects to the **chat page**
2. In the chat page:
   - Establishes a **WebSocket connection** to the Chat Backend
   - Registers a listener on the `chat msg` event to receive messages
   - Fetches the list of users from Auth Backend using a **JWT-protected** request
3. The chat UI:
   - Stores the user list in Zustand
   - Displays them in a side panel
4. On clicking a user:
   - Sets the selected receiver in Zustand
   - Makes a request to Chat Backend to fetch historical messages between sender & receiver
   - Stores and displays conversations using:
     ```json
     {
       "users": ["userA", "userB"],
       "msgs": [{ "sender": "userA", "receiver": "userB", "message": "Hello!" }]
     }
     ```

---

## 🔄 WebSocket & Redis Flow

1. On connection:
   - Backend maps the `username <-> socket` in memory
   - Subscribes to `chat_username` Redis channel
2. On receiving a `chat msg`:
   - If **receiver is connected to same server**: send via socket directly
   - Else: **publish to Redis channel** `chat_receiverName`
3. All chat servers subscribe to Redis so they can deliver messages in real time
4. Each message is **persisted in MongoDB**


---

## 🚀 Deployment (AWS + Docker)

### Components:
- **Dockerfile** in each backend
- **docker-compose.yml** for local development
- **CI/CD with GitHub Actions**
  - On push, builds Docker images
  - Pushes to **AWS ECR**
  - Triggers **ECS task update** using ECS Service

### AWS Services Used:
- VPC (Region setup)
- Subnets (AZs)
- Security Groups
- NAT Gateway / Internet Gateway
- EC2 (if needed for non-Fargate)
- ECS (Cluster, Tasks, Services)
- ECR (Docker image storage)
- Application Load Balancer
- Auto-scaling & Health checks

---

## 🛠️ Dev Tools
- MongoDB Compass
- Redis Insights / Aiven
- FileZilla / Terminal (for manual deploy/debug)
- Postman (for testing APIs)

---

## 📦 Dependencies

```bash
# Backend
bcrypt
cookie-parser
cors
dotenv
express
jsonwebtoken
mongoose
ioredis
socket.io

# Frontend
axios
zustand
socket.io-client
tailwindcss
next
