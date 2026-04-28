/**
 * Order Controller
 * Handles order creation, management, and tracking
 */
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(400).json({ success: false, message: `Product not found: ${item.product}` });
      if (product.stock < item.quantity) return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });

      orderItems.push({ product: product._id, name: product.name, image: product.images[0]?.url || '', price: product.price, quantity: item.quantity });
      subtotal += product.price * item.quantity;
      product.stock -= item.quantity;
      product.soldCount += item.quantity;
      await product.save();
    }

    const shippingCost = subtotal >= 999 ? 0 : 99;
    let discount = 0;
    if (couponCode && couponCode.toUpperCase() === 'TAJBARI20') discount = Math.round(subtotal * 0.20);
    const total = subtotal + shippingCost - discount;

    const order = await Order.create({ user: req.user.id, items: orderItems, shippingAddress, paymentMethod: paymentMethod || 'COD', subtotal, shippingCost, discount, couponCode: couponCode || '', total });
    await order.populate('user', 'name email');

    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find({ user: req.user.id }).sort('-createdAt').skip(skip).limit(parseInt(limit)).lean(),
      Order.countDocuments({ user: req.user.id })
    ]);
    res.json({ success: true, data: { orders, pagination: { current: parseInt(page), pages: Math.ceil(total / parseInt(limit)), total } } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Not authorized' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch order', error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, sort = '-createdAt' } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).populate('user', 'name email').sort(sort).skip(skip).limit(parseInt(limit)).lean(),
      Order.countDocuments(filter)
    ]);
    res.json({ success: true, data: { orders, pagination: { current: parseInt(page), pages: Math.ceil(total / parseInt(limit)), total } } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'Delivered') order.deliveredAt = new Date();
    if (status === 'Cancelled') {
      order.cancelledAt = new Date();
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity, soldCount: -item.quantity } });
      }
    }
    await order.save();
    res.json({ success: true, message: `Order status updated to ${status}`, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order', error: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
