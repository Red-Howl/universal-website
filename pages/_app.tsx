import '../styles/globals.css'
import Layout from '../components/Layout'
import { CartProvider } from '../context/CartContext';
import { supabase } from '../lib/supabase';

function MyApp({ Component, pageProps, siteSettings }) {
  return (
    <CartProvider>
      <Layout siteSettings={siteSettings}>
        <Component {...pageProps} siteSettings={siteSettings} />
      </Layout>
    </CartProvider>
  )
}

// For static export, we'll use getStaticProps instead of getInitialProps
MyApp.getInitialProps = async () => {
  // Return empty siteSettings for static export
  return { siteSettings: {} };
};

export default MyApp