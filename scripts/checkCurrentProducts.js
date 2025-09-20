import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dbConnect from '../lib/dbConnect.js';

async function checkCurrentProducts() {
  try {
    await dbConnect();
    const products = await Product.find({});
    console.log('Current products in database:');
    products.forEach((p, i) => {
      console.log(`${i+1}. ${p.name} - ${p.image}`);
    });
    console.log(`Total: ${products.length} products`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCurrentProducts();
