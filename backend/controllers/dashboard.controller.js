/**
 * Dashboard Controller
 * Provides stats and analytics for the admin panel
 */
const Product = require('../models/Product.model');
const Order = require('../models/Order.model');
const User = require('../models/User.model');
const Category = require('../models/Category.model');
const Contact = require('../models/Contact.model');

const getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, totalCategories, unreadContacts, recentOrders, revenue, ordersByStatus] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Category.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Order.find().sort('-createdAt').limit(5).populate('user', 'name email').lean(),
      Order.aggregate([{ $match: { status: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
    ]);

    // Monthly revenue for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: { $ne: 'Cancelled' } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalProducts, totalOrders, totalUsers, totalCategories, unreadContacts,
        totalRevenue: revenue[0]?.total || 0,
        recentOrders,
        ordersByStatus: ordersByStatus.reduce((acc, item) => { acc[item._id] = item.count; return acc; }, {}),
        monthlyRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

module.exports = { getDashboardStats };
