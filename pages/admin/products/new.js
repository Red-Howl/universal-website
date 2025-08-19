import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function NewProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [files, setFiles] = useState([]); 
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 3) {
      alert('You can only upload a maximum of 3 images.');
      e.target.value = null; // Clear the file input
      setFiles([]); // Use the correct setter function
      return;
    }

    setFiles(selectedFiles); // Use the correct setter function
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert('Please select at least one image to upload.');
      return;
    }

    setUploading(true);

    const uploadPromises = files.map(file => {
      const fileName = `${Date.now()}_${file.name}`;
      return supabase.storage.from('product-images').upload(fileName, file);
    });

    const uploadResults = await Promise.all(uploadPromises);

    const uploadError = uploadResults.find(result => result.error);
    if (uploadError) {
      setUploading(false);
      alert('Error uploading one or more images: ' + uploadError.error.message);
      return;
    }

    const imageUrls = uploadResults.map(result => {
        const { data } = supabase.storage.from('product-images').getPublicUrl(result.data.path);
        return data.publicUrl;
    });

    const { error: insertError } = await supabase
      .from('products')
      .insert([{ name, description, price, category, imageUrls }]);

    setUploading(false);

    if (insertError) {
      alert('Error adding product: ' + insertError.message);
    } else {
      router.push('/admin/products');
    }
  };

  return (
    <AdminLayout>
      <div className="form-container" style={{maxWidth: '800px', margin: '2rem auto', padding: '2rem'}}>
        <h1 className="form-title" style={{fontFamily:'var(--font-playfair)'}}>Add a New Product</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="image">Product Images (up to 3)</label>
            <input 
              type="file" 
              id="image" 
              accept="image/*" 
              multiple 
              onChange={handleFileChange} 
              required 
            />
          </div>

          <button type="submit" className="save-btn" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Save Product'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}