import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: true });
    setProducts(data);
  }

  // --- THIS IS THE NEW DELETE FUNCTION ---
  const handleDelete = async (productId, imageUrl) => {
    // 1. Show a confirmation dialog
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        // 2. Delete the image from Supabase Storage
        const fileName = imageUrl.split('/').pop(); // Extracts the file name from the URL
        const { error: storageError } = await supabase.storage.from('product-images').remove([fileName]);
        if (storageError) throw storageError;

        // 3. Delete the product record from the database
        const { error: dbError } = await supabase.from('products').delete().eq('id', productId);
        if (dbError) throw dbError;

        // 4. Refresh the product list on the page
        fetchProducts();
        alert('Product deleted successfully!');

      } catch (error) {
        alert('Error deleting product: ' + error.message);
      }
    }
  };

  return (
    <AdminLayout>
      <style jsx>{`
        /* Styles are the same as before */
        .admin-container { padding: 2rem; }
        .header-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .admin-title { font-family: var(--font-playfair); font-size: 2.5rem; margin: 0; }
        .add-product-btn { background-color: var(--color-primary-teal); color: white; padding: 0.8rem 1.5rem; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .product-table { width: 100%; border-collapse: collapse; }
        .product-table th, .product-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .product-table th { background-color: #f2f2f2; }
        .action-btn { background-color: var(--color-accent-gold); color: white; padding: 0.5rem 1rem; text-decoration: none; border-radius: 5px; border: none; cursor: pointer; }
        .delete-btn { background-color: #e74c3c; } /* Red color for delete button */
      `}</style>
      <div className="admin-container">
        <div className="header-container">
          <h1 className="admin-title">Manage Products</h1>
          <Link href="/admin/products/new" className="add-product-btn">
            + Add New Product
          </Link>
        </div>
        <table className="product-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>₹{product.price}</td>
                        <td>{product.category}</td>
                        <td>
                          <Link href={`/admin/products/edit/${product.id}`} className="action-btn">
                            Edit
                          </Link>
                          {/* --- THIS IS THE UPDATED DELETE BUTTON --- */}
                          <button 
                            className="action-btn delete-btn" 
                            style={{ marginLeft: '10px' }}
                            onClick={() => handleDelete(product.id, product.imageUrl)}
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