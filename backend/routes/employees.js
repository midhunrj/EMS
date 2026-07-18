const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { employeeValidation, employeeUpdateValidation, managerUpdateValidation } = require('../middleware/validators');
const employeeController = require('../controllers/employeeController');

const router = express.Router();

router.get('/', protect, employeeController.getEmployees);
router.get('/:id', protect, employeeController.getEmployeeById);
router.post('/', protect, authorize('hr_manager', 'super_admin'), employeeValidation, validate, employeeController.createEmployee);
router.put('/:id', protect, employeeUpdateValidation, validate, employeeController.updateEmployee);
router.delete('/:id', protect, authorize('hr_manager', 'super_admin'), employeeController.deleteEmployee);
router.patch('/:id/manager', protect, authorize('hr_manager', 'super_admin'), managerUpdateValidation, validate, employeeController.updateManager);
router.get('/:id/reportees', protect, employeeController.getReportees);

module.exports = router;
