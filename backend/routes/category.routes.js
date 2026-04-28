const router = require('express').Router();
const { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { protect, authorize, optionalAuth } = require('../middleware/auth.middleware');

router.get('/', optionalAuth, getCategories);
router.get('/:slug', getCategoryBySlug);
router.post('/', protect, authorize('admin'), createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;
