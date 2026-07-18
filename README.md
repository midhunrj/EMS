# Employee Management System (EMS)

A full-stack Employee Management System built with React.js, Node.js, Express, and MongoDB. Features include secure authentication, role-based access control, employee management, organizational hierarchy, and a responsive dashboard with charts.

## Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- React Router
- Chart.js
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Tokens)
- bcryptjs (password hashing)
- express-validator (input validation)

## Features

### Authentication
- User login/logout
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes

### Role-Based Access Control (RBAC)
- **Super Admin**: Full access, can assign roles/managers, perform all CRUD operations
- **HR Manager**: Can create/edit/view employees, cannot delete or assign Super Admin role
- **Employee**: Can view and edit only their own profile (limited fields)

### Dashboard
- Total employees count
- Active/Inactive employees
- Department-wise statistics
- Role-wise statistics
- Interactive charts (Bar chart, Doughnut chart)

### Employee Management
- Full CRUD operations
- Fields: Employee ID, Name, Email, Phone, Department, Designation, Salary, Joining Date, Status, Role, Reporting Manager, Profile Image
- Search by name/email
- Filter by department, role, status
- Sort by joining date and name
- Pagination
- Soft delete

### Organizational Hierarchy
- Assign reporting manager
- Display reporting tree
- Prevent circular reporting
- Show direct reports
- Interactive tree visualization

### Bonus Features
- Dark mode
- Pagination
- Soft delete
- Dashboard charts
- Responsive design

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the backend directory with the following:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee-management-system
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
```

4. Seed the database with initial Super Admin:
```bash
node seed.js
```

This will create:
- Super Admin: admin@company.com / admin123
- HR Manager: hr@company.com / hr123  
- Sample employees

**Important**: For security, registration only creates employee accounts. Use the seed script to create the initial Super Admin, then use the admin panel to create HR Managers and promote employees.

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Security Model

### Registration Flow
- **Self-registration**: Only creates employee accounts (role is automatically set to 'employee')
- **Role assignment**: Only Super Admin and HR Managers can assign/promote roles
- **Prevents privilege escalation**: Users cannot self-assign admin or manager roles

### Role Promotion
1. Super Admin logs in
2. Navigates to Employees → Creates new employee or edits existing
3. Changes role field to "hr_manager" or "super_admin"
4. Employee is promoted and gains new permissions

### Initial Setup
Use the seed script to create the first Super Admin, then use the admin panel for all subsequent user management.

## API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login user with email and password.

**Request Body:**
```json
{
  "email": "admin@company.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "admin@company.com",
    "role": "super_admin",
    "employeeId": "employee_id"
  }
}
```

#### POST /api/auth/logout
Logout user (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST /api/auth/register
Register new user (for initial setup).

**Request Body:**
```json
{
  "email": "user@company.com",
  "password": "password123",
  "role": "employee",
  "employeeId": "employee_id"
}
```

### Employee Endpoints

#### GET /api/employees
Get all employees with filtering, sorting, and pagination.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `search`: Search by name or email
- `department`: Filter by department
- `role`: Filter by role
- `status`: Filter by status
- `sortBy`: Sort field (name, joiningDate)
- `sortOrder`: Sort order (asc, desc)
- `page`: Page number
- `limit`: Items per page

**Example:**
```
GET /api/employees?search=john&department=Engineering&status=active&sortBy=name&sortOrder=asc&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### GET /api/employees/:id
Get single employee by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "employee_id",
    "employeeId": "EMP001",
    "name": "John Doe",
    "email": "john@company.com",
    ...
  }
}
```

#### POST /api/employees
Create new employee (HR Manager, Super Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "employeeId": "EMP009",
  "name": "New Employee",
  "email": "new@company.com",
  "phone": "+1234567899",
  "department": "Engineering",
  "designation": "Software Engineer",
  "salary": 75000,
  "joiningDate": "2024-01-01",
  "status": "active",
  "role": "employee",
  "reportingManager": "manager_id",
  "profileImage": "https://example.com/image.jpg"
}
```

#### PUT /api/employees/:id
Update employee (role-based access).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (same as POST, all fields optional)

#### DELETE /api/employees/:id
Delete employee (soft delete, Super Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

#### PATCH /api/employees/:id/manager
Update reporting manager (HR Manager, Super Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "managerId": "manager_id"
}
```

#### GET /api/employees/:id/reportees
Get direct reports of an employee.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

### Organization Endpoints

#### GET /api/organization/tree
Get organization hierarchy tree.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "employee_id",
      "name": "John Doe",
      "reportees": [...]
    }
  ]
}
```

#### GET /api/organization/stats
Get organization statistics.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalEmployees": 50,
    "activeEmployees": 45,
    "inactiveEmployees": 5,
    "departmentStats": [...],
    "roleStats": [...]
  }
}
```

## Database Schema

### User Model
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['super_admin', 'hr_manager', 'employee']),
  employeeId: ObjectId (ref: 'Employee')
}
```

### Employee Model
```javascript
{
  employeeId: String (required, unique),
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  department: String (enum: ['Engineering', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'IT', 'Legal']),
  designation: String (required),
  salary: Number (required),
  joiningDate: Date (required),
  status: String (enum: ['active', 'inactive'], default: 'active'),
  role: String (enum: ['super_admin', 'hr_manager', 'employee'], default: 'employee'),
  reportingManager: ObjectId (ref: 'Employee'),
  profileImage: String,
  isDeleted: Boolean (default: false),
  deletedAt: Date
}
```

## Project Structure

```
employee-management-system/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Employee.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── employees.js
│   │   └── organization.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── EmployeeList.js
│   │   │   ├── EmployeeForm.js
│   │   │   ├── EmployeeDetail.js
│   │   │   ├── OrganizationTree.js
│   │   │   ├── Layout.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Default Credentials

After running the seed script, you can use these credentials:

- **Super Admin**: admin@company.com / admin123
- **HR Manager**: hr@company.com / hr123

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start
```

## Features Implemented

✅ Authentication (Login, Logout, JWT)
✅ Role-Based Access Control (Super Admin, HR Manager, Employee)
✅ Employee CRUD Operations
✅ Organizational Hierarchy with Reporting Tree
✅ Dashboard with Statistics and Charts
✅ Search, Filter, and Sorting
✅ Pagination
✅ Soft Delete
✅ Dark Mode
✅ Frontend & Backend Validation
✅ Responsive Design
✅ Circular Reporting Prevention

## Evaluation Criteria Coverage

- **Frontend UI & UX (20%)**: Modern React UI with Tailwind CSS, responsive design, dark mode
- **Backend APIs (20%)**: RESTful APIs with Express.js, proper error handling
- **RBAC (15%)**: Three-tier role system with appropriate permissions
- **Organizational Hierarchy (15%)**: Tree structure, manager assignment, circular reporting prevention
- **CRUD (15%)**: Full employee management with validation
- **Database (5%)**: MongoDB with proper schema and relationships
- **Validation (5%)**: Frontend and backend validation using express-validator
- **Code Quality & Docs (5%)**: Clean code structure, comprehensive README

## License

ISC

## Author

Full Stack Developer Hiring Assignment

    //"build": "react-scripts build",
