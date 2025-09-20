import jwt from 'jsonwebtoken';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    await dbConnect();
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.cart) {
      user.cart = [];
    }
    if (req.method === 'GET') {
      res.status(200).json(user.cart);
    } else if (req.method === 'POST') {
      const { productId, quantity = 1 } = req.body;
      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
      }
      
      const existingItem = user.cart.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        user.cart.push({ productId, quantity });
      }
      
      await user.save();
      res.status(200).json(user.cart);
    } else if (req.method === 'PUT') {
      const { productId, quantity } = req.body;
      if (!productId || quantity === undefined) {
        return res.status(400).json({ error: 'Product ID and quantity are required' });
      }
      
      const item = user.cart.find(item => item.productId === productId);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          user.cart = user.cart.filter(item => item.productId !== productId);
        }
      }
      
      await user.save();
      res.status(200).json(user.cart);
    } else if (req.method === 'DELETE') {
      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
      }
      
      user.cart = user.cart.filter(item => item.productId !== productId);
      await user.save();
      res.status(200).json(user.cart);
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
