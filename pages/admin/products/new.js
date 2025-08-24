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
  const [files, setFiles] = useState([]); // Changed to array for multiple files
  const [uploading, setUploading] = useState(false);
  const router = useRouter();


  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 3) {
      alert('You can only upload up to 3 images.');
      return;
    }
    if (selectedFiles.length < 3) {
      alert('You must upload exactly 3 images.');
      return;
    }
    setFiles(selectedFiles);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length !== 3) {
      alert('Please select exactly 3 images to upload.');
      return;
    }


    setUploading(true);


    try {
      // Upload all images and collect their URLs
      const imageUrls = [];


      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}_${i}_${file.name}`;


        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);


        if (uploadError) {
          throw uploadError;
        }


        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);


        imageUrls.push(urlData.publicUrl);
      }


      // Insert the product data with imageUrls array
      const { data: productData, error: insertError } = await supabase
        .from('products')
        .insert([{ name, description, price, imageUrls, category }]);


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
            <label htmlFor="images">Product Images (Exactly 3 required)</label>
            <input type="file" id="images" accept="image/*" multiple onChange={handleFileChange} required />
            <div className="file-info">
              {files.length > 0 && `Selected ${files.length} image(s)`}
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