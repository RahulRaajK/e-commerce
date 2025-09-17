import dbConnect from '../lib/dbConnect.js';
import Product from '../models/Product.js';

async function seedProducts() {
  try {
    await dbConnect();
    const count = await Product.countDocuments();
    if (count > 0) {
      console.log(`Products already exist: ${count}`);
      process.exit(0);
    }

    const mockProducts = [
      {
        name: 'Wireless Headphones',
        description: 'Noise-cancelling over-ear headphones with 30h battery life',
        price: 1999,
        image: 'https://images.unsplash.com/photo-1518443895914-6b7926b31f12?q=80&w=1200&auto=format&fit=crop',
        stock: 25,
        category: 'Electronics'
      },
      {
        name: 'Smartwatch Pro',
        description: 'Fitness tracking, notifications, and heart-rate monitor',
        price: 3499,
        image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1200&auto=format&fit=crop',
        stock: 40,
        category: 'Electronics'
      },
      {
        name: 'Classic Cotton T-Shirt',
        description: 'Premium 100% cotton tee, breathable and soft',
        price: 599,
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop',
        stock: 120,
        category: 'Clothing'
      },
      {
        name: 'Modern Desk Lamp',
        description: 'Adjustable LED lamp with touch dimmer controls',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1200&auto=format&fit=crop',
        stock: 60,
        category: 'Home & Garden'
      }
    ];

    const result = await Product.insertMany(mockProducts);
    console.log(`Inserted ${result.length} products.`);
    const newCount = await Product.countDocuments();
    console.log(`Total products now: ${newCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();


