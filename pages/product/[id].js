import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { CartContext } from '../../context/CartContext';
import { supabase } from '../../lib/supabase';

export default function ProductDetailPage({ initialProduct }) {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
    }
  }, [initialProduct]);

  const handleBuyNow = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please log in to buy this item.');
      router.push('/login');
    } else {
      addToCart(product);
      router.push('/checkout');
    }
  };

  const handleAddToCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please log in to add items to your cart.');
      router.push('/login');
    } else {
      addToCart(product);
      alert(`${product.name} has been added to your cart!`);
    }
  };

  const nextImage = () => {
    if (product && product.imageUrls) {
      setCurrentImageIndex((prev) => (prev + 1) % product.imageUrls.length);
    }
  };

  const prevImage = () => {
    if (product && product.imageUrls) {
      setCurrentImageIndex((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading product details...</div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Product not found.</div>;
  }

  // Handle both old and new image formats
  const images = product.imageUrls || (product.imageUrl ? [product.imageUrl] : []);
  const currentImage = images.length > 0 ? images[currentImageIndex] : 'https://placehold.co/600x600?text=No+Image';

  return (
    <>
      <style jsx>{`
        .product-container { display: flex; flex-direction: column; max-width: 1200px; margin: 2rem auto; padding: 2rem; gap: 2rem; }
        .product-image-container { flex: 1; position: relative; }
        .image-slider {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          border-radius: 8px;
        }
        .product-image { 
          width: 100%; 
          height: 100%;
          object-fit: cover;
        }
        .slider-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(0,0,0,0.5);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .slider-button:hover {
          background-color: rgba(0,0,0,0.7);
        }
        .prev-button { left: 10px; }
        .next-button { right: 10px; }
        .image-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #ccc;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .dot.active {
          background-color: var(--color-primary-teal);
        }
        .product-details-container { flex: 1; }
        .product-name { font-family: var(--font-playfair); font-size: 2.5rem; margin-bottom: 1rem; }
        .product-price { font-size: 1.8rem; color: var(--color-primary-teal); margin-bottom: 1.5rem; }
        .product-description { font-family: var(--font-lato); line-height: 1.6; margin-bottom: 2rem; }
        .button-container {
          display: flex;
          gap: 1rem;
        }
        .add-to-cart-btn, .buy-now-btn { 
          padding: 1rem 2rem; 
          font-size: 1rem; 
          font-weight: bold; 
          color: white; 
          background-color: var(--color-primary-teal); 
          border: none; 
          border-radius: 5px; 
          cursor: pointer; 
          text-transform: uppercase;
          flex-grow: 1;
        }
        @media (min-width: 768px) { .product-container { flex-direction: row; } }
      `}</style>

      <div className="product-container">
        <div className="product-image-container">
          <div className="image-slider">
            <img className="product-image" src={currentImage} alt={product.name} />
            {images.length > 1 && (
              <>
                <button className="slider-button prev-button" onClick={prevImage}>‹</button>
                <button className="slider-button next-button" onClick={nextImage}>›</button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="image-dots">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="product-details-container">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">₹{product.price}</p>
          <p className="product-description">{product.description}</p>
          <div className="button-container">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  const { data, error } = await supabase.from('products').select('id');

  if (error) {
    console.error('Error fetching paths:', error);
    return { paths: [], fallback: 'blocking' };
  }

  const paths = data.map((product) => ({
    params: { id: product.id.toString() },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  const { id } = params;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product for static props:', error);
    return { props: { initialProduct: null } };
  }

  return {
    props: {
      initialProduct: data,
    },
  };
}