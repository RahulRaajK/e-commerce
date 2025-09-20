import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dbConnect from '../lib/dbConnect.js';

async function fixJoystickImage() {
  try {
    await dbConnect();
    const result = await Product.updateOne(
      { name: 'ROG Joystick' },
      { $set: { image: '/rog-joystick.png' } }
    );
    console.log('Updated ROG Joystick image:', result.modifiedCount);
    
    // Show all products
    const products = await Product.find({});
    console.log('\nAll products:');
    products.forEach((p, i) => {
      console.log(`${i+1}. ${p.name} - ${p.image}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixJoystickImage();
