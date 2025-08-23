
import React from 'react';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';

export default function HomePage({ siteSettings }) {
  // We'll leave featured products empty for now. We can make this dynamic later.
  const featuredProducts = [];

  return (
    <>
      <style jsx>{`
        /* Hero Section Styles */
        .hero-section {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          min-height: 90vh;
          padding: 2rem;
          color: white;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 128, 128, 0.4)), 
                      url('https://images.pexels.com/photos/7615569/pexels-photo-7615569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          padding: 3rem;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .hero-title {
          font-family: var(--font-playfair);
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          background: linear-gradient(45deg, #D4AF37, #FFD700);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-subtitle {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          font-weight: 300;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .hero-description {
          font-family: var(--font-lato);
          font-size: 1.3rem;
          line-height: 1.7;
          margin-bottom: 3rem;
          opacity: 0.95;
        }

        .hero-cta {
          display: inline-block;
          padding: 1.2rem 3rem;
          font-size: 1.1rem;
          font-family: var(--font-lato);
          font-weight: bold;
          color: var(--color-text-charcoal);
          background: linear-gradient(45deg, var(--color-accent-gold), #FFD700);
          border: none;
          border-radius: 50px;
          cursor: pointer;
          text-transform: uppercase;
          text-decoration: none;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
        }

        .hero-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(212, 175, 55, 0.4);
          background: linear-gradient(45deg, #FFD700, var(--color-accent-gold));
        }

        /* Brand Story Section */
        .brand-story-section {
          padding: 6rem 2rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
          overflow: hidden;
        }

        .brand-story-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a"><stop offset="0%" stop-color="white" stop-opacity="0.1"/><stop offset="100%" stop-color="white" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="150" fill="url(%23a)"/><circle cx="800" cy="300" r="100" fill="url(%23a)"/><circle cx="400" cy="700" r="200" fill="url(%23a)"/></svg>') no-repeat;
          background-size: cover;
          opacity: 0.5;
        }

        .brand-story-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .brand-story-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4rem;
          align-items: center;
        }

        .brand-story-content {
          text-align: center;
        }

        .brand-story-title {
          font-family: var(--font-playfair);
          font-size: 3rem;
          color: var(--color-primary-teal);
          margin-bottom: 2rem;
          position: relative;
        }

        .brand-story-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: linear-gradient(45deg, var(--color-accent-gold), var(--color-primary-teal));
        }

        .brand-story-text {
          font-family: var(--font-lato);
          font-size: 1.2rem;
          line-height: 1.8;
          color: #444;
          margin-bottom: 2rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .brand-highlights {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .highlight-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.3s ease;
        }

        .highlight-card:hover {
          transform: translateY(-5px);
        }

        .highlight-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .highlight-title {
          font-family: var(--font-playfair);
          font-size: 1.3rem;
          color: var(--color-primary-teal);
          margin-bottom: 1rem;
        }

        .highlight-text {
          font-family: var(--font-lato);
          color: #666;
          line-height: 1.6;
        }

        /* Collections Preview */
        .collections-section {
          padding: 6rem 2rem;
          background: white;
        }

        .collections-container {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .collections-title {
          font-family: var(--font-playfair);
          font-size: 3rem;
          color: var(--color-primary-teal);
          margin-bottom: 1rem;
        }

        .collections-subtitle {
          font-family: var(--font-lato);
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 4rem;
          font-style: italic;
        }

        .collections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .collection-card {
          position: relative;
          height: 400px;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .collection-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }

        .collection-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .collection-card:hover .collection-image {
          transform: scale(1.1);
        }

        .collection-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
          display: flex;
          align-items: flex-end;
          padding: 2rem;
        }

        .collection-content {
          color: white;
          text-align: left;
        }

        .collection-name {
          font-family: var(--font-playfair);
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .collection-description {
          font-family: var(--font-lato);
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .shop-cta {
          display: inline-block;
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-family: var(--font-lato);
          font-weight: bold;
          color: white;
          background: var(--color-primary-teal);
          border: none;
          border-radius: 50px;
          cursor: pointer;
          text-transform: uppercase;
          text-decoration: none;
          letter-spacing: 1px;
          transition: all 0.3s ease;
        }

        .shop-cta:hover {
          background: #006666;
          transform: translateY(-2px);
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 4rem;
          }
          
          .brand-story-grid {
            grid-template-columns: 1fr 1fr;
            text-align: left;
          }
          
          .brand-story-title::after {
            left: 0;
            transform: none;
          }
        }

        @media (max-width: 767px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.2rem;
          }
          
          .hero-description {
            font-size: 1.1rem;
          }
          
          .brand-story-title {
            font-size: 2.2rem;
          }
          
          .collections-title {
            font-size: 2.2rem;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h2 className="hero-subtitle">Handcrafted Couture</h2>
          <h1 className="hero-title">Where Art Meets Fashion</h1>
          <p className="hero-description">
            Experience the fusion of traditional artistry and contemporary design. Each piece in our collection 
            is meticulously hand-painted, transforming premium fabrics into wearable masterpieces that celebrate 
            your unique style and artistic sensibility.
          </p>
          <Link href="/shop" className="hero-cta">
            Discover Collection
          </Link>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="brand-story-section">
        <div className="brand-story-container">
          <div className="brand-story-grid">
            <div className="brand-story-content">
              <h2 className="brand-story-title">Artisan Fashion Legacy</h2>
              <p className="brand-story-text">
                {siteSettings?.site_description || 
                "Born from a passion for artistic expression and sustainable fashion, our brand represents the perfect marriage of traditional craftsmanship and modern elegance. Every garment tells a story, hand-painted with love and designed to make you feel extraordinary."}
              </p>
              
              <div className="brand-highlights">
                <div className="highlight-card">
                  <div className="highlight-icon">👗</div>
                  <h3 className="highlight-title">Handcrafted Couture</h3>
                  <p className="highlight-text">
                    Each piece is individually hand-painted by skilled artisans, ensuring no two garments are exactly alike.
                  </p>
                </div>
                
                <div className="highlight-card">
                  <div className="highlight-icon">🌿</div>
                  <h3 className="highlight-title">Sustainable Fashion</h3>
                  <p className="highlight-text">
                    We use eco-friendly fabrics and non-toxic paints, creating beautiful clothing that respects our planet.
                  </p>
                </div>
                
                <div className="highlight-card">
                  <div className="highlight-icon">✨</div>
                  <h3 className="highlight-title">Exclusive Designs</h3>
                  <p className="highlight-text">
                    Limited edition pieces that reflect contemporary trends while honoring traditional art forms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Preview */}
      <section className="collections-section">
        <div className="collections-container">
          <h2 className="collections-title">Our Signature Collections</h2>
          <p className="collections-subtitle">Explore our carefully curated fashion categories</p>
          
          <div className="collections-grid">
            <div className="collection-card">
              <img 
                src="https://images.pexels.com/photos/15949733/pexels-photo-15949733.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Traditional Sarees Collection" 
                className="collection-image"
              />
              <div className="collection-overlay">
                <div className="collection-content">
                  <h3 className="collection-name">Traditional Sarees</h3>
                  <p className="collection-description">
                    Elegant hand-painted sarees featuring intricate peacock motifs and floral patterns
                  </p>
                </div>
              </div>
            </div>

            <div className="collection-card">
              <img 
                src="https://images.pexels.com/photos/10317923/pexels-photo-10317923.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Contemporary Kurtas Collection" 
                className="collection-image"
              />
              <div className="collection-overlay">
                <div className="collection-content">
                  <h3 className="collection-name">Modern Kurtas</h3>
                  <p className="collection-description">
                    Contemporary kurtas with artistic flair, perfect for casual elegance
                  </p>
                </div>
              </div>
            </div>

            <div className="collection-card">
              <img 
                src="https://images.pexels.com/photos/8148398/pexels-photo-8148398.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Designer Blouses Collection" 
                className="collection-image"
              />
              <div className="collection-overlay">
                <div className="collection-content">
                  <h3 className="collection-name">Designer Blouses</h3>
                  <p className="collection-description">
                    Unique hand-painted blouses that transform any outfit into a statement piece
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link href="/shop" className="shop-cta">
            View All Collections
          </Link>
        </div>
      </section>
    </>
  );
}
