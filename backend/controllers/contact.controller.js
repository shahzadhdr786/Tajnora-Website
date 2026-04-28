/**
 * Contact Controller
 */
const Contact = require('../models/Contact.model');

const submitContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, message: 'Message sent successfully! We will get back to you soon.', data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const { isRead } = req.query;
    const filter = {};
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    const contacts = await Contact.find(filter).sort('-createdAt').lean();
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch contacts', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update contact', error: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete contact', error: error.message });
  }
};

module.exports = { submitContact, getContacts, markAsRead, deleteContact };
