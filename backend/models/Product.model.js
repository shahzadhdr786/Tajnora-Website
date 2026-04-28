/**
 * Product Model
 * Handles product data for the e-commerce jewelry store
 */

const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  compareAtPrice: {
    type: Number,
    default: 0,
    min: [0, 'Compare price cannot be negative']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  material: {
    type: String,
    default: ''
  },
  weight: {
    type: String,
    default: ''
  },
  dimensions: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  views: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  },
  metaTitle: {
    type: String,
    default: ''
  },
  metaDescription: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create indexes for efficient queries
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Generate slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  // Calculate discount percentage
  if (this.compareAtPrice > 0 && this.price < this.compareAtPrice) {
    this.discount = Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  next();
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0]?.url || '');
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
