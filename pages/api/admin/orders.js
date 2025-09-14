import dbConnect from '@/lib/dbConnect.js';
import Order from '@/models/Order.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export default async function handler(req, res) {
  await dbConnect();
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'admin') {
      return res.status(401).json({ error: 'Invalid token type' });
    }
    if (req.method === 'GET') {
      const orders = await Order.find({})
        .populate('user', 'username email firstName lastName')
        .populate('items.product', 'name image price category')
        .sort({ createdAt: -1 });
      res.status(200).json({ orders });
    } else if (req.method === 'PUT') {
      const { orderId, status } = req.body;
      if (!orderId || !status) {
        return res.status(400).json({ error: 'Order ID and status are required' });
      }
      const validStatuses = ['order_placed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true, runValidators: true })
        .populate('user', 'username email firstName lastName')
        .populate('items.product', 'name image price category');
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.status(200).json({ order });
    } else {
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Server error' });
  }
}
