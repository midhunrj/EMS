const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Employee = require('./models/Employee');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/employee-management-system');
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Employee.deleteMany({});
    console.log('Cleared existing data');


    const adminEmployee = await Employee.create({
      employeeId: 'EMP001',
      name: 'Super Admin',
      email: 'admin@company.com',
      phone: '+1234567890',
      department: 'IT',
      designation: 'Super Administrator',
      salary: 150000,
      joiningDate: new Date('2020-01-01'),
      status: 'active',
      role: 'super_admin',
      reportingManager: null,
      profileImage: ''
    });


    const adminUser = await User.create({
      email: 'admin@company.com',
      password: 'admin123',
      role: 'super_admin',
      employeeId: adminEmployee._id
    });


    const hrEmployee = await Employee.create({
      employeeId: 'EMP002',
      name: 'HR Manager',
      email: 'hr@company.com',
      phone: '+1234567891',
      department: 'HR',
      designation: 'HR Manager',
      salary: 80000,
      joiningDate: new Date('2020-02-01'),
      status: 'active',
      role: 'hr_manager',
      reportingManager: adminEmployee._id,
      profileImage: ''
    });


    const hrUser = await User.create({
      email: 'hr@company.com',
      password: 'hr123',
      role: 'hr_manager',
      employeeId: hrEmployee._id
    });

    // Create Regular Employee
    const employee1 = await Employee.create({
      employeeId: 'EMP003',
      name: 'John Doe',
      email: 'john@company.com',
      phone: '+1234567892',
      department: 'Engineering',
      designation: 'Software Engineer',
      salary: 75000,
      joiningDate: new Date('2021-03-15'),
      status: 'active',
      role: 'employee',
      reportingManager: adminEmployee._id,
      profileImage: ''
    });

    const employee2 = await Employee.create({
      employeeId: 'EMP004',
      name: 'Jane Smith',
      email: 'jane@company.com',
      phone: '+1234567893',
      department: 'Engineering',
      designation: 'Senior Software Engineer',
      salary: 90000,
      joiningDate: new Date('2020-06-01'),
      status: 'active',
      role: 'employee',
      reportingManager: adminEmployee._id,
      profileImage: ''
    });

    const employee3 = await Employee.create({
      employeeId: 'EMP005',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      phone: '+1234567894',
      department: 'Marketing',
      designation: 'Marketing Manager',
      salary: 85000,
      joiningDate: new Date('2021-01-10'),
      status: 'active',
      role: 'employee',
      reportingManager: hrEmployee._id,
      profileImage: ''
    });

    const employee4 = await Employee.create({
      employeeId: 'EMP006',
      name: 'Sarah Williams',
      email: 'sarah@company.com',
      phone: '+1234567895',
      department: 'Finance',
      designation: 'Financial Analyst',
      salary: 70000,
      joiningDate: new Date('2022-04-20'),
      status: 'active',
      role: 'employee',
      reportingManager: hrEmployee._id,
      profileImage: ''
    });

    const employee5 = await Employee.create({
      employeeId: 'EMP007',
      name: 'Tom Brown',
      email: 'tom@company.com',
      phone: '+1234567896',
      department: 'Engineering',
      designation: 'Junior Developer',
      salary: 55000,
      joiningDate: new Date('2023-01-15'),
      status: 'active',
      role: 'employee',
      reportingManager: employee2._id,
      profileImage: ''
    });

    const employee6 = await Employee.create({
      employeeId: 'EMP008',
      name: 'Lisa Anderson',
      email: 'lisa@company.com',
      phone: '+1234567897',
      department: 'Sales',
      designation: 'Sales Representative',
      salary: 60000,
      joiningDate: new Date('2023-03-01'),
      status: 'inactive',
      role: 'employee',
      reportingManager: employee3._id,
      profileImage: ''
    });

    console.log('Database seeded successfully!');
    console.log('\nLogin Credentials:');
    console.log('===================');
    console.log('Super Admin: admin@company.com / admin123');
    console.log('HR Manager: hr@company.com / hr123');
    console.log('Employee: john@company.com (no password set, use register to create)');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
