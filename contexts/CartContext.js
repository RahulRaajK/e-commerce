import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
const CartContext = createContext();
export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  const fetchCart = async () => {
    if (typeof window === 'undefined') return;
    const token = sessionStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
        setCartCount(cartData.reduce((total, item) => total + item.quantity, 0));
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (typeof window === 'undefined') return;
    const token = sessionStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return false;
    }
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });
      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
        setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (typeof window === 'undefined') return;
    const token = sessionStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });
      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
        setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };
  const removeFromCart = async (productId) => {
    if (typeof window === 'undefined') return;
    const token = sessionStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
        setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);
  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      addToCart,
      updateCartItem,
      removeFromCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
