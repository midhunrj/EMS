const express = require('express');
const Employee = require('../models/Employee');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Helper function to build organization tree
const buildTree = async (managerId = null) => {
  const employees = await Employee.find({ 
    reportingManager: managerId, 
    isDeleted: false 
  }).populate('reportingManager', 'name email employeeId');

  const tree = await Promise.all(employees.map(async (employee) => {
    const employeeObj = employee.toObject();
    employeeObj.reportees = await buildTree(employee._id);
    return employeeObj;
  }));

  return tree;
};

// @route   GET /api/organization/tree
// @desc    Get organization hierarchy tree
// @access  Private
router.get('/tree', protect, async (req, res) => {
  try {
    // Get all employees without a reporting manager (top level)
    const topLevelEmployees = await Employee.find({ 
      reportingManager: null, 
      isDeleted: false 
    }).populate('reportingManager', 'name email employeeId');

    const tree = await Promise.all(topLevelEmployees.map(async (employee) => {
      const employeeObj = employee.toObject();
      employeeObj.reportees = await buildTree(employee._id);
      return employeeObj;
    }));

    res.json({
      success: true,
      data: tree
    });
  } catch (error) {
    console.error('Get organization tree error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/organization/stats
// @desc    Get organization statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments({ isDeleted: false });
    const activeEmployees = await Employee.countDocuments({ isDeleted: false, status: 'active' });
    const inactiveEmployees = await Employee.countDocuments({ isDeleted: false, status: 'inactive' });

    const departmentStats = await Employee.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const roleStats = await Employee.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        departmentStats,
        roleStats
      }
    });
  } catch (error) {
    console.error('Get organization stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
