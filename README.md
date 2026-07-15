# 🚀 MultiShop Connect Backend

Backend API for **MultiShop Connect**, built using **Node.js, Express.js, MongoDB, and Socket.IO**.

---

## 📖 Overview

MultiShop Connect Backend powers the complete application by handling authentication, user management, demand management, offer management, shop approvals, and real-time notifications.

It follows a role-based architecture supporting:

- 👑 Master
- 👨‍💼 Admin
- 👤 User
- 🛍 Shopkeeper
- 👨‍💻 Intern

---

## ✨ Features

- ✅ Local Authentication
- ✅ Role-Based Access Control
- ✅ Master Dashboard APIs
- ✅ Admin Dashboard APIs
- ✅ User Demand Management
- ✅ Shopkeeper Offer Management
- ✅ Shop Approval Workflow
- ✅ MongoDB Database
- ✅ RESTful APIs
- ✅ Real-Time Notifications using Socket.IO

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JavaScript
- REST API

---

## 📁 Project Structure

```
multishopconnect_backend
│── config/
│── models/
│── routes/
│── server/
│── server.js
│── package.json
│── .gitignore
```
---

## 🔐 Authentication

This project uses **Local Authentication** for user login and role-based authorization.

Supported Roles:

- Master
- Admin
- User
- Shopkeeper
- Intern

---

## 📦 Main Dependencies

- Express.js
- MongoDB (Mongoose)
- Socket.IO
- Multer
- Sharp
- ExcelJS
- dotenv
- CORS

## ⚙️ Installation

```bash
# Clone the repository
git clone <repository-url>

# Go to backend folder
cd multishopconnect_backend

# Install dependencies
npm install

# Start the server
node server.js
```

---

## 🌐 Environment Variables

Create a `.env` file in the backend root.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

> **Note:** The `.env` file is excluded from Git using `.gitignore` to keep sensitive information secure.


---

## 📡 Main Modules

- Authentication
- User Management
- Demand Management
- Offer Management
- Shop Approval
- Notification System
- Socket.IO Server

---

## 🚀 API Features

- User Login
- Create Users
- Create Shops
- Create Demands
- Submit Offers
- Accept / Reject Offers
- Shop Approval Requests
- Notifications
- Dashboard Statistics

---

## 👨‍💻 Author

**Firdaush Khan**

GitHub:
https://github.com/Firdaushkhan
---

⭐ If you found this project helpful, don't forget to star the repository.
Full Stack MERN Developer
