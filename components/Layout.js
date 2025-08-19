import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const mainContentStyle = {
  minHeight: '80vh',
};

// Layout now receives the settings and passes them to Navbar and Footer
export default function Layout({ children, siteSettings }) {
  return (
    <>
      <Navbar siteSettings={siteSettings} />
      <main style={mainContentStyle}>{children}</main>
      <Footer siteSettings={siteSettings} />
    </>
  );
}