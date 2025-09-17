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
