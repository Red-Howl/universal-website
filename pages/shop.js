import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import ProductCard from '../components/ProductCard';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function fetches the products from the database
    async function fetchProducts() {
      // 'products' here is the name of your table in Supabase
      const { data, error } = await supabase.from('products').select('*');

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []); // The empty array [] means this runs once when the page loads

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading products...</div>;
  }

  return (
    <>
      <style jsx>{`
        /* Styles are the same as before */
        .shop-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
        .shop-title { font-family: var(--font-playfair); font-size: 3rem; text-align: center; margin-bottom: 3rem; color: var(--color-primary-teal); }
        .product-grid {
  display: grid;
  /* This creates columns with a standard minimum size that wrap automatically */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem; /* A slightly larger gap often looks better with this layout */
  justify-items: center;
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(1, 1fr); /* 3 on tablet */
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(1, 1fr); /* 4 on desktop */
  }
}

      `}</style>

      <div className="shop-container">
        <h1 className="shop-title">Our Collection</h1>
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}