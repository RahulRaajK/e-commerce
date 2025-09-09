# E-Commerce Store

A full-stack e-commerce website built with Next.js, MongoDB, and Tailwind CSS.

## Features

- User authentication (signup, login, logout)
- Product catalog with detailed product pages
- Shopping cart functionality
- Checkout process
- Admin panel for product management
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend:** Next.js with React
- **Styling:** Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT tokens

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file with:
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

- Navigate to `/admin`
- Use password: `admin123`

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get single product
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/cart` - Add to cart
- `PUT /api/cart` - Update cart
- `DELETE /api/cart` - Remove from cart
- `POST /api/checkout` - Process checkout

## Deployment

This project is ready for deployment on Vercel. Make sure to set up your MongoDB Atlas connection string in the environment variables.