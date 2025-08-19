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
   const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (product?.imageUrls?.length > 1) {
        const interval = setInterval(() => {
          setCurrentIndex(prevIndex => (prevIndex + 1) % product.imageUrls.length);
        }, 10000); // 10000 milliseconds = 10 seconds

        // Clear the interval when the component unmounts to prevent memory leaks
        return () => clearInterval(interval);
      }
    }, [product]);
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
  }, [id]); 

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
        /* --- NEW: Styles for the Carousel --- */
        .carousel-container {
          flex: 1;
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          aspect-ratio: 1 / 1; /* Ensures a perfect square shape */
        }
        .carousel-slider {
          display: flex;
          height: 100%;
          transition: transform 0.5s ease-in-out;
        }
        .carousel-image {
          min-width: 100%;
          height: 100%;
          object-fit: cover; /* This crops the image to fit the square */
        }
        .carousel-dots {
          position: absolute;
          bottom: 15px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #ccc;
          cursor: pointer;
        }
        .dot.active {
          background-color: var(--color-primary-teal);
        }
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
        {/* --- NEW: Carousel HTML Structure --- */}
        <div className="carousel-container">
          <div className="carousel-slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {product.imageUrls?.map((url, index) => (
              <img key={index} src={url} alt={`Product image ${index + 1}`} className="carousel-image" />
            ))}
          </div>
          <div className="carousel-dots">
            {product.imageUrls?.map((_, index) => (
              <div 
                key={index}
                className={`dot ${currentIndex === index ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
        <div className="product-details-container">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">₹{product.price}</p>
          <p className="product-description">{product.description}</p>
          <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}