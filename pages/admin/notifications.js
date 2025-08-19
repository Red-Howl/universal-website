import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    setNotifications(data || []);
    setLoading(false);
  }

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!message) return;

    const { error } = await supabase.from('notifications').insert([{ message }]);
    if (error) {
      alert('Error sending notification: ' + error.message);
    } else {
      setMessage('');
      fetchNotifications(); // Refresh the list
      alert('Notification sent to all users!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
        await supabase.from('notifications').delete().eq('id', id);
        fetchNotifications(); // Refresh the list
    }
  }

  if (loading) return <AdminLayout><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <style jsx>{`
        /* Styles are similar to other admin pages */
      `}</style>
      <div className="admin-container">
        <h1 className="admin-title">Send Notifications</h1>
        <div className="form-section">
          <form onSubmit={handleSendNotification}>
            <div className="form-group">
              <label>Notification Message</label>
              <textarea rows="4" value={message} onChange={(e) => setMessage(e.target.value)} required />
            </div>
            <button type="submit" className="save-btn">Send to All Users</button>
          </form>
        </div>

        <div className="form-section">
            <h2>Sent Notifications</h2>
            <table className="product-table">
                <thead><tr><th>Message</th><th>Date Sent</th><th>Actions</th></tr></thead>
                <tbody>
                    {notifications.map(notif => (
                        <tr key={notif.id}>
                            <td>{notif.message}</td>
                            <td>{new Date(notif.created_at).toLocaleString()}</td>
                            <td><button onClick={() => handleDelete(notif.id)} className="action-btn delete-btn">Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </AdminLayout>
  );
}