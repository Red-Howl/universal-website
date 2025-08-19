import React from 'react';
import ProductCard from '../components/ProductCard';

export default function HomePage({ siteSettings }) {
  // We'll leave featured products empty for now. We can make this dynamic later.
  const featuredProducts = [];

  const heroStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '85vh', padding: '1rem', color: 'white', backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.pexels.com/photos/7615569/pexels-photo-7615569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`, backgroundSize: 'cover', backgroundPosition: 'center' };
  const textContainerStyle = { maxWidth: '800px', padding: '1rem', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px' };
  const h1Style = { fontFamily: 'var(--font-playfair)', fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '1rem' };
  const pStyle = { fontFamily: 'var(--font-lato)', fontSize: '1rem', marginBottom: '2rem' };
  const buttonStyle = { padding: '0.8rem 1.5rem', fontSize: '0.9rem', fontFamily: 'var(--font-lato)', fontWeight: 'bold', color: 'var(--color-text-charcoal)', backgroundColor: 'var(--color-background-cream)', border: 'none', borderRadius: '5px', cursor: 'pointer', textTransform: 'uppercase' };

  return (
    <>
      <style jsx>{`
        .featured-section { padding: 4rem 2rem; text-align: center; }
        .featured-title { font-family: var(--font-playfair); font-size: 2.5rem; margin-bottom: 2rem; }
        .product-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; max-width: 1200px; margin: 0 auto; }
        .about-section { display: flex; flex-direction: column; align-items: center; gap: 2rem; padding: 4rem 2rem; background-color: #ffffff; }
        .about-image-container { flex: 1; max-width: 400px; }
        .about-image { width: 100%; border-radius: 8px; }
        .about-text-container { flex: 1; max-width: 600px; text-align: center; }
        .about-title { font-family: var(--font-playfair); font-size: 2.5rem; margin-bottom: 1rem; }
        .about-text { font-family: var(--font-lato); font-size: 1.1rem; line-height: 1.6; }

        @media (min-width: 768px) { 
          .product-grid { grid-template-columns: repeat(3, 1fr); } 
          .about-section { flex-direction: row; } 
          .about-text-container { text-align: left; } 
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <section style={heroStyle}>
        <div style={textContainerStyle}>
          <h1 style={h1Style}>The Art of Adornment</h1>
          <p style={pStyle}>Exclusive, hand-painted fashion for the discerning individual. This is not just clothing; this is couture with a soul.</p>
          <button style={buttonStyle}>Explore The Collection</button>
        </div>
      </section>

      {/* --- FEATURED PRODUCTS SECTION --- */}
      <section className="featured-section">
        <h2 className="featured-title">Our Latest Creations</h2>
        <div className="product-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* --- ABOUT THE ARTIST SECTION (UPDATED) --- */}
      <section className="about-section">
        <div className="about-image-container">
          <img className="about-image" src="https://images.pexels.com/photos/4151484/pexels-photo-4151484.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Artist Sowmya" />
        </div>
        <div className="about-text-container">
          <h2 className="about-title">A Brush with Passion</h2>
          <p className="about-text">
            {siteSettings?.site_description}
          </p>
        </div>
      </section>
    </>
  );
}