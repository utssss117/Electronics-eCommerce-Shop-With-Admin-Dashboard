# ⚡ ElectroShop — Electronics eCommerce Shop with Admin Dashboard

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce platform for electronics with a complete admin dashboard.

## ✨ Features

### 🛍️ Customer Shop
- Browse products by category, brand, price, and rating
- Full-text search across products
- Product details with specifications and reviews
- Shopping cart with quantity management
- Checkout with shipping address
- Order history and tracking
- User authentication (Register/Login)
- Responsive mobile-first design

### 📊 Admin Dashboard
- Revenue and order analytics
- Product management (CRUD with image upload)
- Order management with status updates
- User management with role switching
- Quick stats and action links

### 🎨 Design
- Premium dark theme with glassmorphism
- Animated gradient hero sections
- Micro-animations and hover effects
- Inter font typography
- Fully responsive design

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ installed
- **MongoDB** — either [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud) or local MongoDB

### 1. Clone and Install

```bash
cd Electronics-eCommerce-Shop-With-Admin-Dashboard
npm run install-all
```

### 2. Configure MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster (free tier)
3. Create a database user with username and password
4. Whitelist your IP (or allow 0.0.0.0/0 for all IPs)
5. Get your connection string

Edit `server/.env` and replace the `MONGODB_URI`:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/electronics-shop?retryWrites=true&w=majority
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- **15 demo electronics products** (phones, laptops, gaming, etc.)
- **Admin account**: `admin@electroshop.com` / `admin123`
- **User account**: `john@example.com` / `user123`

### 4. Run the App

From the root directory:

```bash
npm run dev
```

This starts both the backend (port 5000) and frontend (port 5173) concurrently.

- 🌐 **Shop**: http://localhost:5173
- 📡 **API**: http://localhost:5000/api

## 📁 Project Structure

```
├── client/                 # React Frontend (Vite)
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── context/        # Auth & Cart state management
│       ├── pages/          # Page components
│       │   ├── shop/       # Home, Products, Cart, Checkout
│       │   ├── auth/       # Login, Register
│       │   ├── user/       # Profile, Orders
│       │   └── admin/      # Dashboard, Products, Orders, Users
│       ├── services/       # API service functions
│       └── utils/          # Helper functions
│
├── server/                 # Node.js Backend (Express)
│   ├── config/             # Database connection
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth, error handling, file upload
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── utils/              # JWT generation
│
└── package.json            # Root - runs both concurrently
```

## 🔑 API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get profile | Yes |
| GET | `/api/products` | Get products (with filters) | No |
| GET | `/api/products/:id` | Get product by ID | No |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| POST | `/api/orders` | Create order | Yes |
| GET | `/api/orders/myorders` | Get user's orders | Yes |
| GET | `/api/orders` | Get all orders | Admin |
| PUT | `/api/orders/:id/status` | Update order status | Admin |
| GET | `/api/users` | Get all users | Admin |

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Auth**: JWT, bcryptjs
- **Styling**: Vanilla CSS with CSS Variables
- **Icons**: Lucide React
