import React, { useContext, useEffect, useState } from 'react'; // Added useEffect, useState
import Link from 'next/link';
import { useRouter } from 'next/router'; // Added useRouter
import { CartContext } from '../context/CartContext';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
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
      <div style={{ textAlign: 'center', padding: '4rem' }} className="page-fade-in">
        <h1 className="slide-in-down">Your Cart is Empty</h1>
        <Link href="/shop" style={{ color: 'var(--color-primary-teal)', fontWeight: 'bold' }} className="btn-animate">
            Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        /* Styles are the same */
        .cart-container { 
          max-width: 900px; 
          margin: 2rem auto; 
          padding: 2rem; 
          background: var(--color-card-bg);
          border-radius: 20px;
          box-shadow: var(--shadow-light);
          border: 1px solid var(--color-border);
        }
        .cart-title { 
          font-family: var(--font-playfair); 
          text-align: center; 
          font-size: 2.5rem; 
          margin-bottom: 2rem; 
          color: var(--color-dark-grey);
        }
        .cart-item { 
          display: flex; 
          align-items: center; 
          gap: 1.5rem; 
          margin-bottom: 1.5rem; 
          border-bottom: 1px solid var(--color-border); 
          padding-bottom: 1.5rem; 
        }
        .cart-item-img { width: 100px; height: 100px; object-fit: cover; border-radius: 8px; }
        .cart-item-details { flex-grow: 1; }
        .cart-item-name { 
          font-weight: bold; 
          font-size: 1.2rem; 
          margin-bottom: 0.5rem; 
          color: var(--color-dark-grey);
        }
        .cart-item-price { 
          color: var(--color-black); 
          font-weight: bold; 
          margin-bottom: 1rem; 
        }
        .quantity-controls { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
        .quantity-btn { 
          width: 30px; 
          height: 30px; 
          border: 1px solid var(--color-border); 
          background: var(--color-light-grey); 
          border-radius: 4px; 
          cursor: pointer; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-weight: bold;
          transition: all 0.2s ease;
        }
        .quantity-btn:hover { 
          background: var(--color-hover); 
          border-color: var(--color-primary);
        }
        .quantity-display { 
          min-width: 40px; 
          text-align: center; 
          font-weight: bold; 
          padding: 0.5rem;
        }
        .remove-btn { 
          color: var(--color-error); 
          cursor: pointer; 
          font-size: 0.9rem; 
          background: none; 
          border: none; 
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        .remove-btn:hover { 
          background: var(--color-hover); 
          color: var(--color-error);
        }
        .cart-summary { 
          margin-top: 2rem; 
          text-align: right; 
          padding: 1.5rem;
          background: var(--color-light-grey);
          border-radius: 8px;
          border: 1px solid var(--color-border);
        }
        .cart-total { 
          font-size: 1.5rem; 
          font-weight: bold; 
          margin-bottom: 1.5rem;
          color: var(--color-dark-grey);
        }
        .checkout-btn { 
          padding: 1rem 2rem; 
          font-size: 1.1rem; 
          font-weight: bold; 
          color: var(--color-dark-grey); 
          background-color: var(--color-primary); 
          border: none; 
          border-radius: 8px; 
          cursor: pointer; 
          text-decoration: none; 
          transition: all 0.3s ease;
          box-shadow: var(--shadow-light);
        }
        .checkout-btn:hover {
          background-color: var(--color-accent);
          box-shadow: var(--shadow-medium);
        }
      `}</style>
      <div className="cart-container page-fade-in">
        <h1 className="cart-title slide-in-down">Your Shopping Cart</h1>
        {cart.map((item, index) => (
          <div key={item.id} className="cart-item card-animate" style={{ animationDelay: `${index * 0.1}s` }}>
            <img src={item.imageUrl} alt={item.name} className="cart-item-img scale-on-hover" />
            <div className="cart-item-details">
              <p className="cart-item-name">{item.name}</p>
              <p className="cart-item-price">₹{item.price}</p>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn" 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="quantity-display">{item.quantity}</span>
                <button 
                  className="quantity-btn" 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="remove-btn btn-animate">Remove</button>
          </div>
        ))}
        <div className="cart-summary slide-in-up">
          <p className="cart-total">Total: ₹{totalPrice.toLocaleString()}</p>
          <Link href="/checkout" className="checkout-btn btn-animate glow-on-hover">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </>
  );
}