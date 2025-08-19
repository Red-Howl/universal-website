import React, { useContext, useEffect, useState } from 'react'; // Added useEffect, useState
import Link from 'next/link';
import { useRouter } from 'next/router'; // Added useRouter
import { CartContext } from '../context/CartContext';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CartPage() {
  const { cart, removeFromCart } = useContext(CartContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- NEW: Security check to ensure user is logged in ---
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login'); // Redirect if not logged in
      } else {
        setUser(user);
        setLoading(false);
      }
    }
    checkUser();
  }, [router]);

  const totalPrice = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // Show a loading message while we check for the user
  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h1>Your Cart is Empty</h1>
        <Link href="/shop" style={{ color: 'var(--color-primary-teal)', fontWeight: 'bold' }}>
            Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        /* Styles are the same */
        .cart-container { max-width: 900px; margin: 2rem auto; padding: 2rem; }
        .cart-title { font-family: var(--font-playfair); text-align: center; font-size: 2.5rem; margin-bottom: 2rem; }
        .cart-item { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid #eee; padding-bottom: 1.5rem; }
        .cart-item-img { width: 100px; height: 100px; object-fit: cover; border-radius: 8px; }
        .cart-item-details { flex-grow: 1; }
        .cart-item-name { font-weight: bold; font-size: 1.2rem; }
        .remove-btn { color: red; cursor: pointer; font-size: 0.9rem; background: none; border: none; padding: 0;}
        .cart-summary { margin-top: 2rem; text-align: right; }
        .cart-total { font-size: 1.5rem; font-weight: bold; margin-bottom: 1.5rem;}
        .checkout-btn { padding: 1rem 2rem; font-size: 1.1rem; font-weight: bold; color: white; background-color: var(--color-primary-teal); border: none; border-radius: 5px; cursor: pointer; text-decoration: none; }
      `}</style>
      <div className="cart-container">
        <h1 className="cart-title">Your Shopping Cart</h1>
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
            <div className="cart-item-details">
              <p className="cart-item-name">{item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ₹{item.price}</p>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="remove-btn">Remove</button>
          </div>
        ))}
        <div className="cart-summary">
          <p className="cart-total">Total: ₹{totalPrice.toLocaleString()}</p>
          <Link href="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </>
  );
}