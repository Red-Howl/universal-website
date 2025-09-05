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
  const [quantity, setQuantity] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select an image to upload.');
      return;
    }

    setUploading(true);

    try {
      // Upload single image
      const fileName = `${Date.now()}_${file.name}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      // Insert the product data with single imageUrl
      const { data: productData, error: insertError } = await supabase
        .from('products')
        .insert([{ name, description, price, imageUrl: urlData.publicUrl, category, quantity: parseInt(quantity) || 0 }]);

      if (insertError) {
        throw insertError;
      }

      router.push('/admin/products');
    } catch (error) {
      alert('Error adding product: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <style jsx>{`
        .form-container { max-width: 800px; margin: 2rem auto; padding: 2rem; }
        .form-title { font-family: var(--font-playfair); font-size: 2.5rem; margin-bottom: 2rem; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
        .form-group input, .form-group textarea { width: 100%; padding: 0.8rem; border: 1px solid #ccc; border-radius: 5px; font-size: 1rem; }
        .save-btn { padding: 1rem 2rem; background-color: var(--color-primary-teal); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.1rem; }
        .save-btn:disabled { background-color: #ccc; }
        .file-info { margin-top: 0.5rem; font-size: 0.9rem; color: #666; }
      `}</style>
      <div className="form-container">
        <h1 className="form-title">Add a New Product</h1>
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
            <label htmlFor="quantity">Quantity in Stock</label>
            <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="0" required />
          </div>
          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            <input type="file" id="image" accept="image/*" onChange={handleFileChange} required />
            <div className="file-info">
              {file && `Selected: ${file.name}`}
            </div>
          </div>
          <button type="submit" className="save-btn" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Save Product'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}