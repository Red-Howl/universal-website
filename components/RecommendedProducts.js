import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { recommendationEngine } from '../utils/recommendationEngine';

export default function RecommendedProducts({ currentProduct, onProductClick }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer to trigger recommendations when user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            loadRecommendations();
            setHasLoaded(true);
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '100px' // Start loading 100px before the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasLoaded]);

  const loadRecommendations = async () => {
    if (!currentProduct || loading) return;
    
    setLoading(true);
    try {
      const recs = await recommendationEngine.getRecommendations(currentProduct, 8);
      setRecommendations(recs);
      setShowRecommendations(true);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    // Update user preferences when clicking on recommended product
    recommendationEngine.updateUserPreferences(product);
    
    // Call parent callback if provided
    if (onProductClick) {
      onProductClick(product);
    }
  };

  if (!showRecommendations && !loading) {
    return (
      <div ref={sectionRef} style={{ height: '50px' }} />
    );
  }

  return (
    <>
      <style jsx>{`
        .recommendations-section {
          margin: 3rem 0;
          padding: 2rem;
          background: var(--color-card-bg);
          border-radius: 20px;
          box-shadow: var(--shadow-light);
          border: 1px solid var(--color-border);
        }
        .recommendations-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .recommendations-title {
          font-family: var(--font-playfair);
          font-size: 2rem;
          color: var(--color-dark-grey);
          margin-bottom: 0.5rem;
        }
        .recommendations-subtitle {
          color: var(--color-secondary);
          font-size: 1rem;
        }
        .recommendations-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .recommendation-card {
          background: var(--color-light-grey);
          border-radius: 15px;
          overflow: hidden;
          box-shadow: var(--shadow-light);
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          border: 1px solid var(--color-border);
        }
        .recommendation-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-medium);
        }
        .recommendation-image {
          width: 100%;
          aspect-ratio: 1/1;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .recommendation-card:hover .recommendation-image {
          transform: scale(1.05);
        }
        .recommendation-content {
          padding: 0.8rem;
        }
        .recommendation-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-dark-grey);
          margin-bottom: 0.2rem;
          line-height: 1.1;
        }
        .recommendation-price {
          font-size: 0.9rem;
          color: var(--color-black);
          font-weight: bold;
          margin-bottom: 0.2rem;
        }
        .recommendation-category {
          font-size: 0.7rem;
          color: var(--color-secondary);
          text-transform: capitalize;
        }
        .recommendation-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: var(--color-primary);
          color: var(--color-dark-grey);
          padding: 0.2rem 0.6rem;
          border-radius: 15px;
          font-size: 0.7rem;
          font-weight: bold;
        }
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 3rem;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid var(--color-primary-teal);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .no-recommendations {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
        .recommendation-score {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
          font-size: 0.7rem;
        }
        @media (max-width: 768px) {
          .recommendations-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          .recommendations-section {
            margin: 2rem 0;
            padding: 1.5rem;
          }
          .recommendations-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="recommendations-section">
        <div className="recommendations-header">
          <h2 className="recommendations-title">
            {recommendations.length > 0 && recommendations[0].isFallback 
              ? "Newly Added Products" 
              : "You Might Also Like"}
          </h2>
          <p className="recommendations-subtitle">
            {recommendations.length > 0 && recommendations[0].isFallback
              ? "Check out our latest additions to the collection"
              : "Discover products tailored to your preferences"}
          </p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="recommendations-grid">
            {recommendations.map((product, index) => (
              <Link 
                key={product.id} 
                href={`/product/${product.id}`}
                onClick={() => handleProductClick(product)}
              >
                <div className="recommendation-card">
                  <img 
                    src={product.imageUrl || 'https://placehold.co/300x200?text=No+Image'} 
                    alt={product.name}
                    className="recommendation-image"
                  />
                  <div className="recommendation-content">
                    <h3 className="recommendation-name">{product.name}</h3>
                    <p className="recommendation-price">₹{product.price}</p>
                    <p className="recommendation-category">{product.category || 'General'}</p>
                  </div>
                  {index < 3 && (
                    <div className="recommendation-badge">
                      {product.isFallback 
                        ? (index === 0 ? 'New' : index === 1 ? 'Latest' : 'Fresh')
                        : (index === 0 ? 'Top Pick' : index === 1 ? 'Popular' : 'Trending')
                      }
                    </div>
                  )}

                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="no-recommendations">
            <p>No recommendations available at the moment.</p>
          </div>
        )}
      </div>
    </>
  );
}
