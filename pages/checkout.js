import React, { useContext, useState, useEffect, useRef } from 'react'; // Added useRef
import { useRouter } from 'next/router';
import { CartContext } from '../context/CartContext';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CheckoutPage() {
  const { cart, clearCart } = useContext(CartContext);
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const formRef = useRef(null); // --- NEW: A reference to our form

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.user_metadata.full_name || '',
          email: user.email || ''
        }));
      }
    }
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async (paymentMethod) => {
    // --- NEW: Check if all required fields are filled ---
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity(); // This will show the browser's default validation messages
      return; // Stop the function if the form is not valid
    }

    const { data: { user } } = await supabase.auth.getUser();
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    const formattedDeliveryDate = deliveryDate.toISOString().split('T')[0];

    const orderData = {
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_address: formData.address,
      order_items: cart,
      total_price: totalPrice,
      user_id: user ? user.id : null,
      payment_method: paymentMethod,
      status: paymentMethod === 'COD' ? 'New' : 'Pending Payment',
      estimated_delivery_date: formattedDeliveryDate,
    };

    const { data, error } = await supabase.from('orders').insert([orderData]).select().single();
    if (error) {
      alert('Error placing order: ' + error.message);
    } else {
      const orderId = data.id;
      if (paymentMethod === 'COD') {
        localStorage.removeItem('kalamkarCart');
        clearCart();
        router.push('/thank-you');
      } else if (paymentMethod === 'UPI') {
        const productName = cart[0]?.name || 'Kalamkar Purchase';
        router.push(`/complete-payment?orderId=${orderId}&amount=${totalPrice}&name=${encodeURIComponent(productName)}`);
      }
    }
  };

  return (
    <>
      <style jsx>{`
        /* All styles are the same */
        .checkout-container { display: flex; flex-direction: column-reverse; max-width: 1200px; margin: 2rem auto; padding: 2rem; gap: 3rem; }
        .form-container { flex: 2; }
        .summary-container { flex: 1; background-color: #f9f9f9; padding: 1.5rem; border-radius: 8px; height: fit-content; }
        .title { font-family: var(--font-playfair); font-size: 2.5rem; margin-bottom: 2rem; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; }
        .form-group input { width: 100%; padding: 0.8rem; border: 1px solid #ccc; border-radius: 5px; }
        .payment-options { margin-top: 2rem; border-top: 1px solid #eee; padding-top: 2rem; }
        .payment-btn { width: 100%; padding: 1rem; margin-bottom: 1rem; font-size: 1.1rem; font-weight: bold; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .upi-btn { background-color: var(--color-primary-teal); }
        .cod-btn { background-color: #7f8c8d; }
      `}</style>
      <div className="checkout-container">
        <div className="form-container">
          <h1 className="title">Shipping Details</h1>
          {/* --- NEW: The form tag is added here --- */}
          <form ref={formRef}>
            <div className="form-group"><label>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Email Address</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Phone Number</label><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required /></div>
            <div className="form-group"><label>Full Address</label><input type="text" name="address" value={formData.address} onChange={handleInputChange} required /></div>
          </form>
          <div className="payment-options">
            <h2 style={{ fontFamily: 'var(--font-playfair)'}}>Choose Payment Method</h2>
            <button type="button" onClick={() => handlePlaceOrder('UPI')} className="payment-btn upi-btn">Pay with UPI / QR Code</button>
            <button type="button" onClick={() => handlePlaceOrder('COD')} className="payment-btn cod-btn">Cash on Delivery</button>
          </div>
        </div>
        <div className="summary-container">
          <h2 className="summary-title">Order Summary</h2>
          {cart.map(item => (
            <div className="summary-item" key={item.id}>
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </>
  );
}