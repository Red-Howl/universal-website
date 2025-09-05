import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { CartContext } from '../../context/CartContext';
import RecommendedProducts from '../../components/RecommendedProducts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const handleBuyNow = async () => {
    const remainingQuantity = product.quantity - (product.ordered_quantity || 0);
    if (remainingQuantity === 0) {
      alert('This product is currently out of stock.');
      return;
    }
    
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

  const handleRecommendedProductClick = (recommendedProduct) => {
    // Track user interaction with recommended product
    console.log('User clicked recommended product:', recommendedProduct.name);
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
        .product-container { 
          display: flex; 
          flex-direction: column; 
          max-width: 1200px; 
          margin: 2rem auto; 
          padding: 2rem; 
          gap: 2rem; 
          background: var(--color-card-bg);
          border-radius: 20px;
          box-shadow: var(--shadow-light);
          border: 1px solid var(--color-border);
        }
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
          background-color: var(--color-border);
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .dot.active {
          background-color: var(--color-primary);
        }
        .product-details-container { flex: 1; }
        .product-name { 
          font-family: var(--font-playfair); 
          font-size: 2.5rem; 
          margin-bottom: 1rem; 
          color: var(--color-dark-grey);
        }
        .product-price { 
          font-size: 1.8rem; 
          color: var(--color-black); 
          margin-bottom: 1.5rem; 
          font-weight: 600;
        }
        .product-description { 
          font-family: var(--font-lato); 
          line-height: 1.6; 
          margin-bottom: 2rem; 
          color: var(--color-secondary);
        }
        .out-of-stock-simple {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .out-of-stock-icon {
          font-size: 1.2rem;
        }
        .out-of-stock-text {
          color: var(--color-error);
          font-weight: 600;
          font-size: 1rem;
        }
        .button-container {
          display: flex;
          gap: 1rem;
        }
        .add-to-cart-btn, .buy-now-btn { 
          padding: 1rem 2rem; 
          font-size: 1rem; 
          font-weight: bold; 
          color: var(--color-dark-grey); 
          background-color: var(--color-primary); 
          border: none; 
          border-radius: 8px; 
          cursor: pointer; 
          text-transform: uppercase;
          flex-grow: 1;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-light);
        }
        .add-to-cart-btn:hover, .buy-now-btn:hover {
          background-color: var(--color-accent);
          box-shadow: var(--shadow-medium);
        }
        .buy-now-btn:disabled {
          background-color: var(--color-secondary);
          cursor: not-allowed;
          opacity: 0.6;
        }
        @media (min-width: 768px) { .product-container { flex-direction: row; } }
      `}</style>

      <div className="product-container page-fade-in">
        <div className="product-image-container slide-in-left">
          <div className="image-slider">
            <img className="product-image scale-on-hover" src={currentImage} alt={product.name} />
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
        <div className="product-details-container slide-in-right">
          <h1 className="product-name slide-in-down">{product.name}</h1>
          <p className="product-price slide-in-up">₹{product.price}</p>
          
          {/* Simple Out of Stock Display */}
          {(product.quantity - (product.ordered_quantity || 0)) === 0 && (
            <div className="out-of-stock-simple">
              <span className="out-of-stock-icon">🚫</span>
              <span className="out-of-stock-text">Out of Stock</span>
            </div>
          )}
          
          <p className="product-description">{product.description}</p>
          <div className="button-container stagger-animation">
            <button className="add-to-cart-btn btn-animate" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button 
              className="buy-now-btn btn-animate" 
              onClick={handleBuyNow}
              disabled={(product.quantity - (product.ordered_quantity || 0)) === 0}
            >
              {(product.quantity - (product.ordered_quantity || 0)) === 0 ? 'Out of Stock' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Recommended Products Section */}
      {product && (
        <RecommendedProducts 
          currentProduct={product} 
          onProductClick={handleRecommendedProductClick}
        />
      )}
    </>
  );
}