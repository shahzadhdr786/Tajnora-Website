/**
 * Product Controller
 * Full CRUD operations for products with filtering, pagination, and search
 */

const Product = require('../models/Product.model');
const Category = require('../models/Category.model');

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      category,
      minPrice,
      maxPrice,
      search,
      isFeatured,
      isNewArrival,
      isBestSeller,
      tags,
      isActive
    } = req.query;

    // Build filter object
    const filter = {};

    // Default: only active products for public requests
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    } else if (!req.user || req.user.role !== 'admin') {
      filter.isActive = true;
    }

    // Category filter
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) filter.category = cat._id;
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Boolean filters
    if (isFeatured === 'true') filter.isFeatured = true;
    if (isNewArrival === 'true') filter.isNewArrival = true;
    if (isBestSeller === 'true') filter.isBestSeller = true;

    // Tags filter
    if (tags) {
      filter.tags = { $in: tags.split(',').map(t => t.trim()) };
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total,
          limit: limitNum,
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

/**
 * @desc    Get single product by slug
 * @route   GET /api/products/:slug
 * @access  Public
 */
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    // Get related products
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true
    })
      .limit(4)
      .select('name slug price compareAtPrice images ratings')
      .lean();

    res.json({
      success: true,
      data: { product, relatedProducts }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

/**
 * @desc    Get product by ID (admin)
 * @route   GET /api/products/id/:id
 * @access  Private/Admin
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    await product.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .sort('-createdAt')
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products',
      error: error.message
    });
  }
};

/**
 * @desc    Search products
 * @route   GET /api/products/search
 * @access  Public
 */
const searchProducts = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ],
      isActive: true
    })
      .populate('category', 'name slug')
      .limit(parseInt(limit))
      .select('name slug price compareAtPrice images ratings category')
      .lean();

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  searchProducts
};
