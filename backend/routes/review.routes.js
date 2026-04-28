const router = require('express').Router();
const { getProductReviews, createReview, getAllReviews, approveReview, deleteReview } = require('../controllers/review.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, createReview);
router.get('/', protect, authorize('admin'), getAllReviews);
router.put('/:id/approve', protect, authorize('admin'), approveReview);
router.delete('/:id', protect, authorize('admin'), deleteReview);

module.exports = router;
