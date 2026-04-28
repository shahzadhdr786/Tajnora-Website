const router = require('express').Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/stats', protect, authorize('admin'), getDashboardStats);

module.exports = router;
