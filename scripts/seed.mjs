/**
 * Seed script — run with: node scripts/seed.mjs
 * Requires MONGODB_URI in environment or .env file
 *
 * Creates:
 *  - 1 admin user (admin@gemstone.com / admin123)
 *  - 1 regular user (user@gemstone.com / user123)
 *  - 2 categories (diamonds, gemstones)
 *  - 4 subcategories
 *  - 50 sample products
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pratiptest_db_user:pratipkayalgemstone@cluster0.yoh1ght.mongodb.net/gemstone-shop';

// ── Minimal inline schemas (no TypeScript required for seed) ──────────────────
const UserSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String });
const CategorySchema = new mongoose.Schema({ name: String, slug: String, isActive: Boolean });
const SubcategorySchema = new mongoose.Schema({ name: String, slug: String, category: mongoose.Schema.Types.ObjectId, isActive: Boolean });
const ProductSchema = new mongoose.Schema({
  name: String, category: mongoose.Schema.Types.ObjectId,
  subcategory: mongoose.Schema.Types.ObjectId, price: Number,
  shape: String, size: Number, color: String, clarity: String,
  certification: String, images: [String], stock: Number,
  isActive: Boolean, description: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Subcategory = mongoose.models.Subcategory || mongoose.model('Subcategory', SubcategorySchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const SHAPES = ['round', 'oval', 'princess', 'cushion', 'emerald', 'pear', 'marquise'];
const COLORS = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
const CLARITIES = ['FL', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
const CERTS = ['GIA', 'AGS', 'IGI', 'none'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randNum(min, max, decimals = 2) { return parseFloat((Math.random() * (max - min) + min).toFixed(decimals)); }

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clean
  await Promise.all([User.deleteMany({}), Category.deleteMany({}), Subcategory.deleteMany({}), Product.deleteMany({})]);
  console.log('Cleared existing data');

  // Users
  const adminPw = await bcrypt.hash('admin123', 12);
  const userPw = await bcrypt.hash('user123', 12);
  await User.insertMany([
    { name: 'Admin', email: 'admin@gemstone.com', password: adminPw, role: 'admin' },
    { name: 'Test User', email: 'user@gemstone.com', password: userPw, role: 'user' },
  ]);
  console.log('✅ Users created');

  // Categories
  const [diamonds, gemstones] = await Category.insertMany([
    { name: 'Diamonds', slug: 'diamonds', isActive: true },
    { name: 'Gemstones', slug: 'gemstones', isActive: true },
  ]);
  console.log('✅ Categories created');

  // Subcategories
  const [loose, rings, rubies, emeralds] = await Subcategory.insertMany([
    { name: 'Loose Diamonds', slug: 'loose-diamonds', category: diamonds._id, isActive: true },
    { name: 'Diamond Rings', slug: 'diamond-rings', category: diamonds._id, isActive: true },
    { name: 'Rubies', slug: 'rubies', category: gemstones._id, isActive: true },
    { name: 'Emeralds', slug: 'emeralds', category: gemstones._id, isActive: true },
  ]);
  console.log('✅ Subcategories created');

  // Products
  const products = [];
  for (let i = 0; i < 50; i++) {
    const isDiamond = i < 35;
    const shape = rand(SHAPES);
    const color = rand(COLORS);
    const clarity = rand(CLARITIES);
    const size = randNum(0.3, 5.0, 2);
    const cert = rand(CERTS);

    // Realistic price based on size + quality
    const qualityMultiplier = CLARITIES.indexOf(clarity) < 3 ? 1.5 : 1;
    const colorMultiplier = COLORS.indexOf(color) < 4 ? 1.4 : 1;
    const price = Math.round(size * 2000 * qualityMultiplier * colorMultiplier * (0.8 + Math.random() * 0.4));

    products.push({
      name: isDiamond
        ? `${shape.charAt(0).toUpperCase() + shape.slice(1)} Diamond ${size}ct ${color}/${clarity}${cert !== 'none' ? ` ${cert}` : ''}`
        : `${size}ct ${i % 2 === 0 ? 'Ruby' : 'Emerald'} ${rand(['Oval', 'Round', 'Cushion'])}`,
      category: isDiamond ? diamonds._id : gemstones._id,
      subcategory: isDiamond ? (i < 20 ? loose._id : rings._id) : (i % 2 === 0 ? rubies._id : emeralds._id),
      price,
      shape,
      size,
      color: isDiamond ? color : rand(['fancy-red', 'fancy-green', 'other']),
      clarity,
      certification: cert,
      images: [],
      stock: Math.floor(Math.random() * 20) + 1,
      isActive: true,
      description: `Beautiful ${shape} cut ${isDiamond ? 'diamond' : 'gemstone'} with excellent brilliance.`,
    });
  }

  await Product.insertMany(products);
  console.log('✅ 50 products created');

  console.log('\n🎉 Seed complete!');
  console.log('Admin: admin@gemstone.com / admin123');
  console.log('User:  user@gemstone.com / user123');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
