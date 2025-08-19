import React from 'react';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const displayImageUrl = product.imageUrl || 'https://placehold.co/600x600?text=No+Image';

  return (
    <Link href={`/product/${product.id}`} className="card">
      <style jsx>{`
        /* --- THIS IS THE FINAL, CORRECTED STYLE --- */
        .card {
          display: block;
          width: 100%;
          max-width: 350px;
          margin: 0 auto;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          overflow: hidden;
          text-align: center;
          font-family: var(--font-lato);
          transition: transform 0.2s ease-in-out;
          text-decoration: none;
          color: inherit;
        }
        .card:hover {
          transform: translateY(-5px);
        }

        /* This is the new container for the image */
        .image-container {
          width: 100%;
          aspect-ratio: 1 / 1; /* This creates a perfect square */
          overflow: hidden; /* This is necessary for the cropping effect */
        }

        /* This styles the image itself */
        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover; /* This is the "crop" effect you wanted */
        }

        .card-content {
          padding: 1rem;
        }
        .card-title {
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .card-price {
          font-size: 1.1rem;
          color: var(--color-primary-teal);
          margin-bottom: 1rem;
        }
        .card-button {
          padding: 0.7rem 1.5rem;
          font-size: 0.9rem;
          font-weight: bold;
          color: white;
          background-color: var(--color-primary-teal);
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>

      {/* --- THIS IS THE NEW HTML STRUCTURE FOR THE IMAGE --- */}
      <div className="image-container">
        <img src={displayImageUrl} alt={product.name} className="card-image" />
      </div>

      <div className="card-content">
        <h3 className="card-title">{product.name}</h3>
        <p className="card-price">₹{product.price}</p>
        <button className="card-button">View Details</button>
      </div>
    </Link>
  );
}