
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

  const handleDelete = async (productId, imageUrl) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        // Delete image from storage
        if (imageUrl) {
          const fileName = imageUrl.split('/').pop();
          const { error: storageError } = await supabase.storage
            .from('product-images')
            .remove([fileName]);
          if (storageError) throw storageError;
        }

        // Delete the product record from the database
        const { error: dbError } = await supabase.from('products').delete().eq('id', productId);
        if (dbError) throw dbError;

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
        .products-container { max-width: 1200px; margin: 2rem auto; padding: 2rem; }
        .products-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .products-title { font-family: var(--font-playfair); font-size: 2.5rem; margin: 0; }
        .add-btn { padding: 0.8rem 1.5rem; background-color: var(--color-primary-teal); color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .products-table { width: 100%; border-collapse: collapse; background-color: var(--color-card-bg); border-radius: 8px; overflow: hidden; box-shadow: var(--shadow-medium); color: var(--color-dark-grey); }
        .products-table th, .products-table td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--color-border); }
        .products-table th { background-color: var(--color-accent); font-weight: bold; color: var(--color-dark-grey); }
        .product-image { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; }
        .actions-cell { display: flex; gap: 0.5rem; }
        .edit-btn, .delete-btn { padding: 0.4rem 0.8rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem; text-decoration: none; display: inline-block; }
        .edit-btn { background-color: #ffc107; color: black; }
        .delete-btn { background-color: #dc3545; color: white; }
      `}</style>
      <div className="products-container">
        <div className="products-header">
          <h1 className="products-title">Manage Products</h1>
          <Link href="/admin/products/new" className="add-btn">Add New Product</Link>
        </div>
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const displayImage = product.imageUrl || 'https://placehold.co/60x60?text=No+Image';
              
              return (
                <tr key={product.id}>
                  <td>
                    <img src={displayImage} alt={product.name} className="product-image" />
                  </td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.category}</td>
                  <td>
                    <span style={{ 
                      color: (product.quantity - (product.ordered_quantity || 0)) === 0 ? '#dc3545' : 
                             (product.quantity - (product.ordered_quantity || 0)) <= 3 ? '#ffc107' : '#28a745',
                      fontWeight: 'bold'
                    }}>
                      {(product.ordered_quantity || 0)}/{product.quantity || 0}
                    </span>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>
                      {(product.quantity || 0) - (product.ordered_quantity || 0)} remaining
                    </div>
                  </td>
                  <td className="actions-cell">
                    <Link href={`/admin/products/edit/${product.id}`} className="edit-btn">Edit</Link>
                    <button 
                      onClick={() => handleDelete(product.id, product.imageUrl)} 
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
