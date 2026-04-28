const router = require('express').Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('admin'));
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
