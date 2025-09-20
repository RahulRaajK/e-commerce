import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCart } from '../contexts/CartContext';

export default function Home() {
  const router = useRouter();
  const { addToCart, cartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const token = sessionStorage.getItem('token');
    if (token) {
      fetchUser();
    }
    fetchProducts();
  }, []);

  const fetchUser = async () => {
    if (typeof window === 'undefined') return;
    
    const token = sessionStorage.getItem('token');
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    const success = await addToCart(productId, 1);
    if (success) {
      alert('Product added to cart!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
         <title>e-commerce Store</title>
        <meta name="description" content="Your one-stop shop for premium products" />
      </Head>

      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
               <h1 className="text-2xl font-bold text-gray-900">e-commerce</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700">Welcome, {user.username}</span>
                  <Link href="/cart" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Cart ({cartCount})
                  </Link>
                  <Link href="/orders" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
                    Orders
                  </Link>
                  <Link href="/profile" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                    Profile
                  </Link>
                  <Link href="/admin" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                    Admin Login
                  </Link>
                  <button
                    onClick={() => {
                      sessionStorage.removeItem('token');
                      router.push('/login');
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Login
                  </Link>
                  <Link href="/signup" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                    Sign Up
                  </Link>
                  <Link href="/admin" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                    Admin Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
           <h2 className="text-4xl font-bold text-gray-900 mb-4">e-commerce Store</h2>
          <p className="text-xl text-gray-600">Your one-stop shop for premium products</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div key={product._id} className="bg-white overflow-hidden shadow rounded-lg">
              <img
                className="h-48 w-full object-cover"
                src={product.image}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop&crop=center&auto=format&q=60';
                }}
              />
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                  <div className="flex space-x-2">
                    <Link
                      href={`/products/${product._id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
}
