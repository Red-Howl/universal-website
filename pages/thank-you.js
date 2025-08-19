import React from 'react';
import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1 style={{ fontFamily: 'var(--font-playfair)', color: 'var(--color-primary-teal)' }}>
        Thank You!
      </h1>
      <p style={{ fontFamily: 'var(--font-lato)', fontSize: '1.2rem', margin: '1rem 0 2rem 0' }}>
        Your order has been placed successfully. We will be in touch shortly.
      </p>
      <Link href="/shop" style={{ 
        backgroundColor: 'var(--color-primary-teal)', 
        color: 'white', 
        padding: '1rem 2rem', 
        textDecoration: 'none', 
        borderRadius: '5px' 
      }}>
        Continue Shopping
      </Link>
    </div>
  );
}