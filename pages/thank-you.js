import React from 'react';
import Link from 'next/link';

export default function ThankYouPage({ siteSettings }) {
  const rawPhone = siteSettings?.contact_phone || '';
  const supportPhone = rawPhone.trim();
  const phoneDigits = supportPhone.replace(/\D/g, '');
  const telHref = phoneDigits ? `tel:${phoneDigits}` : undefined;
  const whatsappMessage = encodeURIComponent('Hi, I have a query about my recent order.');
  const whatsappHref = phoneDigits ? `https://wa.me/${phoneDigits}?text=${whatsappMessage}` : undefined;
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '70vh', padding: '2rem' }}>
      <style jsx>{`
        .card {
          width: min(720px, 92%);
          background: var(--color-card-bg);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          box-shadow: var(--shadow-medium);
          padding: 2rem;
          text-align: center;
          color: var(--color-dark-grey);
        }
        .icon {
          width: 84px; height: 84px;
          border-radius: 50%;
          display: grid; place-items: center;
          margin: 0 auto 1rem auto;
          background: var(--color-success);
          color: #fff;
          box-shadow: 0 10px 24px rgba(72,187,120,.35);
          animation: pop 420ms ease;
        }
        @keyframes pop { from { transform: scale(.7); opacity: .3 } to { transform: scale(1); opacity: 1 } }
        .title { font-family: var(--font-playfair); font-size: 2.2rem; margin: .25rem 0  .75rem 0; }
        .subtitle { font-family: var(--font-lato); font-size: 1.05rem; opacity: .9; }
        .row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 1.5rem 0; }
        .pill { background: var(--color-medium-grey); border: 1px solid var(--color-border); border-radius: 10px; padding: .6rem .9rem; font-size: .95rem; }
        .actions { display: flex; gap: 12px; justify-content: center; margin-top: 1.25rem; flex-wrap: wrap; }
        .btn { padding: .9rem 1.4rem; border-radius: 10px; text-decoration: none; font-weight: 600; box-shadow: var(--shadow-light); }
        .primary { background: var(--color-primary); color: var(--color-dark-grey); }
        .ghost { background: transparent; color: var(--color-dark-grey); border: 1px solid var(--color-border); }
        .tips { font-size: .9rem; opacity: .85; margin-top: 1.4rem; }
        @media (max-width: 640px) { .row { grid-template-columns: 1fr; } }
      `}</style>

      <div className="card slide-in-up">
        <div className="icon">✓</div>
        <h1 className="title">Thank you for your order!</h1>
        <p className="subtitle">We’ve received your order and sent a confirmation to your email. We’ll notify you when it’s on the way.</p>

        <div className="row">
          <div className="pill">Estimated delivery: 3–7 days</div>
          <div className="pill">
            Support: <span style={{ textDecoration: 'none' }}>{supportPhone || '+91 XXXXX XXXXX'}</span>
          </div>
          <div className="pill">
            Order updates via {whatsappHref ? (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>WhatsApp</a>
            ) : ('WhatsApp')}
          </div>
        </div>

        <div className="actions">
          <Link href="/account/orders" className="btn primary">View my orders</Link>
          <Link href="/shop" className="btn ghost">Continue shopping</Link>
        </div>

        <p className="tips">Tip: You can track all your orders and download invoices anytime from My Account → Orders.</p>
      </div>
    </div>
  );
}