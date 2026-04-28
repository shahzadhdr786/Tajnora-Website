/**
 * Review Controller
 */
const Review = require('../models/Review.model');

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'name avatar').sort('-createdAt').lean();
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews', error: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const existing = await Review.findOne({ product: req.params.productId, user: req.user.id });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    const review = await Review.create({ ...req.body, product: req.params.productId, user: req.user.id });
    res.status(201).json({ success: true, message: 'Review submitted for approval', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create review', error: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const { approved } = req.query;
    const filter = {};
    if (approved !== undefined) filter.isApproved = approved === 'true';
    const reviews = await Review.find(filter).populate('user', 'name email').populate('product', 'name slug').sort('-createdAt').lean();
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews', error: error.message });
  }
};

const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review approved', data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to approve review', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete review', error: error.message });
  }
};

module.exports = { getProductReviews, createReview, getAllReviews, approveReview, deleteReview };
