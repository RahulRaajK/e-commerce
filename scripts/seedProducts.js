import dbConnect from '../lib/dbConnect.js';
import Product from '../models/Product.js';

async function seedProducts() {
  try {
    await dbConnect();
    const mockProducts = [
      {
        name: 'ROG Phone',
        description: 'Gaming smartphone with high-refresh display and performance cooling.',
        price: 59999,
        image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1200&auto=format&fit=crop',
        stock: 30,
        category: 'Electronics'
      },
      {
        name: 'ROG Laptops',
        description: 'High-performance gaming laptop with RGB and dedicated GPU.',
        price: 119999,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
        stock: 20,
        category: 'Electronics'
      },
      {
        name: 'Skybags Backpacks',
        description: 'Durable and stylish backpack for travel and daily commute.',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=1200&auto=format&fit=crop',
        stock: 100,
        category: 'Accessories'
      },
      {
        name: 'Fastrack Sunglasses',
        description: 'Trendy UV-protection sunglasses for everyday style.',
        price: 1499,
        image: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1200&auto=format&fit=crop',
        stock: 120,
        category: 'Fashion'
      },
      {
        name: 'boAt Airdopes',
        description: 'Truly wireless earbuds with immersive sound and long battery.',
        price: 1999,
        image: 'https://images.unsplash.com/photo-1606229364791-5e8e79fba399?q=80&w=1200&auto=format&fit=crop',
        stock: 150,
        category: 'Electronics'
      },
      {
        name: 'Smart Watch',
        description: 'Track fitness, heart rate, and notifications on the go.',
        price: 3499,
        image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1200&auto=format&fit=crop',
        stock: 80,
        category: 'Electronics'
      },
      {
        name: 'Bluetooth Speakers',
        description: 'Portable speakers with deep bass and 12h battery life.',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1518443899511-8453e07b6b97?q=80&w=1200&auto=format&fit=crop',
        stock: 60,
        category: 'Electronics'
      },
      {
        name: 'Joystick',
        description: 'Ergonomic game controller for console and PC.',
        price: 2999,
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
        stock: 50,
        category: 'Gaming'
      }
    ];

    // Upsert products by name to update images/descriptions/prices if changed
    let inserted = 0;
    for (const p of mockProducts) {
      const res = await Product.updateOne({ name: p.name }, { $set: p }, { upsert: true });
      if (res.upsertedCount === 1) inserted += 1;
    }
    if (inserted > 0) {
      console.log(`Inserted ${inserted} products via upsert.`);
    } else {
      console.log('No new inserts; existing products updated if needed.');
    }
    const newCount = await Product.countDocuments();
    console.log(`Total products now: ${newCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();


