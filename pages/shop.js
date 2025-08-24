import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ShopPage({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(false); // Set loading to false as data is pre-fetched
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Effect to filter and sort products based on state changes
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy]);

  // Dynamically get categories from the initial products
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  // If initialProducts is not available, we would normally show a loading state.
  // However, for static generation, we assume initialProducts is always populated.
  // If there's a fallback mechanism needed, it would be implemented here or in getStaticProps.

  return (
    <>
      <style jsx>{`
        .shop-page-luxury {
          min-height: 100vh;
          background: var(--gradient-light);
          padding: 2rem 0;
        }

        .shop-header-content {
          text-align: center;
          padding: 1rem 0 1rem 0;
          background: var(--color-white);
          margin-bottom: rem;
          position: relative;
          overflow: hidden;
        }

        .shop-header-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--gradient-gold);
        }

        .shop-header-content::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--gradient-gold);
        }

        .shop-title {
          font-family: var(--font-primary);
          font-size: 3.5rem;
          font-weight: 400;
          color: var(--color-dark-gray);
          margin-bottom: 1rem;
          letter-spacing: 2px;
        }

        .shop-subtitle {
          font-family: var(--font-accent);
          font-size: 1.3rem;
          font-style: italic;
          color: var(--color-gray);
          margin-bottom: 0;
          letter-spacing: 1px;
        }

        .shop-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .filters-section {
          background: var(--color-white);
          padding: 2rem;
          border-radius: 20px;
          box-shadow: var(--shadow-soft);
          margin-bottom: 0;
          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .filters-row {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          gap: 2rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-label {
          font-family: var(--font-secondary);
          font-weight: 600;
          color: var(--color-dark-gray);
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-select {
          padding: 0.8rem 1rem;
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          font-family: var(--font-secondary);
          font-size: 1rem;
          background: var(--color-white);
          color: var(--color-dark-gray);
          transition: var(--transition-smooth);
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: var(--color-primary-gold);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .no-products {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--color-white);
          border-radius: 20px;
          box-shadow: var(--shadow-soft);
        }

        .no-products-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .no-products-title {
          font-family: var(--font-primary);
          font-size: 2rem;
          color: var(--color-dark-gray);
          margin-bottom: 1rem;
        }

        .no-products-text {
          font-family: var(--font-secondary);
          color: var(--color-gray);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .luxury-accent {
          position: absolute;
          width: 200px;
          height: 200px;
          background: var(--gradient-gold);
          border-radius: 50%;
          opacity: 0.05;
          animation: float 6s ease-in-out infinite;
        }

        .luxury-accent-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .luxury-accent-2 {
          bottom: 20%;
          right: 10%;
          animation-delay: 3s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .shop-page-luxury {
            padding: 1rem 0;
          }

          .shop-container {
            padding: 0 1rem;
          }

          .shop-title {
            font-size: 2.5rem;
          }

          .shop-subtitle {
            font-size: 1.1rem;
          }

          .filters-section {
            padding: 1.5rem;
          }

          .filters-row {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
          }

          .filter-group {
            flex: 1;
          }

          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }
      `}</style>

      <div className="shop-page-luxury">
        <div className="shop-header-content">
          <h1 className="shop-title">Our Collection</h1>
          <p className="shop-subtitle">"Where Art Meets Fashion"</p>
        </div>

        <div className="shop-container">
          <div className="filters-section">
            <div className="filters-row">
              <div className="filter-group">
                <label className="filter-label">Category</label>
                <select 
                  className="filter-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Sort By</label>
                <select 
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <div className="no-products-icon">🎨</div>
              <h3 className="no-products-title">No Products Found</h3>
              <p className="no-products-text">
                We couldn't find any products matching your criteria. 
                Try adjusting your filters or check back soon for new arrivals.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// This function fetches data at build time for static generation
export async function getStaticProps() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase.from('products').select('*');

    if (error) {
      console.error('Error fetching products for static props:', error);
      return {
        props: {
          initialProducts: [],
        },
        revalidate: 60, // Re-generate page every 60 seconds if needed
      };
    }

    return {
      props: {
        initialProducts: data || [],
      },
      revalidate: 60, // Re-generate page every 60 seconds if needed
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        initialProducts: [],
      },
      revalidate: 60,
    };
  }
}