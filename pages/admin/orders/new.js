import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function NewOrderPage({ users }) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      alert('Please select a customer.');
      return;
    }
    setUploading(true);

    let imageUrl = null;
    if (file) {
      const fileName = `${selectedUserId}_${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('manual-order-designs').upload(fileName, file);
      if (uploadError) {
        alert('Error uploading image: ' + uploadError.message);
        setUploading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('manual-order-designs').getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const selectedUser = users.find(u => u.id === selectedUserId);
    const orderData = {
      user_id: selectedUserId,
      customer_name: selectedUser.email,
      customer_email: selectedUser.email,
      is_custom: true,
      status: 'Awaiting Payment',
      payment_status: 'Pending Advance Payment',
      custom_request_description: description,
      custom_request_image_url: imageUrl,
      total_price: price,
    };

    const { error } = await supabase.from('orders').insert([orderData]);
    setUploading(false);
    if (error) {
      alert('Error creating order: ' + error.message);
    } else {
      router.push('/admin/orders');
    }
  };

  return (
    <AdminLayout>
      <div className="form-container" style={{maxWidth: '800px', margin: '2rem auto', padding: '2rem'}}>
        <h1 className="form-title" style={{fontFamily:'var(--font-playfair)'}}>Add Manual Custom Order</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Customer (by Email)</label>
            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} required>
              <option value="">-- Please select a customer --</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.email}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Order Description</label>
            <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Total Price (₹)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Upload Design Image (Optional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <button type="submit" className="save-btn" disabled={uploading}>
            {uploading ? 'Saving...' : 'Create Order'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

// This function securely fetches your customer list for the dropdown
export async function getServerSideProps(context) {
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
        console.error("Error fetching users:", error);
        return { props: { users: [] } };
    }

    // Filter out the admin user from the list
    const customerUsers = users.filter(u => u.email !== 'admin@kalamkar.art');

    return { props: { users: customerUsers ? customerUsers.map(u => ({ id: u.id, email: u.email })) : [] } };
}