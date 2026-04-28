/**
 * Review Model
 * Handles product reviews and ratings
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews from same user on same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to calculate average rating for a product
reviewSchema.statics.calculateAverageRating = async function(productId) {
  const result = await this.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        ratingCount: { $sum: 1 }
      }
    }
  ]);

  const Product = mongoose.model('Product');
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      'ratings.average': Math.round(result[0].averageRating * 10) / 10,
      'ratings.count': result[0].ratingCount
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      'ratings.average': 0,
      'ratings.count': 0
    });
  }
};

// Update product ratings after save
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.product);
});

// Update product ratings after remove
reviewSchema.post('deleteOne', { document: true }, function() {
  this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
