/**
 * Validation Middleware
 * Request validation using express-validator
 */

const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validations
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// Product validations
const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number')
    .custom(val => val >= 0).withMessage('Price cannot be negative'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  validate
];

// Category validations
const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  validate
];

// Order validations
const orderValidation = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product').notEmpty().withMessage('Product ID is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.name').trim().notEmpty().withMessage('Shipping name is required'),
  body('shippingAddress.email').trim().isEmail().withMessage('Valid email is required'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Phone is required'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').trim().notEmpty().withMessage('ZIP code is required'),
  validate
];

// Contact validations
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
    .isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  validate
];

// Review validations
const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Review comment is required')
    .isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters'),
  validate
];

// ID param validation
const idValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  productValidation,
  categoryValidation,
  orderValidation,
  contactValidation,
  reviewValidation,
  idValidation
};
