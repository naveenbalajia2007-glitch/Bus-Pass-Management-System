<<<<<<< HEAD
# 🚌 Smart AI-Based Real-Time Bus Pass Management System
### OOSE Academic Project | React + Node.js + MySQL + Socket.IO

---

## 📋 Project Overview

A complete full-stack web application for managing student bus passes with:
- 🎫 Digital Bus Pass with QR Code
- 🤖 AI Analytics Dashboard
- 📡 Real-Time Bus Tracking (Socket.IO)
- 💳 Online Payment Simulation
- 🛡️ Role-based Auth (Student / Admin / Conductor)

---

## 🏗️ Folder Structure

```
BusPassSystem/
├── backend/                  ← Node.js + Express + Socket.IO
│   ├── config/db.js          ← MySQL connection pool
│   ├── controllers/          ← Business logic (6 controllers)
│   ├── middleware/           ← JWT auth + file upload
│   ├── routes/               ← API route definitions (6 files)
│   ├── utils/                ← QR generator + Socket handler
│   ├── uploads/              ← Uploaded student ID proof files
│   ├── .env                  ← Environment variables (configure this)
│   └── server.js             ← Main entry point
├── frontend/                 ← React.js app
│   └── src/
│       ├── context/          ← AuthContext (JWT state)
│       ├── pages/            ← 10 full pages
│       ├── components/       ← Navbar
│       └── utils/api.js      ← Axios instance
├── database/
│   └── schema.sql            ← Full MySQL schema + seed data
└── README.md
```

---

## ⚙️ Prerequisites

- Node.js v18+
- MySQL 8.0+
- npm v9+

---

## 🚀 Setup Instructions

### Step 1 — Clone & Setup Database

```bash
# Open MySQL and run:
mysql -u root -p < database/schema.sql
```

Or open MySQL Workbench and run `database/schema.sql`.

---

### Step 2 — Configure Backend

```bash
cd backend
```

Edit `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password    ← CHANGE THIS
DB_NAME=buspass_db
JWT_SECRET=buspass_super_secret_jwt_key_2024_oose_project
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

Install dependencies and start:
```bash
npm install
npm run dev       # or: node server.js
```

Backend runs at: **http://localhost:5000**

---

### Step 3 — Setup Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🔑 Demo Login Credentials

| Role      | Email                        | Password       |
|-----------|------------------------------|----------------|
| Student   | arun@student.edu             | Student@123    |
| Admin     | admin@buspass.edu            | Admin@123      |
| Conductor | conductor1@buspass.edu       | Conductor@123  |

> Passwords in DB are hashed with bcrypt. Use the above to log in.

---

## 📦 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React.js, Vanilla CSS (Dark Theme)  |
| Backend     | Node.js, Express.js                 |
| Database    | MySQL 8.0                           |
| Real-Time   | Socket.IO                           |
| Auth        | JWT (jsonwebtoken + bcryptjs)       |
| QR Code     | qrcode (backend) + jsQR (scanner)   |
| Charts      | Recharts                           |
| PDF         | jsPDF + html2canvas                |
| File Upload | Multer                              |

---

## 🔌 API Routes

### Auth
| Method | Route                     | Description              |
|--------|---------------------------|--------------------------|
| POST   | /api/auth/register        | Student registration     |
| POST   | /api/auth/login/student   | Student login            |
| POST   | /api/auth/login/admin     | Admin login              |
| POST   | /api/auth/login/conductor | Conductor login          |
| GET    | /api/auth/profile         | Get current user profile |

### Bus Passes
| Method | Route                       | Role    |
|--------|-----------------------------|---------|
| POST   | /api/passes                 | Student |
| GET    | /api/passes/my              | Student |
| GET    | /api/passes/all             | Admin   |
| PUT    | /api/passes/:id/approve     | Admin   |
| PUT    | /api/passes/:id/reject      | Admin   |
| GET    | /api/passes/:id/download    | Student |
| POST   | /api/passes/renew           | Student |

### Conductor
| Method | Route                     | Role      |
|--------|---------------------------|-----------|
| POST   | /api/conductor/verify     | Conductor |
| GET    | /api/conductor/history    | Conductor |

### Payments
| Method | Route              | Role    |
|--------|--------------------|---------|
| POST   | /api/payments      | Student |
| GET    | /api/payments/my   | Student |
| GET    | /api/payments/all  | Admin   |

### Analytics (Admin)
| Method | Route                         |
|--------|-------------------------------|
| GET    | /api/analytics/stats          |
| GET    | /api/analytics/routes         |
| GET    | /api/analytics/revenue        |
| GET    | /api/analytics/distribution   |
| GET    | /api/analytics/fraud          |
| GET    | /api/analytics/students       |
| POST   | /api/analytics/notifications  |
| GET    | /api/analytics/my-notifications |

---

## 🗄️ Database Tables

1. **users** — Student accounts
2. **admins** — Admin accounts
3. **conductors** — Conductor accounts
4. **bus_passes** — Applications, QR codes, validity
5. **routes** — Bus routes with fare plans
6. **payments** — Payment records + receipts
7. **qr_logs** — Conductor scan history + fraud detection
8. **notifications** — Push alerts for users

---

## 📱 Pages

| Page              | URL           | Role         |
|-------------------|---------------|--------------|
| Home              | /             | Public       |
| Login             | /login        | Public       |
| Register          | /register     | Public       |
| Student Dashboard | /dashboard    | Student      |
| Apply Pass        | /apply        | Student      |
| Payment           | /payment      | Student      |
| Admin Dashboard   | /admin        | Admin        |
| AI Analytics      | /analytics    | Admin        |
| Conductor Panel   | /conductor    | Conductor    |
| Live Tracking     | /tracking     | Public       |

---

## 🎓 OOSE Design Patterns Used

- **MVC Pattern** — Controllers / Routes / Models separation
- **Singleton Pattern** — DB connection pool (config/db.js)
- **Middleware Pattern** — Auth, Upload middleware chain
- **Observer Pattern** — Socket.IO event-driven bus tracking
- **Strategy Pattern** — Multiple payment method handlers
- **Factory Pattern** — JWT token creation in authController

---

## 👥 Roles & Permissions

| Feature              | Student | Admin | Conductor |
|----------------------|---------|-------|-----------|
| Apply Pass           | ✅      | ❌    | ❌        |
| Approve/Reject Pass  | ❌      | ✅    | ❌        |
| Download QR Pass     | ✅      | ❌    | ❌        |
| Scan QR Code         | ❌      | ❌    | ✅        |
| View Analytics       | ❌      | ✅    | ❌        |
| Send Notifications   | ❌      | ✅    | ❌        |
| Make Payments        | ✅      | ❌    | ❌        |
| Live Tracking        | ✅      | ✅    | ✅        |
=======
# Buss_Pass_Management_System
Online Bus Pass Management System with real-time bus tracking feature.
>>>>>>> 796287cf6ce2dc8ba5922237c64eedb57890d535
