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

# Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGODB_URI=mongodb+srv://midhunrj18852_db_user:83m9IRCXwZSn60CL@ems.gsdfxfk.mongodb.net/

JWT_SECRET=your_secret_key

JWT_EXPIRE=7d
```

Start backend server:

```bash
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

---

# Database Setup

Run the seed file to create initial users:

```bash
node seed.js
```

This creates testing accounts:

## Super Admin

```
Email:
admin@company.com

Password:
admin123
```

## HR Manager

```
Email:
hr@company.com

Password:
hre123
```

---

# Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# API Endpoints

## Authentication

### Login

```
POST /api/auth/login
```

### Logout

```
POST /api/auth/logout
```

---

## Employees

### Get Employees

```
GET /api/employees
```

### Create Employee

```
POST /api/employees
```

### Update Employee

```
PUT /api/employees/:id
```

### Delete Employee

```
DELETE /api/employees/:id
```

---

## Organization

### Organization Tree

```
GET /api/organization/tree
```

### Get Employee Reportees

```
GET /api/employees/:id/reportees
```

### Update Reporting Manager

```
PATCH /api/employees/:id/manager
```

---

# Database Models

## User Model

```javascript
{
  email: String,
  password: String,
  role: String,
  employeeId: ObjectId
}
```

## Employee Model

```javascript
{
  employeeId: String,
  name: String,
  email: String,
  phone: String,
  department: String,
  designation: String,
  salary: Number,
  joiningDate: Date,
  status: String,
  role: String,
  reportingManager: ObjectId,
  profileImage: String,
  isDeleted: Boolean,
  deletedAt: Date
}
```

---

# Security Implementation

Implemented security features:

- JWT authentication
- Password encryption using bcrypt
- Protected API routes
- Role permission checks
- Request validation
- Prevention of unauthorized role escalation

---

# Additional Features

- Dark mode
- Responsive design
- Dashboard charts
- CSV employee import
- Soft delete
- Circular reporting prevention
- Client and server-side validation

---

# Future Improvements

Possible enhancements:

- Docker support
- Automated testing
- Cloud deployment
- Email notifications
- Advanced analytics
- Audit logs

---

# Author

**Midhun Raj**

Full Stack Developer

---

# License

ISC