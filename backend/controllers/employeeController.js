const Employee = require('../models/Employee');

// Helper function to check circular reporting
const checkCircularReporting = async (employeeId, managerId) => {
  if (!managerId) return false;
  
  let currentManager = await Employee.findById(managerId);
  while (currentManager) {
    if (currentManager._id.toString() === employeeId) {
      return true; // Circular reference detected
    }
    currentManager = await Employee.findById(currentManager.reportingManager);
  }
  return false;
};

// @desc    Get all employees with filtering, sorting, and pagination
// @access  Private
exports.getEmployees = async (req, res) => {
  try {
    const { 
      search, 
      department, 
      role, 
      status, 
      sortBy = 'name', 
      sortOrder = 'asc',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    let query = { isDeleted: false };

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by department
    if (department) {
      query.department = department;
    }

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Role-based filtering
    if (req.user.role === 'employee') {
      query._id = req.user.employeeId;
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const employees = await Employee.find(query)
      .populate('reportingManager', 'name email employeeId')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Employee.countDocuments(query);

    res.json({
      success: true,
      data: employees,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get single employee
// @access  Private
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({ 
      _id: req.params.id, 
      isDeleted: false 
    }).populate('reportingManager', 'name email employeeId');

    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: 'Employee not found' 
      });
    }

    // Role-based access
    if (req.user.role === 'employee' && req.user.employeeId.toString() !== employee._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this employee' 
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Create new employee
// @access  Private (HR Manager, Super Admin)
exports.createEmployee = async (req, res) => {
  try {
    const { 
      employeeId, 
      name, 
      email, 
      phone, 
      department, 
      designation, 
      salary, 
      joiningDate, 
      status, 
      role, 
      reportingManager,
      profileImage 
    } = req.body;

    // Check if employee ID or email already exists
    const existingEmployee = await Employee.findOne({
      $or: [{ employeeId }, { email }],
      isDeleted: false
    });

    if (existingEmployee) {
      return res.status(400).json({ 
        success: false, 
        message: 'Employee ID or email already exists' 
      });
    }

    // Role-based restrictions
    if (req.user.role === 'hr_manager' && role === 'super_admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'HR Manager cannot create Super Admin' 
      });
    }

    // Check circular reporting
    if (reportingManager) {
      const isCircular = await checkCircularReporting(null, reportingManager);
      if (isCircular) {
        return res.status(400).json({ 
          success: false, 
          message: 'Circular reporting detected' 
        });
      }
    }

    const employee = await Employee.create({
      employeeId,
      name,
      email,
      phone,
      department,
      designation,
      salary,
      joiningDate,
      status: status || 'active',
      role: role || 'employee',
      reportingManager,
      profileImage
    });

    const populatedEmployee = await Employee.findById(employee._id).populate('reportingManager', 'name email employeeId');

    res.status(201).json({
      success: true,
      data: populatedEmployee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Update employee
// @access  Private
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ 
      _id: req.params.id, 
      isDeleted: false 
    });

    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: 'Employee not found' 
      });
    }

    // Role-based access
    if (req.user.role === 'employee' && req.user.employeeId.toString() !== employee._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this employee' 
      });
    }

    const { 
      name, 
      email, 
      phone, 
      department, 
      designation, 
      salary, 
      status, 
      role, 
      reportingManager,
      profileImage 
    } = req.body;

    // Employees can only edit limited fields
    if (req.user.role === 'employee') {
      const allowedFields = ['phone', 'profileImage'];
      const attemptedFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
      if (attemptedFields.length > 0) {
        return res.status(403).json({ 
          success: false, 
          message: 'Employees can only edit phone and profile image' 
        });
      }
    }

    // HR Manager restrictions
    if (req.user.role === 'hr_manager') {
      if (role === 'super_admin') {
        return res.status(403).json({ 
          success: false, 
          message: 'HR Manager cannot assign Super Admin role' 
        });
      }
    }

    // Check circular reporting
    if (reportingManager && reportingManager !== employee.reportingManager?.toString()) {
      const isCircular = await checkCircularReporting(employee._id, reportingManager);
      if (isCircular) {
        return res.status(400).json({ 
          success: false, 
          message: 'Circular reporting detected' 
        });
      }
    }

    // Update fields
    if (name) employee.name = name;
    if (email) employee.email = email;
    if (phone) employee.phone = phone;
    if (department) employee.department = department;
    if (designation) employee.designation = designation;
    if (salary !== undefined) employee.salary = salary;
    if (status) employee.status = status;
    if (role && req.user.role !== 'employee') employee.role = role;
    if (reportingManager !== undefined && req.user.role !== 'employee') employee.reportingManager = reportingManager;
    if (profileImage !== undefined) employee.profileImage = profileImage;

    await employee.save();

    const populatedEmployee = await Employee.findById(employee._id).populate('reportingManager', 'name email employeeId');

    res.json({
      success: true,
      data: populatedEmployee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Delete employee (soft delete)
// @access  Private (Super Admin only)
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ 
      _id: req.params.id, 
      isDeleted: false 
    });

    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: 'Employee not found' 
      });
    }

    // HR Manager cannot delete Super Admin
    if (req.user.role === 'hr_manager' && employee.role === 'super_admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'HR Manager cannot delete Super Admin' 
      });
    }

    // Soft delete
    employee.isDeleted = true;
    employee.deletedAt = new Date();
    await employee.save();

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Update reporting manager
// @access  Private (HR Manager, Super Admin)
exports.updateManager = async (req, res) => {
  try {
    const { managerId } = req.body;

    const employee = await Employee.findOne({ 
      _id: req.params.id, 
      isDeleted: false 
    });

    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: 'Employee not found' 
      });
    }

    const manager = await Employee.findOne({ 
      _id: managerId, 
      isDeleted: false 
    });

    if (!manager) {
      return res.status(404).json({ 
        success: false, 
        message: 'Manager not found' 
      });
    }

    // Check circular reporting
    const isCircular = await checkCircularReporting(employee._id, managerId);
    if (isCircular) {
      return res.status(400).json({ 
        success: false, 
        message: 'Circular reporting detected' 
      });
    }

    employee.reportingManager = managerId;
    await employee.save();

    const populatedEmployee = await Employee.findById(employee._id).populate('reportingManager', 'name email employeeId');

    res.json({
      success: true,
      data: populatedEmployee
    });
  } catch (error) {
    console.error('Update manager error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get direct reports of an employee
// @access  Private
exports.getReportees = async (req, res) => {
  try {
    const reportees = await Employee.find({ 
      reportingManager: req.params.id, 
      isDeleted: false 
    }).populate('reportingManager', 'name email employeeId');

    res.json({
      success: true,
      data: reportees
    });
  } catch (error) {
    console.error('Get reportees error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
