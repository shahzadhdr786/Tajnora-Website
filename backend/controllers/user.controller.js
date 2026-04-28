/**
 * User Controller (Admin)
 * Manages users from the admin panel
 */
const User = require('../models/User.model');

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort('-createdAt').skip(skip).limit(parseInt(limit)).lean(),
      User.countDocuments(filter)
    ]);
    res.json({ success: true, data: { users, pagination: { current: parseInt(page), pages: Math.ceil(total / parseInt(limit)), total } } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, role, isActive }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User updated successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot delete admin user' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
