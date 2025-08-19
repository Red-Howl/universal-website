import React, { useState, useEffect, useContext } from 'react'; // Added useContext
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { CartContext } from '../context/CartContext'; // Import the CartContext

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CompletePaymentPage() {
  const router = useRouter();
  const { orderId, amount, name } = router.query;
  const { clearCart } = useContext(CartContext); // --- NEW: Get the clearCart function
  const [upiId, setUpiId] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkUserAndFetchUpi() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase.from('site_settings').select('setting_value').eq('setting_name', 'upi_id').single();
      if (data) {
        const id = data.setting_value;
        setUpiId(id);
        const transactionNote = name || `Kalamkar Order #${orderId}`;
        const link = `upi://pay?pa=${id}&pn=Kalamkar&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
        setPaymentLink(link);
      }
    }
    if (amount && orderId) {
      checkUserAndFetchUpi();
    }
  }, [orderId, amount, name, router]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleScreenshotUpload = async () => {
    if (!file) {
      alert('Please select your payment screenshot to upload.');
      return;
    }
    setUploading(true);
    const fileName = `order_${orderId}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('payment-screenshots').upload(fileName, file);

    if (uploadError) {
      alert('Error uploading screenshot: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('payment-screenshots').getPublicUrl(fileName);
    const screenshotUrl = urlData.publicUrl;

    const { error: updateError } = await supabase.from('orders').update({ payment_screenshot_url: screenshotUrl, status: 'Pending Confirmation' }).eq('id', orderId);

    setUploading(false);
    if (updateError) {
      alert('Error updating order: ' + updateError.message);
    } else {
      // --- NEW: Clear the cart upon successful order completion ---
      clearCart();
      router.push('/thank-you');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ fontFamily: 'var(--font-playfair)' }}>Complete Your Payment</h1>
      <p>Order ID: {orderId}</p>
      <h2>Total Amount: ₹{parseFloat(amount || 0).toLocaleString()}</h2>
      <p>Please pay using the link below, then upload a screenshot of the successful transaction to confirm your order.</p>

      {paymentLink ? (
        <a href={paymentLink} style={{
          display: 'inline-block', padding: '1rem 2rem', margin: '2rem 0',
          backgroundColor: 'var(--color-primary-teal)', color: 'white',
          textDecoration: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold'
        }}>
          Click Here to Pay with UPI
        </a>
      ) : <p>Generating payment link...</p>}

      <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
        <h3>Step 2: Upload Confirmation Screenshot</h3>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleScreenshotUpload} disabled={uploading || !file} style={{ marginLeft: '1rem' }} className="save-btn">
          {uploading ? 'Uploading...' : 'Confirm & Finish Order'}
        </button>
      </div>
    </div>
  );
}