# Employee Management System (EMS)

A full-stack Employee Management System built to manage employees, roles, permissions, and organizational hierarchy. The application provides secure authentication, role-based access control, employee management, reporting hierarchy, and dashboard analytics.

## Features

### Authentication & Authorization

- JWT-based authentication
- Secure password hashing using bcrypt
- Protected routes
- Role-based access control (RBAC)

### User Roles

#### Super Admin
- Full system access
- Create, update, view, and delete employees
- Assign roles and reporting managers
- Manage organizational structure

#### HR Manager
- Create, update, and view employees
- Manage employee information
- Cannot delete employees
- Cannot assign Super Admin role

#### Employee
- View own profile
- Update limited personal information
- Restricted access based on permissions

---

# Employee Management

- Create, view, update, and soft delete employees
- Manage employee information:

  - Employee ID
  - Name
  - Email
  - Phone
  - Department
  - Designation
  - Salary
  - Joining Date
  - Status
  - Role
  - Reporting Manager
  - Profile Image

Additional features:

- Search employees by name and email
- Filter by department, role, and status
- Sorting by name and joining date
- Pagination
- Data validation

---

# Organizational Hierarchy

The system supports employee reporting relationships.

Features:

- Assign reporting managers
- Display organization tree
- View direct reports
- Prevent circular reporting relationships
- Manage employee hierarchy dynamically

---

# Dashboard

The dashboard provides employee statistics and insights:

- Total employees
- Active employees
- Inactive employees
- Department statistics
- Role statistics
- Interactive charts

---

# Tech Stack

## Frontend

- React.js
- JavaScript
- Tailwind CSS
- React Router
- Axios
- Chart.js

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- Express Validator

## Database

- MongoDB
- Mongoose ODM

---

# Project Structure

```
employee-management-system/

├── backend/
│
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env
│
├── frontend/
│
│   ├── src/
│   │
│   │   ├── components/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

# Installation & Setup

## Prerequisites

Make sure you have installed:

- Node.js
- MongoDB
- npm

---


## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb+srv://midhunrj18852_db_user:83m9IRCXwZSn60CL@ems.gsdfxfk.mongodb.net/
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
```

> **Note:** If you are evaluating this assignment, use the MongoDB connection string provided separately in the submission.

Start the backend server:

```bash
npm run dev
```

Backend URL:

```
http://localhost:5000
```

---

## Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend URL:

```
http://localhost:5173
```

---

# Test Credentials

## Super Admin

```
Email: admin@company.com
Password: admin123
```

## HR Manager

```
Email: hr@company.com
Password: hre123
```

---

# API Endpoints

### Authentication

```
POST   /api/auth/login
POST   /api/auth/logout
```

### Employees

```
GET    /api/employees
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id
```

### Organization

```
GET    /api/organization/tree
GET    /api/employees/:id/reportees
PATCH  /api/employees/:id/manager
```

---

# Security

- JWT Authentication
- Password hashing using bcrypt
- Protected Routes
- Role-Based Access Control (RBAC)
- Backend validation with Express Validator
- Soft Delete

---

# Additional Features

- Dashboard Analytics
- Search, Filter & Sorting
- Pagination
- Organization Hierarchy
- Circular Reporting Prevention
- CSV Import
- Dark Mode
- Responsive UI

---

# Author

**Midhun Raj**

Full Stack Developer

---

# License

ISC