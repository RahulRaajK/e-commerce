import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import Product from '../../models/Product';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method === 'GET') {
    try {
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
      const product = new Product({
        name,
        description,
        price,
        image,
        stock
      });
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
