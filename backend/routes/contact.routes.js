const router = require('express').Router();
const { submitContact, getContacts, markAsRead, deleteContact } = require('../controllers/contact.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { contactValidation } = require('../middleware/validation.middleware');

router.post('/', contactValidation, submitContact);
router.get('/', protect, authorize('admin'), getContacts);
router.put('/:id/read', protect, authorize('admin'), markAsRead);
router.delete('/:id', protect, authorize('admin'), deleteContact);

module.exports = router;
