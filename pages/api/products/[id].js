import dbConnect from '@/lib/dbConnect.js';
import Product from '@/models/Product.js';
export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;
  if (req.method === 'GET') {
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
