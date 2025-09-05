import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <>
      <style jsx>{`
        .privacy-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
          font-family: var(--font-lato);
          line-height: 1.6;
          color: #333;
        }
        .privacy-title {
          font-family: var(--font-playfair);
          font-size: 2.5rem;
          color: var(--color-primary-teal);
          margin-bottom: 2rem;
          text-align: center;
        }
        .privacy-section {
          margin-bottom: 2rem;
        }
        .privacy-section h2 {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 1rem;
          border-bottom: 2px solid var(--color-primary-teal);
          padding-bottom: 0.5rem;
        }
        .privacy-section h3 {
          font-size: 1.2rem;
          font-weight: bold;
          color: #555;
          margin: 1.5rem 0 0.5rem 0;
        }
        .privacy-section p {
          margin-bottom: 1rem;
        }
        .privacy-section ul {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        .privacy-section li {
          margin-bottom: 0.5rem;
        }
        .back-link {
          display: inline-block;
          margin-top: 2rem;
          color: var(--color-primary-teal);
          text-decoration: none;
          font-weight: bold;
        }
        .back-link:hover {
          text-decoration: underline;
        }
        .last-updated {
          font-style: italic;
          color: #666;
          text-align: center;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }
      `}</style>
      
      <div className="privacy-container">
        <h1 className="privacy-title">Privacy Policy</h1>
        
        <div className="privacy-section">
          <p><strong>Last Updated:</strong> January 2025</p>
          <p>This Privacy Policy describes how we collect, use, and protect your personal information when you visit our website, make purchases, or interact with our services.</p>
        </div>

        <div className="privacy-section">
          <h2>Information We Collect</h2>
          
          <h3>Personal Information</h3>
          <p>We collect personal information that you provide to us, including:</p>
          <ul>
            <li>Name and contact information (email address, phone number)</li>
            <li>Billing and shipping addresses</li>
            <li>Payment information (processed securely through our payment partners)</li>
            <li>Account credentials and preferences</li>
            <li>Order history and purchase details</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>When you visit our website, we automatically collect:</p>
          <ul>
            <li>Device information (IP address, browser type, operating system)</li>
            <li>Usage data (pages visited, time spent, links clicked)</li>
            <li>Cookies and similar tracking technologies</li>
            <li>Location information (if you grant permission)</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Provide customer support and respond to inquiries</li>
            <li>Send order confirmations and shipping updates</li>
            <li>Process payments and prevent fraud</li>
            <li>Improve our website and services</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>Order Processing and Payments</h2>
          <p>When you place an order:</p>
          <ul>
            <li>We collect necessary information to process your order</li>
            <li>Payment information is encrypted and processed securely</li>
            <li>We share order details with shipping partners for delivery</li>
            <li>Order history is stored for customer service purposes</li>
            <li>We may contact you regarding order status or issues</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
          <ul>
            <li>Payment processors to complete transactions</li>
            <li>Shipping partners to deliver your orders</li>
            <li>Service providers who assist in our operations</li>
            <li>Legal authorities when required by law</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information:</p>
          <ul>
            <li>Encryption of sensitive data in transit and at rest</li>
            <li>Secure payment processing</li>
            <li>Regular security assessments</li>
            <li>Limited access to personal information</li>
            <li>Secure data storage practices</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent for data processing</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul>
            <li>Remember your preferences</li>
            <li>Analyze website traffic</li>
            <li>Improve user experience</li>
            <li>Provide personalized content</li>
          </ul>
          <p>You can control cookie settings through your browser preferences.</p>
        </div>

        <div className="privacy-section">
          <h2>Children&apos;s Privacy</h2>
          <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
        </div>

        <div className="privacy-section">
          <h2>Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website.</p>
        </div>

        <div className="privacy-section">
          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy or our data practices, please contact us through our website or customer service channels.</p>
        </div>

        <Link href="/" className="back-link">← Back to Home</Link>
        
        <div className="last-updated">
          <p>Last Updated: January 2025</p>
        </div>
      </div>
    </>
  );
}
