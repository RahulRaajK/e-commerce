import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUser();
    fetchCart();
  }, []);
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/login');
    }
  };
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const cartData = await response.json();
      setCart(cartData);
      const productIds = cartData.map(item => item.productId);
      for (const productId of productIds) {
        const productResponse = await fetch(`/api/products/${productId}`);
        const productData = await productResponse.json();
        setProducts(prev => ({ ...prev, [productId]: productData }));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };
  const updateQuantity = async (productId, newQuantity) => {
    const token = localStorage.getItem('token');
    try {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: newQuantity })
      });
      fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };
  const removeItem = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };
  const checkout = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Checkout successful!');
      fetchCart();
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const product = products[item.productId];
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>Shopping Cart - E-Commerce Store</title>
        <meta name="description" content="Your shopping cart" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  E-Commerce
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user?.username}</span>
                <Link href="/" className="text-gray-700 hover:text-gray-900">
                  Products
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    router.push('/');
                  }}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl text-gray-600 mb-4">Your cart is empty</h2>
                <Link href="/" className="text-blue-600 hover:text-blue-800">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Cart Items</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {cart.map((item) => {
                    const product = products[item.productId];
                    if (!product) return null;
                    return (
                      <div key={item.productId} className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            className="h-16 w-16 object-cover rounded-md"
                            src={product.image}
                            alt={product.name}
                          />
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                            <p className="text-gray-600">${product.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="bg-gray-200 text-gray-600 px-2 py-1 rounded-md hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="mx-3 text-lg font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="bg-gray-200 text-gray-600 px-2 py-1 rounded-md hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-lg font-medium text-gray-900">
                            ${(product.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      Total: ${getTotalPrice().toFixed(2)}
                    </span>
                    <button
                      onClick={checkout}
                      className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
