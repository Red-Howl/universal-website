
import React from 'react';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const displayImageUrl = product.imageUrl || 'https://placehold.co/600x600?text=No+Image';

  return (
    <Link href={`/product/${product.id}`} className="card card-animate glow-on-hover">
      <style jsx>{`
        .card {
          display: block;
          width: 100%;
          max-width: 350px;
          margin: 0 auto;
          background-color: var(--color-card-bg);
          border-radius: 8px;
          box-shadow: var(--shadow-light);
          overflow: hidden;
          text-align: center;
          font-family: var(--font-lato);
          transition: transform 0.2s ease-in-out;
          text-decoration: none;
          color: inherit;
          border: 1px solid var(--color-border);
        }
        
        @media (max-width: 768px) {
          .card {
            max-width: none;
          }
        }
        .card:hover {
          transform: translateY(-5px);
        }

        .image-container {
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-content {
          padding: 1rem;
        }
        .card-title {
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: var(--color-dark-grey);
        }
        .card-price {
          font-size: 1.1rem;
          color: var(--color-black);
          margin-bottom: 1rem;
          font-weight: 600;
        }
        .card-button {
          padding: 0.7rem 1.5rem;
          font-size: 0.9rem;
          font-weight: bold;
          color: var(--color-dark-grey);
          background-color: var(--color-primary);
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .card-button:hover {
          background-color: var(--color-accent);
        }
      `}</style>

      <div className="image-container">
        <img src={displayImageUrl} alt={product.name} className="card-image scale-on-hover" />
      </div>

      <div className="card-content">
        <h3 className="card-title">{product.name}</h3>
        <p className="card-price">₹{product.price}</p>
        <button className="card-button btn-animate">View Details</button>
      </div>
    </Link>
  );
}
