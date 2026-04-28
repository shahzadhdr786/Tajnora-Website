const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { upload, setUploadType } = require('../middleware/upload.middleware');

// Upload product images
router.post('/product', protect, authorize('admin'), setUploadType('product'), upload.array('images', 5), (req, res) => {
  try {
    const files = req.files.map(file => ({
      url: `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`,
      filename: file.filename,
      size: file.size
    }));
    res.json({ success: true, message: `${files.length} file(s) uploaded`, data: files });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
});

// Upload category image
router.post('/category', protect, authorize('admin'), setUploadType('category'), upload.single('image'), (req, res) => {
  try {
    const file = { url: `${req.protocol}://${req.get('host')}/uploads/categories/${req.file.filename}`, filename: req.file.filename };
    res.json({ success: true, data: file });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
});

// Upload avatar
router.post('/avatar', protect, setUploadType('avatar'), upload.single('avatar'), (req, res) => {
  try {
    const file = { url: `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}` };
    res.json({ success: true, data: file });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
});

module.exports = router;
