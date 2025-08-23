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

const [file, setFile] = useState(null); // State for the image file

const [uploading, setUploading] = useState(false);

const router = useRouter();



const handleFileChange = (e) => {

if (e.target.files.length > 0) {

setFile(e.target.files[0]);

}

};



const handleSubmit = async (e) => {

e.preventDefault();

if (!file) {

alert('Please select an image to upload.');

return;

}



setUploading(true);



// 1. Upload the image to Supabase Storage

const fileName = `${Date.now()}_${file.name}`;

const { data: uploadData, error: uploadError } = await supabase.storage

.from('product-images')

.upload(fileName, file);



if (uploadError) {

setUploading(false);

alert('Error uploading image: ' + uploadError.message);

return;

}



// 2. Get the public URL of the uploaded image

const { data: urlData } = supabase.storage

.from('product-images')

.getPublicUrl(fileName);



const imageUrl = urlData.publicUrl;



// 3. Insert the product data (including the new imageUrl) into the database

const { data: productData, error: insertError } = await supabase

.from('products')

.insert([{ name, description, price, imageUrl, category }]);



setUploading(false);



if (insertError) {

alert('Error adding product: ' + insertError.message);

} else {

router.push('/admin/products');

}

};



return (

<AdminLayout>

<style jsx>{`

/* Styles are the same */

.form-container { max-width: 800px; margin: 2rem auto; padding: 2rem; }

.form-title { font-family: var(--font-playfair); font-size: 2.5rem; margin-bottom: 2rem; }

.form-group { margin-bottom: 1.5rem; }

.form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }

.form-group input, .form-group textarea { width: 100%; padding: 0.8rem; border: 1px solid #ccc; border-radius: 5px; font-size: 1rem; }

.save-btn { padding: 1rem 2rem; background-color: var(--color-primary-teal); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.1rem; }

.save-btn:disabled { background-color: #ccc; }

`}</style>

<div className="form-container">

<h1 className="form-title">Add a New Product</h1>

<form onSubmit={handleSubmit}>

{/* ... other form groups for name, description, price, category ... */}

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



{/* --- THIS IS THE NEW FILE UPLOAD INPUT --- */}

<div className="form-group">

<label htmlFor="image">Product Image</label>

<input type="file" id="image" accept="image/*" onChange={handleFileChange} required />

</div>



<button type="submit" className="save-btn" disabled={uploading}>

{uploading ? 'Uploading...' : 'Save Product'}

</button>

</form>

</div>

</AdminLayout>

);

}