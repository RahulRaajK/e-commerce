import dbConnect from '../lib/dbConnect.js';
import Product from '../models/Product.js';

async function cleanupProducts() {
  try {
    await dbConnect();
    
    // Define the 8 products we want to keep
    const keepProducts = [
      'ROG Phone',
      'ROG Laptops', 
      'Skybags Backpacks',
      'Fastrack Sunglasses',
      'boAt Airdopes',
      'Smart Watch',
      'Bluetooth Speakers',
      'Joystick'
    ];
    
    // Delete all products that are NOT in our keep list
    const result = await Product.deleteMany({ 
      name: { $nin: keepProducts } 
    });
    
    console.log(`Deleted ${result.deletedCount} old products.`);
    
    // Show remaining products
    const remaining = await Product.find({}).select('name price');
    console.log(`Remaining products (${remaining.length}):`);
    remaining.forEach(p => {
      console.log(`- ${p.name}: ₹${p.price}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning up products:', error);
    process.exit(1);
  }
}

cleanupProducts();
