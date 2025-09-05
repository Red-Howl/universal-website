import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function MyOrdersPage({ siteSettings }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      const { data, error } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) console.error('Error fetching orders:', error);
      else setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, [router]);

  if (loading) return <div>Loading your orders...</div>;

  return (
    <>
    <style jsx>{`
      .orders-container { max-width: 1000px; margin: 2rem auto; padding: 2rem; }
      .title { font-family: var(--font-playfair); font-size: 2.5rem; margin-bottom: 2rem; }
      .order-card { background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 8px; margin-bottom: 1.5rem; padding: 1.5rem; color: var(--color-dark-grey); }
      .order-header { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; }
      .item-with-image { display: flex; align-items: center; gap: 15px; margin-bottom: 10px; }
      .item-image { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; }
      .delivery-date { color: var(--color-dark-grey); font-weight: bold; }
      .customer-care-section { 
        background: var(--color-card-bg); 
        border: 1px solid var(--color-border); 
        border-radius: 8px; 
        padding: 1rem 1.5rem; 
        margin-bottom: 2rem; 
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.2s ease;
      }
      .customer-care-section:hover {
        background: var(--color-medium-grey);
        border-color: var(--color-border);
      }
      .customer-care-title { 
        font-size: 0.95rem; 
        font-weight: 500; 
        color: var(--color-secondary); 
        margin: 0; 
      }
      .customer-care-number { 
        font-size: 1rem; 
        font-weight: 600; 
        color: var(--color-dark-grey); 
        margin: 0; 
        font-family: monospace;
      }
      @media (min-width: 600px) { .order-header { flex-direction: row; justify-content: space-between; } }
    `}</style>
    <div className="orders-container">
      <h1 className="title">My Orders</h1>
      
      {/* Customer Care Section */}
      <div className="customer-care-section">
        <p className="customer-care-title">Customer Care</p>
        <p className="customer-care-number">
          {siteSettings?.contact_phone || 'Contact us for support'}
        </p>
      </div>
      
      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <p><b>Order ID:</b> {order.id}</p>
                <p><b>Date:</b> {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p><b>Total:</b> ₹{order.total_price ? order.total_price.toLocaleString() : 'Awaiting Quote'}</p>
                <p><b>Status:</b> {order.status}</p>
              </div>
            </div>
            <div>
              {/* --- NEW: Display Estimated Delivery Date --- */}
              {order.estimated_delivery_date && (
                <p className="delivery-date">
                  Estimated Delivery: {new Date(order.estimated_delivery_date).toLocaleDateString()}
                </p>
              )}
              <h4 style={{ marginTop: order.estimated_delivery_date ? '1rem' : '0' }}>Items:</h4>
              {order.order_items?.map(item => (
                <div key={item.id} className="item-with-image">
                  <img src={item.imageUrl} alt={item.name} className="item-image" />
                  <span>{item.name} x {item.quantity}</span>
                </div>
              )) || (
                <div className="item-with-image">
                  {order.custom_request_image_url && <img src={order.custom_request_image_url} alt="Custom Design" className="item-image" />}
                  <span>{order.custom_request_description || 'Custom Order Request'}</span>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
    </>
  );
}