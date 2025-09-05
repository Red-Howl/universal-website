import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching orders:', error);
    else setOrders(data);
    setLoading(false);
  }

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        const { error } = await supabase.from('orders').delete().eq('id', orderId);
        if (error) {
          alert('Error deleting order: ' + error.message);
        } else {
          alert('Order deleted successfully!');
          fetchOrders(); // Refresh the orders list
        }
      } catch (error) {
        alert('Error deleting order: ' + error.message);
      }
    }
  };

  return (
    <AdminLayout>
      <style jsx>{`
        .admin-container { padding: 2rem; }
        .header-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .admin-title { font-family: var(--font-playfair); font-size: 2.5rem; margin: 0; }
        .orders-table { width: 100%; border-collapse: collapse; background-color: var(--color-card-bg); border-radius: 8px; overflow: hidden; box-shadow: var(--shadow-medium); color: var(--color-dark-grey); }
        .orders-table th, .orders-table td { border: 1px solid var(--color-border); padding: 12px; text-align: left; }
        .orders-table th { background-color: var(--color-accent); font-weight: bold; color: var(--color-dark-grey); }
        .orders-table tr:nth-child(even) { background-color: var(--color-medium-grey); }
        .action-btn { background-color: var(--color-accent-gold); color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 5px; border: none; cursor: pointer; }
        .add-manual-btn { background-color: #9b59b6; padding: 0.8rem 1.5rem; font-weight: bold; }
      `}</style>
      <div className="admin-container">
        <div className="header-container">
          <h1 className="admin-title">Manage Orders</h1>
          {/* --- THIS IS THE NEW BUTTON --- */}
          <Link href="/admin/orders/new" className="action-btn add-manual-btn">
            + Add Manual Order
          </Link>
        </div>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>{order.customer_name}</td>
                <td>
                  ₹{order.total_price ? order.total_price.toLocaleString() : 'N/A'}
                </td>
                <td>{order.status}</td>
                <td>
                  <Link href={`/admin/orders/${order.id}`} className="action-btn">
                    View Details
                  </Link>
                  <button 
                    onClick={() => handleDeleteOrder(order.id)} 
                    className="action-btn delete-btn"
                    style={{ marginLeft: '0.5rem', backgroundColor: '#dc3545' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}