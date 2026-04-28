/**
 * Category Controller
 * CRUD operations for product categories
 */

const Category = require('../models/Category.model');
const Product = require('../models/Product.model');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res) => {
  try {
    const { active } = req.query;
    const filter = {};
    
    // Only show active categories for public requests
    if (active !== undefined) {
      filter.isActive = active === 'true';
    } else if (!req.user || req.user.role !== 'admin') {
      filter.isActive = true;
    }

    const categories = await Category.find(filter)
      .populate('productCount')
      .sort('sortOrder name')
      .lean();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
};

/**
 * @desc    Get single category by slug
 * @route   GET /api/categories/:slug
 * @access  Public
 */
const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('productCount');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message
    });
  }
};

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

/**
 * @desc    Update a category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = async (req, res) => {
  try {
    // Check if category has products
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${productCount} associated products. Move or delete products first.`
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
};

module.exports = { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
