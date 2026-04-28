/**
 * File Upload Middleware
 * Handles image and video uploads using Multer
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = ['uploads', 'uploads/products', 'uploads/categories', 'uploads/avatars'];
uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let uploadPath = 'uploads/';
    if (req.uploadType === 'product') uploadPath = 'uploads/products/';
    else if (req.uploadType === 'category') uploadPath = 'uploads/categories/';
    else if (req.uploadType === 'avatar') uploadPath = 'uploads/avatars/';
    
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter - allow only images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp, svg) are allowed'));
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  }
});

// Middleware to set upload type
const setUploadType = (type) => (req, res, next) => {
  req.uploadType = type;
  next();
};

module.exports = { upload, setUploadType };
