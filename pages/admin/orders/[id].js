import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ORDER_STATUSES = ['New', 'Pending Confirmation', 'Awaiting Payment', 'Processing', 'Shipped', 'Completed', 'Cancelled'];

export default function OrderDetailsPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  async function fetchOrder() {
    const { data } = await supabase.from('orders').select('*').eq('id', id).single();
    if (data) {
      setOrder(data);
      setStatus(data.status || '');
      setDeliveryDate(data.estimated_delivery_date || '');
    }
    setLoading(false);
  }

  const handleUpdateStatus = async () => {
    const { error } = await supabase.from('orders').update({ status: status }).eq('id', order.id);
    if (error) alert('Error updating status: ' + error.message);
    else alert('Order status updated!');
  };

  const handleUpdateDeliveryDate = async () => {
    const { error } = await supabase.from('orders').update({ estimated_delivery_date: deliveryDate }).eq('id', order.id);
    if (error) alert('Error updating delivery date: ' + error.message);
    else alert('Delivery date updated!');
  };

  if (loading) return <AdminLayout><div>Loading...</div></AdminLayout>;
  if (!order) return <AdminLayout><div>Order not found.</div></AdminLayout>;

  return (
    <AdminLayout>
      <style jsx>{`
        .details-container { padding: 2rem; max-width: 900px; margin: auto; }
        .title { font-family: var(--font-playfair); font-size: 2.5rem; margin-bottom: 2rem; }
        .grid-container { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        .detail-card { background: var(--color-card-bg); border: 1px solid var(--color-border); border-radius: 8px; padding: 1.5rem; color: var(--color-dark-grey); }
        .card-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; color: var(--color-dark-grey); }
        .items-table { width: 100%; border-collapse: collapse; margin-top: 1rem; color: var(--color-dark-grey); }
        .items-table th, .items-table td { border: 1px solid var(--color-border); padding: 8px; text-align: left; vertical-align: middle; }
        .items-table th { background-color: var(--color-accent); }
        .item-image { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; }
        .screenshot { max-width: 100%; border-radius: 5px; margin-top: 10px; border: 1px solid var(--color-border); }
        .management-card { background: var(--color-medium-grey); border: 1px solid var(--color-border); border-radius: 8px; padding: 1.5rem; margin-top: 1.5rem; color: var(--color-dark-grey); }
        @media (min-width: 768px) { .grid-container { grid-template-columns: 1fr 1fr; } }
      `}</style>
      <div className="details-container">
        <h1 className="title">Order Details #{order.id}</h1>
        <div className="grid-container">
          <div className="detail-card">
            <h2 className="card-title">Customer Information</h2>
            <p><span>Name:</span> {order.customer_name}</p>
            <p><span>Email:</span> {order.customer_email}</p>
            <p><span>Phone:</span> {order.customer_phone}</p>
            <p><span>Address:</span> {order.customer_address}</p>
          </div>
          <div className="detail-card">
            <h2 className="card-title">Order Summary</h2>
            <p><span>Total Price:</span> ₹{order.total_price ? order.total_price.toLocaleString() : 'N/A'}</p>
            <p><span>Payment Method:</span> {order.payment_method}</p>
            <p><span>Order Date:</span> {new Date(order.created_at).toLocaleString()}</p>

            <h3 style={{marginTop: '2rem'}}>Items Ordered</h3>
            <table className="items-table">
              <thead><tr><th>Image</th><th>Product Name</th><th>Quantity</th></tr></thead>
              <tbody>
                {order.order_items?.map(item => (
                  <tr key={item.id}>
                    <td><img src={item.imageUrl} alt={item.name} className="item-image" /></td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {order.is_custom && order.custom_request_image_url && (
              <div style={{marginTop: '1rem'}}>
                <h4>Custom Design Image:</h4>
                <a href={order.custom_request_image_url} download>
                  <img src={order.custom_request_image_url} alt="Custom Design" style={{maxWidth: '200px', borderRadius: '8px'}} />
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="management-card">
          <h2 className="card-title">Order Management</h2>
          <div className="form-group">
            <label>Order Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={handleUpdateStatus} style={{marginLeft: '1rem'}}>Update Status</button>
          </div>
          <div className="form-group" style={{marginTop: '1rem'}}>
            <label>Estimated Delivery Date</label>
            <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
            <button onClick={handleUpdateDeliveryDate} style={{marginLeft: '1rem'}}>Update Date</button>
          </div>
        </div>

        {order.payment_screenshot_url && (
          <div className="detail-card" style={{marginTop: '1.5rem'}}>
            <h2 className="card-title">Payment Screenshot</h2>
            <a href={order.payment_screenshot_url} download>
              <img src={order.payment_screenshot_url} alt="Payment Screenshot" className="screenshot" />
            </a>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}