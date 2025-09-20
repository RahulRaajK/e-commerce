import dbConnect from '@/lib/dbConnect.js';
import Product from '@/models/Product.js';
import jwt from 'jsonwebtoken';
export default async function handler(req, res) {
  await dbConnect();
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (req.method === 'GET') {
    try {
      const products = await Product.find({});
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, description, price, image, category, stock } = req.body;
      if (!name || !description || !price || !image || !category || stock === undefined) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: 'Price must be a positive number' });
      }
      if (!Number.isInteger(stock) || stock < 0) {
        return res.status(400).json({ error: 'Stock must be a non-negative integer' });
      }
      const product = new Product({ name, description, price: parseFloat(price), image, category, stock: parseInt(stock) });
      await product.save();
      res.status(201).json({ product, message: 'Product created successfully' });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
