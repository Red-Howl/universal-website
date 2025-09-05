import React from 'react';
import Link from 'next/link';

export default function Footer({ siteSettings }) {
  return (
    <>
    <style jsx>{`
      .footer { 
        text-align: center; 
        padding: 0.3rem 1rem; 
        margin-top: 0.5rem; 
        background-color: #000000; 
        border-top: 1px solid #333; 
        font-family: var(--font-lato); 
        color: #ffffff; 
        height: 25vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .footer-content { 
        max-width: 800px; 
        margin: auto; 
        width: 100%;
      }
      .footer-sections {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 0.3rem;
        margin-bottom: 0.3rem;
      }
      .footer-section {
        text-align: center;
      }
      .footer-section h3 {
        font-size: 0.7rem;
        font-weight: bold;
        margin-bottom: 0.2rem;
        color: #ffffff;
      }
      .social-links { 
        margin-bottom: 0.2rem; 
      }
      .social-links a { 
        margin: 0 0.15rem; 
        text-decoration: none; 
        color: #cccccc; 
        font-size: 0.65rem;
        padding: 0.15rem;
        border-radius: 4px;
        transition: all 0.3s ease;
      }
      .social-links a:hover {
        background-color: #333;
        color: #ffffff;
      }
      .contact-info p { 
        margin: 0.15rem 0; 
        font-size: 0.6rem;
      }
      .contact-info a:hover {
        background-color: #333;
        color: #ffffff;
        transform: scale(1.05);
      }
      .legal-links {
        margin-top: 0.2rem;
      }
      .legal-links a {
        color: #cccccc;
        text-decoration: none;
        margin: 0 0.15rem;
        font-size: 0.55rem;
        transition: color 0.3s ease;
        display: inline-block;
        padding: 0.1rem 0.15rem;
      }
      .legal-links a:hover {
        color: var(--color-primary-teal);
      }
      .copyright-text { 
        margin-top: 0.3rem; 
        font-size: 0.55rem; 
        color: #888;
      }
      .copyright-text p {
        margin: 0;
      }
      @media (max-width: 768px) {
        .footer-sections {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        .legal-links a {
          display: block;
          margin: 0.15rem 0;
          text-align: center;
        }
      }
    `}</style>
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-sections">
          <div className="footer-section">
            <h3>Connect With Us</h3>
            <div className="social-links">
              {siteSettings?.social_instagram && <a href={siteSettings.social_instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
              {siteSettings?.social_youtube && <a href={siteSettings.social_youtube} target="_blank" rel="noopener noreferrer">YouTube</a>}
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Contact Information</h3>
            <div className="contact-info">
              {siteSettings?.contact_phone && (
                <p>
                  <a href={`tel:${siteSettings.contact_phone}`} style={{ 
                    color: 'inherit', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                  }}>
                    📞 {siteSettings.contact_phone}
                  </a>
                </p>
              )}
              {siteSettings?.contact_email && (
                <p>
                  <a href={`mailto:${siteSettings.contact_email}`} style={{ 
                    color: 'inherit', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                  }}>
                    ✉️ {siteSettings.contact_email}
                  </a>
                </p>
              )}
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Legal</h3>
            <div className="legal-links">
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-use">Terms of Use</Link>
            </div>
            <div className="copyright-text">
              <p>© 2025 All Rights Reserved by SEMJ</p>
            </div>
          </div>
        </div>
        

      </div>
    </footer>
    </>
  );
}