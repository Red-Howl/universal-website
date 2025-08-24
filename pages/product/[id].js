import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { CartContext } from '../../context/CartContext';

// Initialize the Supabase client (same as in shop.js)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query; // Get the ID from the URL
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function fetches the specific product from the database
    async function fetchProduct() {
      if (!id) return; // Don't run if the ID isn't available yet

      // .eq('id', id) is like saying "WHERE the id column equals the id from our URL"
      // .single() tells Supabase we expect only one result
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

      if (error) {
        console.error('Error fetching product:', error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    }

    fetchProduct();
  }, [id]); // This effect runs whenever the 'id' from the URL changes

  const handleBuyNow = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please log in to buy this item.');
      router.push('/login');
    } else {
      // Add the item to the cart first
      addToCart(product);
      // Then immediately redirect to checkout
      router.push('/checkout');
    }
  };
  
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading product details...</div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Product not found.</div>;
  }

  return (
    <>
      <style jsx>{`
        /* Styles are the same as before */
        .product-container { display: flex; flex-direction: column; max-width: 1200px; margin: 2rem auto; padding: 2rem; gap: 2rem; }
        .product-image-container { flex: 1; }
        .product-image { width: 100%; border-radius: 8px; }
        .product-details-container { flex: 1; }
        .product-name { font-family: var(--font-playfair); font-size: 2.5rem; margin-bottom: 1rem; }
        .product-price { font-size: 1.8rem; color: var(--color-primary-teal); margin-bottom: 1.5rem; }
        .product-description { font-family: var(--font-lato); line-height: 1.6; margin-bottom: 2rem; }
        .add-to-cart-btn { padding: 1rem 2rem; font-size: 1rem; font-weight: bold; color: white; background-color: var(--color-buttons-cream); border: none; border-radius: 5px; cursor: pointer; text-transform: uppercase; }
        @media (min-width: 768px) { .product-container { flex-direction: row; } }
        .button-container {
          display: flex;
          gap: 1rem; /* Adds space between the buttons */
        }
        .buy-now-btn {
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: bold;
          color: white;
          background-color: var(--color-buttons-cream); /* Different color */
          border: none;
          border-radius: 5px;
          cursor: pointer;
          text-transform: uppercase;
          flex-grow: 1; /* Allows buttons to share space */
        }
        .add-to-cart-btn {
          flex-grow: 1; /* Allows buttons to share space */
        }
      `}</style>

      <div className="product-container">
        <div className="product-image-container">
          <img className="product-image" src={product.imageUrl} alt={product.name} />
        </div>
        <div className="product-details-container">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">₹{product.price}</p>
          <p className="product-description">{product.description}</p>
          <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
          <button className="buy-now-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </>
  );
}