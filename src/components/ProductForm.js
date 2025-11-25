import React, { useState } from 'react';
import { saveProducts, getAllProducts } from '../data/products';

const ProductForm = ({ onSave }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState(['25','26','27','28','29','30','31','32','33','34','35','36', '37', '38', '39', '40','41','42','44','45']);
  const [sizesInput, setSizesInput] = useState('26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40 ,41, 43, 44, 45');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Other');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = ['Men', 'Women', 'Children', 'Other'];

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB.');
      return;
    }
    
    setError('');
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim() || !brand.trim() || !price || !image) {
      setError('Please fill all required fields and upload an image.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid price greater than 0.');
      return;
    }

    const sizesArray = sizesInput.split(',').map(s => s.trim()).filter(s => s);
    if (sizesArray.length === 0) {
      setError('Please enter at least one size.');
      return;
    }

    const newProduct = {
      id: `p_${Date.now()}`,
      name: name.trim(),
      brand: brand.trim(),
      price: priceNum,
      description: description.trim(),
      image,
      sizes: sizesArray,
      category
    };

    try {
      const existing = getAllProducts();
      const updated = [newProduct, ...existing];
      saveProducts(updated);
      onSave?.(newProduct);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Reset form
      setName('');
      setBrand('');
      setPrice('');
      setDescription('');
      setSizesInput('6, 7, 8, 9, 10');
      setSizes(['6', '7', '8', '9', '10']);
      setImage('');
      setCategory('Other');
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError('An error occurred while saving the product.');
    }
  };

  const handleSizesChange = (e) => {
    const value = e.target.value;
    setSizesInput(value);
    const sizesArray = value.split(',').map(s => s.trim()).filter(s => s);
    setSizes(sizesArray);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h3 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        Add New Product
      </h3>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">Product added successfully!</div>}

      <div className="form-row">
        <label htmlFor="product-name">Product Name *</label>
        <input
          id="product-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Runner Pro"
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="product-brand">Brand *</label>
        <input
          id="product-brand"
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="e.g., StrideCo"
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="product-category">Category *</label>
        <select
          id="product-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '1rem',
            fontFamily: 'inherit'
          }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="product-price">Price ($) *</label>
        <input
          id="product-price"
          type="number"
          step="0.01"
          min="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g., 89.99"
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="product-description">Description</label>
        <textarea
          id="product-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product description..."
          rows="4"
        />
      </div>

      <div className="form-row">
        <label htmlFor="product-sizes">Available Sizes (comma separated) *</label>
        <input
          id="product-sizes"
          type="text"
          value={sizesInput}
          onChange={handleSizesChange}
          placeholder="e.g., 6, 7, 8, 9, 10"
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="product-image">Product Image *</label>
        <input
          id="product-image"
          type="file"
          accept="image/*"
          onChange={handleImage}
          required
        />
        {image && (
          <div style={{ marginTop: '1rem' }}>
            <img src={image} alt="Preview" className="preview" />
          </div>
        )}
      </div>

      <button type="submit" className="btn-primary">
        Add Product
      </button>
    </form>
  );
};

export default ProductForm;
