import React from 'react';
import Link from 'next/link';

export default function TermsOfUsePage() {
  return (
    <>
      <style jsx>{`
        .terms-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
          font-family: var(--font-lato);
          line-height: 1.6;
          color: #333;
        }
        .terms-title {
          font-family: var(--font-playfair);
          font-size: 2.5rem;
          color: var(--color-primary-teal);
          margin-bottom: 2rem;
          text-align: center;
        }
        .terms-section {
          margin-bottom: 2rem;
        }
        .terms-section h2 {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 1rem;
          border-bottom: 2px solid var(--color-primary-teal);
          padding-bottom: 0.5rem;
        }
        .terms-section h3 {
          font-size: 1.2rem;
          font-weight: bold;
          color: #555;
          margin: 1.5rem 0 0.5rem 0;
        }
        .terms-section p {
          margin-bottom: 1rem;
        }
        .terms-section ul {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        .terms-section li {
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
      
      <div className="terms-container">
        <h1 className="terms-title">Terms of Use</h1>
        
        <div className="terms-section">
          <p><strong>Last Updated:</strong> January 2025</p>
          <p>These Terms of Use govern your use of our website and services. By accessing or using our website, you agree to be bound by these terms.</p>
        </div>

        <div className="terms-section">
          <h2>Acceptance of Terms</h2>
          <p>By using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.</p>
        </div>

        <div className="terms-section">
          <h2>Use of Website</h2>
          <p>You may use our website for lawful purposes only. You agree not to:</p>
          <ul>
            <li>Use the website for any illegal or unauthorized purpose</li>
            <li>Interfere with or disrupt the website&apos;s functionality</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use automated tools to access the website</li>
            <li>Transmit viruses or malicious code</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>Account Registration</h2>
          <p>To access certain features, you may need to create an account. You are responsible for:</p>
          <ul>
            <li>Providing accurate and complete information</li>
            <li>Maintaining the security of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>Purchases and Orders</h2>
          
          <h3>Order Acceptance</h3>
          <p>All orders are subject to acceptance and availability. We reserve the right to:</p>
          <ul>
            <li>Accept or decline any order</li>
            <li>Limit quantities per customer</li>
            <li>Cancel orders due to inventory issues</li>
            <li>Modify or discontinue products</li>
          </ul>

          <h3>Pricing and Payment</h3>
          <p>Prices are subject to change without notice. Payment must be made at the time of order placement using accepted payment methods.</p>

          <h3>Order Cancellation</h3>
          <p>Orders may be cancelled before processing begins. Once an order is processed, cancellation may not be possible.</p>
        </div>

        <div className="terms-section">
          <h2>Shipping and Delivery</h2>
          <p>We strive to process and ship orders promptly. However:</p>
          <ul>
            <li>Delivery times are estimates only</li>
            <li>We are not responsible for delays beyond our control</li>
            <li>Risk of loss transfers to you upon delivery</li>
            <li>You are responsible for providing accurate shipping information</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>Returns and Refunds</h2>
          <p>Our return policy allows returns within a specified time period, subject to:</p>
          <ul>
            <li>Items being in original condition</li>
            <li>Proper packaging and shipping</li>
            <li>Valid proof of purchase</li>
            <li>Exclusions for certain product types</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>Intellectual Property</h2>
          <p>All content on our website, including text, graphics, logos, and software, is our property or licensed to us and is protected by copyright and other intellectual property laws.</p>
        </div>

        <div className="terms-section">
          <h2>Privacy</h2>
          <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our website.</p>
        </div>

        <div className="terms-section">
          <h2>Disclaimers</h2>
          <p>Our website and services are provided &quot;as is&quot; without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to:</p>
          <ul>
            <li>Merchantability and fitness for a particular purpose</li>
            <li>Non-infringement of intellectual property rights</li>
            <li>Uninterrupted or error-free operation</li>
            <li>Accuracy of information or content</li>
          </ul>
        </div>

        <div className="terms-section">
          <h2>Limitation of Liability</h2>
          <p>In no event shall we be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or services.</p>
        </div>

        <div className="terms-section">
          <h2>Indemnification</h2>
          <p>You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your use of our website or violation of these terms.</p>
        </div>

        <div className="terms-section">
          <h2>Governing Law</h2>
          <p>These terms are governed by the laws of the jurisdiction in which we operate, without regard to conflict of law principles.</p>
        </div>

        <div className="terms-section">
          <h2>Changes to Terms</h2>
          <p>We may modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of the modified terms.</p>
        </div>

        <div className="terms-section">
          <h2>Contact Information</h2>
          <p>If you have questions about these Terms of Use, please contact us through our website or customer service channels.</p>
        </div>

        <Link href="/" className="back-link">← Back to Home</Link>
        
        <div className="last-updated">
          <p>Last Updated: January 2025</p>
        </div>
      </div>
    </>
  );
}
