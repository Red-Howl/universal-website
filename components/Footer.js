import React from 'react';
import Link from 'next/link';

export default function Footer({ siteSettings }) {
  return (
    <>
    <style jsx>{`
      .footer { text-align: center; padding: 3rem 1rem; margin-top: 4rem; background-color: var(--color-background-cream); border-top: 1px solid #e7e7e7; font-family: var(--font-lato); color: #555; }
      .footer-content { max-width: 800px; margin: auto; }
      .social-links { margin-bottom: 1.5rem; }
      .social-links a { margin: 0 1rem; text-decoration: none; color: #333; font-size: 1.5rem; }
      .contact-info p { margin: 0.5rem 0; }
      .copyright { margin-top: 2rem; font-size: 0.9rem; color: #888; }
    `}</style>
    <footer className="footer">
      <div className="footer-content">
        <div className="social-links">
          {siteSettings?.social_instagram && <a href={siteSettings.social_instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
          {siteSettings?.social_youtube && <a href={siteSettings.social_youtube} target="_blank" rel="noopener noreferrer">Youtube</a>}
        </div>
        <div className="contact-info">
          <p>{siteSettings?.contact_phone}</p>
          <p>{siteSettings?.contact_email}</p>
        </div>
        <div className="copyright">
          <p>© 2025 {siteSettings?.site_name || 'Kalamkar'}. All Rights Reserved by SEMJ.</p>
        </div>
      </div>
    </footer>
    </>
  );
}