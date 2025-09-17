import dbConnect from '@/lib/dbConnect.js';
import Product from '@/models/Product.js';
export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'GET') {
    try {
      // Seed mock products if collection is empty
      const existingCount = await Product.countDocuments();
      if (existingCount === 0) {
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
          },
          {
            name: 'Lightweight Running Shoes',
            description: 'Breathable mesh upper with cushioned sole for daily runs',
            price: 2799,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
            stock: 80,
            category: 'Sports'
          },
          {
            name: 'Bluetooth Speaker',
            description: 'Portable speaker with deep bass and 12h battery life',
            price: 1499,
            image: 'https://images.unsplash.com/photo-1518443899511-8453e07b6b97?q=80&w=1200&auto=format&fit=crop',
            stock: 70,
            category: 'Electronics'
          },
          {
            name: 'Stainless Water Bottle',
            description: 'Insulated, keeps drinks cold for 24h and hot for 12h',
            price: 699,
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop',
            stock: 150,
            category: 'Sports'
          },
          {
            name: 'Minimalist Backpack',
            description: 'Water-resistant everyday backpack with laptop sleeve',
            price: 1899,
            image: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?q=80&w=1200&auto=format&fit=crop',
            stock: 90,
            category: 'Accessories'
          }
        ];
        await Product.insertMany(mockProducts);
      }
      const products = await Product.find({});
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  } else if (req.method === 'POST') {
    const { name, description, price, image, stock } = req.body;
    if (!name || !description || !price || !image || stock === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    try {
      const product = new Product({ name, description, price, image, stock });
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await Product.deleteMany({});
      res.status(200).json({ message: 'All products deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
