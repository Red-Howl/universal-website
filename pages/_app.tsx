import '../styles/globals.css'
import Layout from '../components/Layout'
import { CartProvider } from '../context/CartContext';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function MyApp({ Component, pageProps, siteSettings }) {
  return (
    <CartProvider>
      <Layout siteSettings={siteSettings}>
        {/* --- THIS LINE IS UPDATED --- */}
        <Component {...pageProps} siteSettings={siteSettings} />
      </Layout>
    </CartProvider>
  )
}

MyApp.getInitialProps = async (ctx) => {
  const { data } = await supabase.from('site_settings').select('*');
  const settingsObject = data ? data.reduce((acc, setting) => {
    acc[setting.setting_name] = setting.setting_value;
    return acc;
  }, {}) : {};
  return { siteSettings: settingsObject };
};

export default MyApp