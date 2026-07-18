const { body } = require('express-validator');

exports.employeeValidation = [
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('department').isIn(['Engineering', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'IT', 'Legal']).withMessage('Invalid department'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('salary').isNumeric().withMessage('Salary must be a number'),
  body('joiningDate').isISO8601().withMessage('Valid joining date is required'),
  body('role').isIn(['super_admin', 'hr_manager', 'employee']).withMessage('Invalid role')
];

exports.employeeUpdateValidation = [
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().notEmpty().withMessage('Phone is required'),
  body('department').optional().isIn(['Engineering', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'IT', 'Legal']).withMessage('Invalid department'),
  body('salary').optional().isNumeric().withMessage('Salary must be a number'),
  body('role').optional().isIn(['super_admin', 'hr_manager', 'employee']).withMessage('Invalid role')
];

exports.managerUpdateValidation = [
  body('managerId').notEmpty().withMessage('Manager ID is required')
];

exports.loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

exports.registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('department').isIn(['Engineering', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'IT', 'Legal']).withMessage('Invalid department'),
  body('designation').notEmpty().withMessage('Designation is required'),
  body('salary').isNumeric().withMessage('Salary must be a number'),
  body('joiningDate').isISO8601().withMessage('Valid joining date is required')
];
