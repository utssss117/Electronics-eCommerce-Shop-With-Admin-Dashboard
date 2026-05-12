const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');

const connectDB = require('./config/db');

const products = [
  {
    name: 'iPhone 15 Pro Max',
    description: 'The most powerful iPhone ever. Features A17 Pro chip, 48MP camera system with 5x optical zoom, titanium design, and all-day battery life. Experience console-level gaming and stunning computational photography.',
    price: 1199,
    originalPrice: 1299,
    category: 'Smartphones',
    brand: 'Apple',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop'],
    featured: true,
    rating: 4.8,
    numReviews: 234,
    specs: { 'Display': '6.7" Super Retina XDR', 'Chip': 'A17 Pro', 'Storage': '256GB', 'Camera': '48MP Main', 'Battery': '4441 mAh' }
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI is here. Titanium frame with built-in S Pen, 200MP camera, and AI-powered features including Circle to Search and Live Translate. The ultimate smartphone experience.',
    price: 1299,
    originalPrice: 1419,
    category: 'Smartphones',
    brand: 'Samsung',
    stock: 45,
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop'],
    featured: true,
    rating: 4.7,
    numReviews: 189,
    specs: { 'Display': '6.8" Dynamic AMOLED 2X', 'Chip': 'Snapdragon 8 Gen 3', 'Storage': '256GB', 'Camera': '200MP Main', 'Battery': '5000 mAh' }
  },
  {
    name: 'MacBook Pro 16" M3 Max',
    description: 'Supercharged by M3 Max. Up to 128GB unified memory for breakthrough performance. Stunning Liquid Retina XDR display, up to 22 hours of battery life, and the most advanced pro laptop ever.',
    price: 3499,
    originalPrice: 3699,
    category: 'Laptops',
    brand: 'Apple',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'],
    featured: true,
    rating: 4.9,
    numReviews: 156,
    specs: { 'Chip': 'Apple M3 Max', 'RAM': '36GB Unified', 'Storage': '1TB SSD', 'Display': '16.2" Liquid Retina XDR', 'Battery': '22 hours' }
  },
  {
    name: 'Dell XPS 15 (2024)',
    description: 'Premium performance in a stunning design. 13th Gen Intel Core i9, NVIDIA RTX 4070, 4K OLED InfinityEdge display. Perfect for creative professionals and power users.',
    price: 2199,
    originalPrice: 2499,
    category: 'Laptops',
    brand: 'Dell',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop'],
    featured: false,
    rating: 4.6,
    numReviews: 98,
    specs: { 'Processor': 'Intel Core i9-13900H', 'GPU': 'NVIDIA RTX 4070', 'RAM': '32GB DDR5', 'Storage': '1TB SSD', 'Display': '15.6" 4K OLED' }
  },
  {
    name: 'iPad Pro 12.9" M2',
    description: 'The ultimate iPad experience. M2 chip, Liquid Retina XDR display with ProMotion, Apple Pencil hover, and Wi-Fi 6E. More powerful than most laptops.',
    price: 1099,
    originalPrice: 1199,
    category: 'Tablets',
    brand: 'Apple',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop'],
    featured: true,
    rating: 4.8,
    numReviews: 167,
    specs: { 'Chip': 'Apple M2', 'Display': '12.9" Liquid Retina XDR', 'Storage': '256GB', 'Camera': '12MP Wide + 10MP Ultra Wide', 'Connectivity': 'Wi-Fi 6E' }
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones. 30-hour battery life and ultra-comfortable design.',
    price: 349,
    originalPrice: 399,
    category: 'Audio',
    brand: 'Sony',
    stock: 100,
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop'],
    featured: true,
    rating: 4.7,
    numReviews: 312,
    specs: { 'Driver': '30mm', 'ANC': 'Adaptive Auto NC', 'Battery': '30 hours', 'Codec': 'LDAC, AAC, SBC', 'Weight': '250g' }
  },
  {
    name: 'AirPods Pro (2nd Gen)',
    description: 'Rebuilt from the ground up. Featuring the H2 chip for smarter noise cancellation, Adaptive Transparency, Personalized Spatial Audio, and a MagSafe charging case with precision finding.',
    price: 249,
    originalPrice: 279,
    category: 'Audio',
    brand: 'Apple',
    stock: 150,
    images: ['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop'],
    featured: false,
    rating: 4.6,
    numReviews: 456,
    specs: { 'Chip': 'H2', 'ANC': 'Active Noise Cancellation', 'Battery': '6 hours (30 with case)', 'Water Resistance': 'IPX4', 'Spatial Audio': 'Yes' }
  },
  {
    name: 'Sony Alpha A7 IV',
    description: 'The new standard in full-frame cameras. 33MP Exmor R sensor, BIONZ XR processor, 4K 60p video, real-time Eye AF for humans, animals, and birds. Perfect for hybrid shooters.',
    price: 2498,
    originalPrice: 2698,
    category: 'Cameras',
    brand: 'Sony',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop'],
    featured: false,
    rating: 4.8,
    numReviews: 87,
    specs: { 'Sensor': '33MP Full-Frame', 'Video': '4K 60p', 'AF Points': '759', 'ISO Range': '100-51200', 'Stabilization': '5-axis IBIS' }
  },
  {
    name: 'PlayStation 5 Pro',
    description: 'The most powerful PlayStation ever. Enhanced GPU with ray tracing, 2TB SSD, 8K gaming support, and PS VR2 ready. Experience gaming like never before with haptic feedback and adaptive triggers.',
    price: 699,
    originalPrice: 749,
    category: 'Gaming',
    brand: 'Sony',
    stock: 35,
    images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop'],
    featured: true,
    rating: 4.9,
    numReviews: 523,
    specs: { 'CPU': 'AMD Zen 2 (Enhanced)', 'GPU': 'RDNA 3', 'RAM': '16GB GDDR6', 'Storage': '2TB SSD', 'Output': 'Up to 8K' }
  },
  {
    name: 'Nintendo Switch OLED',
    description: 'Play at home or on the go with a vibrant 7-inch OLED screen. Features enhanced audio, wide adjustable stand, dock with wired LAN port, and 64GB internal storage.',
    price: 349,
    originalPrice: 369,
    category: 'Gaming',
    brand: 'Nintendo',
    stock: 60,
    images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=400&fit=crop'],
    featured: false,
    rating: 4.5,
    numReviews: 289,
    specs: { 'Display': '7" OLED', 'Storage': '64GB', 'Battery': '4.5-9 hours', 'Weight': '420g', 'Connectivity': 'Wi-Fi, Bluetooth 4.1' }
  },
  {
    name: 'Apple Watch Ultra 2',
    description: 'The most rugged and capable Apple Watch. Precision dual-frequency GPS, up to 36 hours of battery life, 3000-nit display, and advanced health and fitness features for extreme athletes.',
    price: 799,
    originalPrice: 849,
    category: 'Wearables',
    brand: 'Apple',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop'],
    featured: true,
    rating: 4.7,
    numReviews: 145,
    specs: { 'Display': '49mm Always-On Retina', 'Chip': 'S9 SiP', 'Battery': '36 hours', 'Water Resistance': '100m', 'GPS': 'Dual-frequency L1/L5' }
  },
  {
    name: 'Samsung Galaxy Watch 6 Classic',
    description: 'The classic smartwatch reimagined. Rotating bezel, sapphire crystal glass, advanced sleep coaching, body composition analysis, and seamless Galaxy ecosystem integration.',
    price: 399,
    originalPrice: 429,
    category: 'Wearables',
    brand: 'Samsung',
    stock: 55,
    images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop'],
    featured: false,
    rating: 4.4,
    numReviews: 178,
    specs: { 'Display': '1.47" Super AMOLED', 'Processor': 'Exynos W930', 'Battery': '425 mAh', 'Water Resistance': '5ATM + IP68', 'OS': 'Wear OS 4' }
  },
  {
    name: 'Razer BlackWidow V4 Pro',
    description: 'The ultimate mechanical gaming keyboard. Razer Green switches, per-key RGB with underglow, magnetic wrist rest, command dial, and up to 8000Hz polling rate.',
    price: 229,
    originalPrice: 259,
    category: 'Accessories',
    brand: 'Razer',
    stock: 75,
    images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop'],
    featured: false,
    rating: 4.5,
    numReviews: 134,
    specs: { 'Switches': 'Razer Green Mechanical', 'Lighting': 'Per-key Razer Chroma RGB', 'Polling Rate': 'Up to 8000Hz', 'Wrist Rest': 'Magnetic Leatherette', 'Connectivity': 'USB-C' }
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'The master of precision. 8000 DPI sensor, quiet clicks, MagSpeed scroll wheel, and ergonomic design. Works on any surface including glass. Connect up to 3 devices.',
    price: 99,
    originalPrice: 109,
    category: 'Accessories',
    brand: 'Logitech',
    stock: 120,
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop'],
    featured: false,
    rating: 4.6,
    numReviews: 267,
    specs: { 'Sensor': '8000 DPI Darkfield', 'Battery': '70 days', 'Connectivity': 'Bluetooth + USB receiver', 'Buttons': '7 programmable', 'Charging': 'USB-C' }
  },
  {
    name: 'LG C3 65" OLED 4K TV',
    description: 'Perfect blacks, infinite contrast. Self-lit OLED pixels, α9 Gen6 AI Processor, Dolby Vision & Atmos, 120Hz refresh rate, and webOS 23. The ultimate cinematic experience for your living room.',
    price: 1799,
    originalPrice: 2099,
    category: 'Accessories',
    brand: 'LG',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop'],
    featured: true,
    rating: 4.8,
    numReviews: 198,
    specs: { 'Display': '65" OLED evo', 'Resolution': '4K UHD (3840x2160)', 'Refresh Rate': '120Hz', 'HDR': 'Dolby Vision, HDR10, HLG', 'Processor': 'α9 Gen6 AI 4K' }
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@electroshop.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log(`👤 Admin user created: admin@electroshop.com / admin123`);

    // Create regular user
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user'
    });
    console.log(`👤 Regular user created: john@example.com / user123`);

    // Create products
    await Product.insertMany(products);
    console.log(`📦 ${products.length} products seeded successfully`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin: admin@electroshop.com / admin123');
    console.log('   User:  john@example.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
