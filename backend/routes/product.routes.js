const router = require('express').Router();
const { getProducts, getProductBySlug, getProductById, createProduct, updateProduct, deleteProduct, getFeaturedProducts, searchProducts } = require('../controllers/product.controller');
const { protect, authorize, optionalAuth } = require('../middleware/auth.middleware');

router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/', optionalAuth, getProducts);
router.get('/:slug', getProductBySlug);
router.get('/id/:id', protect, authorize('admin'), getProductById);
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
