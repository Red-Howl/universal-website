import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { CartContext } from '../../context/CartContext';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) {
        console.error('Error fetching product:', error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  // --- NEW FUNCTION TO HANDLE ADDING TO CART SECURELY ---
  const handleAddToCart = async () => {
    // First, check if a user is logged in
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Please log in to add items to your cart.');
      router.push('/login'); // Redirect to login page
    } else {
      // If user is logged in, add the item to the cart
      addToCart(product);
      alert(`${product.name} has been added to your cart!`);
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
        .product-container { display: flex; flex-direction: column; max-width: 1200px; margin: 2rem auto; padding: 2rem; gap: 2rem; }
        .product-image-container { flex: 1; }
        .product-image { width: 100%; border-radius: 8px; }
        .product-details-container { flex: 1; }
        .product-name { font-family: var(--font-playfair); font-size: 2.5rem; margin-bottom: 1rem; }
        .product-price { font-size: 1.8rem; color: var(--color-primary-teal); margin-bottom: 1.5rem; }
        .product-description { font-family: var(--font-lato); line-height: 1.6; margin-bottom: 2rem; }
        .add-to-cart-btn { padding: 1rem 2rem; font-size: 1rem; font-weight: bold; color: white; background-color: var(--color-primary-teal); border: none; border-radius: 5px; cursor: pointer; text-transform: uppercase; }
        @media (min-width: 768px) { .product-container { flex-direction: row; } }
      `}</style>

      <div className="product-container">
        <div className="product-image-container">
          <img className="product-image" src={product.imageUrl} alt={product.name} />
        </div>
        <div className="product-details-container">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">₹{product.price}</p>
          <p className="product-description">{product.description}</p>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}