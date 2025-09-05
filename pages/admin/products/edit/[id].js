import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/AdminLayout';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function EditProductPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) {
        console.error('Error fetching product:', error);
        alert('Error fetching product: ' + error.message);
        router.push('/admin/products');
      } else {
        setProduct(data);
        setName(data.name || '');
        setDescription(data.description || '');
        setPrice(data.price || '');
        setCategory(data.category || '');
        setQuantity(data.quantity || '');
        setCurrentImageUrl(data.imageUrl || '');
      }
      setLoading(false);
    }
    
    fetchProduct();
  }, [id, router]);

  const setProduct = (product) => {
    setName(product.name || '');
    setDescription(product.description || '');
    setPrice(product.price || '');
    setCategory(product.category || '');
    setQuantity(product.quantity || '');
    setCurrentImageUrl(product.imageUrl || '');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = currentImageUrl;

      // Upload new image if selected
      if (file) {
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

        imageUrl = urlData.publicUrl;
      }

      // Update the product
      const { error: updateError } = await supabase
        .from('products')
        .update({ 
          name, 
          description, 
          price: parseFloat(price), 
          imageUrl, 
          category,
          quantity: parseInt(quantity) || 0,
          ordered_quantity: 0  // Reset ordered quantity when product is edited
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      alert('Product updated successfully!');
      router.push('/admin/products');
    } catch (error) {
      alert('Error updating product: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <AdminLayout><div>Loading product...</div></AdminLayout>;
  }

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
        .current-image { max-width: 200px; border-radius: 8px; margin-top: 0.5rem; }
        .button-group { display: flex; gap: 1rem; margin-top: 2rem; }
        .cancel-btn { padding: 1rem 2rem; background-color: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.1rem; text-decoration: none; }
      `}</style>
      
      <div className="form-container">
        <h1 className="form-title">Edit Product</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              rows="4" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input 
              type="number" 
              id="price" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input 
              type="text" 
              id="category" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">Quantity in Stock</label>
            <input 
              type="number" 
              id="quantity" 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)} 
              min="0"
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            {currentImageUrl && (
              <div>
                <p>Current Image:</p>
                <img src={currentImageUrl} alt="Current product" className="current-image" />
              </div>
            )}
            <input 
              type="file" 
              id="image" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <div className="file-info">
              {file ? `New image selected: ${file.name}` : 'Leave empty to keep current image'}
            </div>
          </div>
          
          <div className="button-group">
            <button type="submit" className="save-btn" disabled={uploading}>
              {uploading ? 'Updating...' : 'Update Product'}
            </button>
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={() => router.push('/admin/products')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}