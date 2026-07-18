const express = require('express');
const { protect } = require('../middleware/auth');
const organizationController = require('../controllers/organizationController');

const router = express.Router();

router.get('/tree', protect, organizationController.getTree);
router.get('/stats', protect, organizationController.getStats);

module.exports = router;
