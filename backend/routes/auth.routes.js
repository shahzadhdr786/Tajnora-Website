const router = require('express').Router();
const { register, login, getMe, updateProfile, changePassword, toggleWishlist } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { registerValidation, loginValidation } = require('../middleware/validation.middleware');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/wishlist/:productId', protect, toggleWishlist);

module.exports = router;
