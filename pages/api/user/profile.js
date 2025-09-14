import dbConnect from '@/lib/dbConnect.js';
import User from '@/models/User.js';
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
    const userId = decoded.userId;

    if (req.method === 'GET') {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ user });
    } else if (req.method === 'PUT') {
      const { firstName, lastName, phone, plusCode } = req.body;
      
      const updateData = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (phone !== undefined) updateData.phone = phone;
      if (plusCode !== undefined) updateData.plusCode = plusCode;

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ user });
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
