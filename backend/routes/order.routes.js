const router = require('express').Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
