
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
          min-height: 100vh;
          padding: 0;
          color: white;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(20, 20, 20, 0.8)), 
                      url('https://images.pexels.com/photos/794064/pexels-photo-794064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
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
          background: linear-gradient(45deg, rgba(0, 0, 0, 0.4) 0%, rgba(40, 40, 40, 0.6) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          padding: 4rem 2rem;
        }

        .hero-title {
          font-family: var(--font-playfair);
          font-size: 4.5rem;
          font-weight: 300;
          line-height: 1.1;
          margin-bottom: 2rem;
          color: #ffffff;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .hero-subtitle {
          font-family: var(--font-lato);
          font-size: 1.4rem;
          margin-bottom: 2rem;
          font-weight: 300;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #d4af37;
          opacity: 0.9;
        }

        .hero-description {
          font-family: var(--font-lato);
          font-size: 1.2rem;
          line-height: 1.8;
          margin-bottom: 3rem;
          opacity: 0.85;
          font-weight: 300;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-cta {
          display: inline-block;
          padding: 18px 45px;
          font-size: 1rem;
          font-family: var(--font-lato);
          font-weight: 400;
          color: #000;
          background: #ffffff;
          border: 2px solid #ffffff;
          cursor: pointer;
          text-transform: uppercase;
          text-decoration: none;
          letter-spacing: 2px;
          transition: all 0.4s ease;
          margin-right: 20px;
        }

        .hero-cta:hover {
          background: transparent;
          color: #ffffff;
          border-color: #ffffff;
        }

        .hero-cta-secondary {
          display: inline-block;
          padding: 18px 45px;
          font-size: 1rem;
          font-family: var(--font-lato);
          font-weight: 400;
          color: #ffffff;
          background: transparent;
          border: 2px solid #d4af37;
          cursor: pointer;
          text-transform: uppercase;
          text-decoration: none;
          letter-spacing: 2px;
          transition: all 0.4s ease;
        }

        .hero-cta-secondary:hover {
          background: #d4af37;
          color: #000;
        }

        /* Brand Story Section */
        .brand-story-section {
          padding: 8rem 2rem;
          background: #ffffff;
          position: relative;
        }

        .brand-story-container {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
        }

        .brand-story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: center;
        }

        .brand-story-content {
          padding: 2rem;
        }

        .brand-story-title {
          font-family: var(--font-playfair);
          font-size: 3.5rem;
          color: #2c2c2c;
          margin-bottom: 3rem;
          font-weight: 300;
          line-height: 1.2;
          letter-spacing: 1px;
        }

        .brand-story-text {
          font-family: var(--font-lato);
          font-size: 1.1rem;
          line-height: 1.9;
          color: #666;
          margin-bottom: 2.5rem;
          font-weight: 300;
        }

        .brand-story-image {
          position: relative;
          overflow: hidden;
        }

        .brand-story-image img {
          width: 100%;
          height: 600px;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .brand-story-image:hover img {
          transform: scale(1.05);
        }

        .brand-highlights {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3rem;
          margin-top: 4rem;
        }

        .highlight-card {
          text-align: center;
          padding: 2rem 1rem;
        }

        .highlight-number {
          font-family: var(--font-playfair);
          font-size: 4rem;
          color: #d4af37;
          margin-bottom: 1rem;
          font-weight: 300;
        }

        .highlight-title {
          font-family: var(--font-playfair);
          font-size: 1.2rem;
          color: #2c2c2c;
          margin-bottom: 1rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .highlight-text {
          font-family: var(--font-lato);
          color: #666;
          line-height: 1.6;
          font-weight: 300;
        }

        /* Collections Section */
        .collections-section {
          padding: 8rem 2rem;
          background: #f8f8f8;
        }

        .collections-container {
          max-width: 1400px;
          margin: 0 auto;
          text-align: center;
        }

        .collections-title {
          font-family: var(--font-playfair);
          font-size: 3.5rem;
          color: #2c2c2c;
          margin-bottom: 1rem;
          font-weight: 300;
          letter-spacing: 2px;
        }

        .collections-subtitle {
          font-family: var(--font-lato);
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 6rem;
          font-weight: 300;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .collections-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 5rem;
        }

        .collection-card {
          position: relative;
          height: 500px;
          overflow: hidden;
          transition: all 0.4s ease;
          cursor: pointer;
        }

        .collection-card:hover {
          transform: translateY(-10px);
        }

        .collection-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
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
          padding: 3rem;
        }

        .collection-content {
          color: white;
          text-align: left;
          width: 100%;
        }

        .collection-name {
          font-family: var(--font-playfair);
          font-size: 2rem;
          margin-bottom: 1rem;
          font-weight: 300;
          letter-spacing: 1px;
        }

        .collection-description {
          font-family: var(--font-lato);
          font-size: 1rem;
          opacity: 0.9;
          font-weight: 300;
          line-height: 1.6;
        }

        .shop-cta {
          display: inline-block;
          padding: 18px 45px;
          font-size: 1rem;
          font-family: var(--font-lato);
          font-weight: 400;
          color: #ffffff;
          background: #2c2c2c;
          border: 2px solid #2c2c2c;
          cursor: pointer;
          text-transform: uppercase;
          text-decoration: none;
          letter-spacing: 2px;
          transition: all 0.4s ease;
        }

        .shop-cta:hover {
          background: transparent;
          color: #2c2c2c;
          border-color: #2c2c2c;
        }

        /* Features Section */
        .features-section {
          padding: 8rem 2rem;
          background: #ffffff;
        }

        .features-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4rem;
          text-align: center;
        }

        .feature-item {
          padding: 2rem 1rem;
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 2rem;
          color: #d4af37;
        }

        .feature-title {
          font-family: var(--font-playfair);
          font-size: 1.3rem;
          color: #2c2c2c;
          margin-bottom: 1rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .feature-text {
          font-family: var(--font-lato);
          color: #666;
          line-height: 1.6;
          font-weight: 300;
        }

        @media (max-width: 1024px) {
          .brand-story-grid {
            grid-template-columns: 1fr;
            gap: 4rem;
          }
          
          .collections-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 3rem;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 3rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }
          
          .hero-description {
            font-size: 1rem;
          }
          
          .brand-story-title {
            font-size: 2.5rem;
          }
          
          .collections-title {
            font-size: 2.5rem;
          }
          
          .collections-grid {
            grid-template-columns: 1fr;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .brand-highlights {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h2 className="hero-subtitle">Premium Fashion</h2>
          <h1 className="hero-title">Kalamkar Couture</h1>
          <p className="hero-description">
            Discover the art of handcrafted fashion. Each piece in our collection represents 
            the perfect fusion of traditional artistry and contemporary elegance, designed 
            for the modern woman who appreciates timeless sophistication.
          </p>
          <Link href="/shop" className="hero-cta">
            Shop Collection
          </Link>
          <a href="#story" className="hero-cta-secondary">
            Our Story
          </a>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="brand-story-section" id="story">
        <div className="brand-story-container">
          <div className="brand-story-grid">
            <div className="brand-story-content">
              <h2 className="brand-story-title">Crafted with Passion</h2>
              <p className="brand-story-text">
                {siteSettings?.site_description || 
                "At Kalamkar, we believe in the power of authentic craftsmanship. Every garment tells a story of dedication, skill, and artistic vision. Our master artisans pour their expertise into each piece, creating clothing that transcends trends and celebrates individuality."}
              </p>
              <p className="brand-story-text">
                From the selection of premium fabrics to the final hand-painted details, 
                we maintain the highest standards of quality and artistry. Our commitment 
                to sustainable fashion ensures that beauty and responsibility go hand in hand.
              </p>
            </div>
            
            <div className="brand-story-image">
              <img 
                src="https://images.pexels.com/photos/7148621/pexels-photo-7148621.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Artisan at work creating beautiful clothing"
              />
            </div>
          </div>
          
          <div className="brand-highlights">
            <div className="highlight-card">
              <div className="highlight-number">15+</div>
              <h3 className="highlight-title">Years of Excellence</h3>
              <p className="highlight-text">
                Over a decade of creating exceptional handcrafted fashion pieces
              </p>
            </div>
            
            <div className="highlight-card">
              <div className="highlight-number">100%</div>
              <h3 className="highlight-title">Handcrafted</h3>
              <p className="highlight-text">
                Every piece is individually crafted by skilled artisans
              </p>
            </div>
            
            <div className="highlight-card">
              <div className="highlight-number">1000+</div>
              <h3 className="highlight-title">Happy Customers</h3>
              <p className="highlight-text">
                Trusted by fashion enthusiasts worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="collections-section">
        <div className="collections-container">
          <h2 className="collections-title">Signature Collections</h2>
          <p className="collections-subtitle">Timeless Elegance in Every Thread</p>
          
          <div className="collections-grid">
            <div className="collection-card">
              <img 
                src="https://images.pexels.com/photos/8839887/pexels-photo-8839887.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Elegant Saree Collection" 
                className="collection-image"
              />
              <div className="collection-overlay">
                <div className="collection-content">
                  <h3 className="collection-name">Heritage Sarees</h3>
                  <p className="collection-description">
                    Timeless sarees featuring intricate hand-painted designs inspired by classical Indian motifs
                  </p>
                </div>
              </div>
            </div>

            <div className="collection-card">
              <img 
                src="https://images.pexels.com/photos/8839867/pexels-photo-8839867.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Contemporary Kurta Collection" 
                className="collection-image"
              />
              <div className="collection-overlay">
                <div className="collection-content">
                  <h3 className="collection-name">Modern Kurtas</h3>
                  <p className="collection-description">
                    Contemporary silhouettes with traditional craftsmanship for the modern wardrobe
                  </p>
                </div>
              </div>
            </div>

            <div className="collection-card">
              <img 
                src="https://images.pexels.com/photos/8434713/pexels-photo-8434713.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Designer Blouse Collection" 
                className="collection-image"
              />
              <div className="collection-overlay">
                <div className="collection-content">
                  <h3 className="collection-name">Couture Blouses</h3>
                  <p className="collection-description">
                    Statement blouses that transform any ensemble into a masterpiece of style
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link href="/shop" className="shop-cta">
            Explore All Collections
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🎨</div>
              <h3 className="feature-title">Hand-Painted Art</h3>
              <p className="feature-text">
                Each design is meticulously hand-painted by master artisans using traditional techniques
              </p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🌿</div>
              <h3 className="feature-title">Sustainable Fashion</h3>
              <p className="feature-text">
                Eco-friendly materials and processes ensure our commitment to environmental responsibility
              </p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">✨</div>
              <h3 className="feature-title">Limited Edition</h3>
              <p className="feature-text">
                Exclusive designs with limited quantities ensure your piece remains unique and special
              </p>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">🚚</div>
              <h3 className="feature-title">Worldwide Delivery</h3>
              <p className="feature-text">
                Premium packaging and secure delivery to fashion enthusiasts around the globe
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
