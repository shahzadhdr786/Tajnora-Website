/**
 * Database Seeder - Tajnora Jewelry Store
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Category = require('../models/Category.model');
const Product = require('../models/Product.model');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany()]);
    console.log('Cleared existing data');

    // Admin
    const admin = await User.create({ name: 'Admin', email: process.env.ADMIN_EMAIL || 'admin@tajnora.com', password: process.env.ADMIN_PASSWORD || 'Admin@123456', role: 'admin' });
    console.log('Admin:', admin.email);
    await User.create({ name: 'Test User', email: 'user@tajnora.com', password: 'User@123456', role: 'user' });

    // Categories (use create to trigger pre-save slug)
    const bracelets = await Category.create({ name: 'Bracelets', description: 'Elegant bracelets crafted with premium materials', sortOrder: 1 });
    const earrings = await Category.create({ name: 'Earrings', description: 'Statement earrings for every occasion', sortOrder: 2 });
    const rings = await Category.create({ name: 'Rings', description: 'Minimalist and statement rings', sortOrder: 3 });
    const necklaces = await Category.create({ name: 'Necklaces', description: 'Delicate necklaces and chains', sortOrder: 4 });
    const premium = await Category.create({ name: 'Tajbari Premium', description: 'Premium luxury collection', sortOrder: 5 });
    console.log('Categories: 5');

    // Products
    const products = [
      { name: 'Floral Crest Bracelet 18K Gold Plated Anti Tarnish', description: 'A stunning floral crest bracelet featuring 18K gold plating with anti-tarnish coating.', price: 780, compareAtPrice: 1950, category: bracelets._id, images: [{ url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400', alt: 'Floral Bracelet', isPrimary: true }], tags: ['gold','bracelet','floral'], material: '18K Gold Plated Brass', stock: 50, isFeatured: true, isNewArrival: true, ratings: { average: 4.5, count: 12 } },
      { name: 'Fluid Loop Sculpt Bracelet 18K Gold Plated', description: 'Modern fluid loop design with sculpted finish.', price: 599, compareAtPrice: 998, category: bracelets._id, images: [{ url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400', alt: 'Loop Bracelet', isPrimary: true }], tags: ['gold','bracelet'], material: '18K Gold Plated', stock: 35, isFeatured: true, ratings: { average: 4.3, count: 8 } },
      { name: 'Matte Silver Square Bracelet Anti Tarnish', description: 'Minimalist matte silver bracelet with square design.', price: 499, compareAtPrice: 831, category: bracelets._id, images: [{ url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', alt: 'Silver Bracelet', isPrimary: true }], tags: ['silver','bracelet'], material: 'Silver Plated', stock: 40, isFeatured: true, ratings: { average: 4.7, count: 15 } },
      { name: 'Orbit Sphere Minimal Bracelet 18K Gold', description: 'Elegant orbit sphere design. Minimal yet striking.', price: 780, compareAtPrice: 1950, category: bracelets._id, images: [{ url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400', alt: 'Orbit Bracelet', isPrimary: true }], tags: ['gold','bracelet'], material: '18K Gold Plated', stock: 25, isBestSeller: true, ratings: { average: 4.6, count: 20 } },
      { name: 'Evil Eye Bracelet Black Enamel 18K Gold', description: 'Protective evil eye bracelet with black enamel.', price: 702, compareAtPrice: 1155, category: bracelets._id, images: [{ url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', alt: 'Evil Eye Bracelet', isPrimary: true }], tags: ['gold','bracelet','evil-eye'], material: '18K Gold Plated', stock: 30, ratings: { average: 4.4, count: 10 } },
      { name: 'Statement Geometric Drop Earrings Mixed Metal', description: 'Bold geometric drop earrings with mixed metal finish.', price: 650, compareAtPrice: 1300, category: earrings._id, images: [{ url: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400', alt: 'Geometric Earrings', isPrimary: true }], tags: ['earrings','geometric'], material: 'Mixed Metal', stock: 45, isFeatured: true, isNewArrival: true, ratings: { average: 4.8, count: 22 } },
      { name: 'Abstract Hammered Organic Drop Earrings', description: 'Hand-hammered organic shapes create unique statement earrings.', price: 850, compareAtPrice: 1700, category: earrings._id, images: [{ url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400', alt: 'Hammered Earrings', isPrimary: true }], tags: ['earrings','hammered'], material: '18K Gold Plated', stock: 20, isBestSeller: true, ratings: { average: 4.9, count: 18 } },
      { name: 'Elegant Organic Teardrop Pearl Studs', description: 'Delicate teardrop pearl studs with organic gold framing.', price: 550, compareAtPrice: 1100, category: earrings._id, images: [{ url: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400', alt: 'Pearl Studs', isPrimary: true }], tags: ['earrings','pearl'], material: 'Gold Plated with Pearl', stock: 60, isFeatured: true, ratings: { average: 4.5, count: 14 } },
      { name: 'Matte Gold Chunky Hoop Earrings', description: 'Bold chunky hoops with matte gold finish.', price: 750, compareAtPrice: 1500, category: earrings._id, images: [{ url: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400', alt: 'Hoop Earrings', isPrimary: true }], tags: ['earrings','hoop','gold'], material: 'Matte Gold Plated', stock: 35, ratings: { average: 4.6, count: 11 } },
      { name: 'Textured Serpent Spiral Statement Ring', description: 'Striking serpent-inspired spiral ring with texture.', price: 620, compareAtPrice: 1240, category: rings._id, images: [{ url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', alt: 'Serpent Ring', isPrimary: true }], tags: ['ring','serpent'], material: '18K Gold Plated', stock: 40, isFeatured: true, ratings: { average: 4.7, count: 16 } },
      { name: 'Pearl-Accented Golden Floral Ring', description: 'Delicate floral ring with pearl accent.', price: 580, compareAtPrice: 1160, category: rings._id, images: [{ url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400', alt: 'Floral Ring', isPrimary: true }], tags: ['ring','pearl','floral'], material: 'Gold Plated with Pearl', stock: 30, isNewArrival: true, ratings: { average: 4.4, count: 9 } },
      { name: 'Minimalist Triple Band Ring', description: 'Three-tiered band ring. Modern and elegant.', price: 450, compareAtPrice: 900, category: rings._id, images: [{ url: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=400', alt: 'Band Ring', isPrimary: true }], tags: ['ring','minimalist'], material: 'Silver Plated', stock: 55, isBestSeller: true, ratings: { average: 4.8, count: 25 } },
      { name: 'Liquid Curve Minimal Cuff 18K Gold', description: 'Fluid liquid curve cuff bracelet.', price: 890, compareAtPrice: 1780, category: premium._id, images: [{ url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400', alt: 'Liquid Cuff', isPrimary: true }], tags: ['premium','cuff','gold'], material: '18K Gold Premium', stock: 15, isFeatured: true, isBestSeller: true, ratings: { average: 4.9, count: 30 } },
      { name: 'Matte Pearl End Cuff 18K Gold', description: 'Premium cuff with pearl end caps.', price: 950, compareAtPrice: 1900, category: premium._id, images: [{ url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400', alt: 'Pearl Cuff', isPrimary: true }], tags: ['premium','cuff','pearl'], material: '18K Gold Plated with Pearl', stock: 10, isFeatured: true, ratings: { average: 5.0, count: 8 } },
      { name: 'Delicate Chain Layered Necklace Gold', description: 'Beautiful layered necklace with delicate chains.', price: 720, compareAtPrice: 1440, category: necklaces._id, images: [{ url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400', alt: 'Layered Necklace', isPrimary: true }], tags: ['necklace','layered','gold'], material: '18K Gold Plated', stock: 25, isFeatured: true, isNewArrival: true, ratings: { average: 4.6, count: 13 } },
      { name: 'Pearl Pendant Choker Necklace', description: 'Elegant choker with central pearl pendant.', price: 680, compareAtPrice: 1360, category: necklaces._id, images: [{ url: 'https://images.unsplash.com/photo-1515562141589-67f0d727b750?w=400', alt: 'Pearl Choker', isPrimary: true }], tags: ['necklace','choker','pearl'], material: 'Gold Plated with Pearl', stock: 20, ratings: { average: 4.3, count: 7 } },
    ];

    for (const p of products) { await Product.create(p); }
    console.log('Products:', products.length);

    console.log('\n✅ Database seeded!\n');
    console.log('Admin: admin@tajnora.com / Admin@123456');
    console.log('User: user@tajnora.com / User@123456');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seedDatabase();
