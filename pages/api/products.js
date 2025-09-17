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
