import React, { useEffect, useState } from 'react';
import ProductForm from '../components/ProductForm';
import { getAllProducts, saveProducts } from '../data/products';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [error, setError] = useState('');

  // Default admin password - change this to your desired password
  const ADMIN_PASSWORD = 'admin123';

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setIsAdmin(!!token);
    if (token) {
      const list = getAllProducts();
      setProducts(list);
    }
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
  };

  const handleEnableAdmin = (e) => {
    e.preventDefault();
    setError('');
    const input = tokenInput.trim();
    
    if (!input) {
      setError('Please enter an admin password.');
      return;
    }

    // Check if password matches (case-sensitive)
    if (input === ADMIN_PASSWORD) {
      localStorage.setItem('admin_token', input);
      setIsAdmin(true);
      const list = getAllProducts();
      setProducts(list);
      setTokenInput('');
    } else {
      setError('Invalid admin password. Please try again.');
      setTokenInput('');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of admin?')) {
      localStorage.removeItem('admin_token');
      setIsAdmin(false);
      setProducts([]);
    }
  };

  if (!isAdmin) {
    return (
      <section className="admin-locked">
        <h2>Admin Access</h2>
        <p>Access is protected. Enter admin password to unlock admin panel.</p>
        <form onSubmit={handleEnableAdmin} style={{ marginTop: '2rem' }}>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => {
              setTokenInput(e.target.value);
              setError('');
            }}
            placeholder="Enter admin password"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: error ? '2px solid var(--danger)' : '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '1rem',
              marginBottom: error ? '0.5rem' : '1rem'
            }}
            required
            autoFocus
          />
          {error && (
            <div className="error" style={{ marginBottom: '1rem', textAlign: 'left' }}>
              {error}
            </div>
          )}
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Login as Admin
          </button>
          <p style={{ 
            marginTop: '1.5rem', 
            fontSize: '0.875rem', 
            color: 'var(--text-light)',
            fontStyle: 'italic'
          }}>
            Default password: <strong>admin123</strong>
          </p>
        </form>
      </section>
    );
  }

  return (
    <section className="admin">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Admin Panel</h1>
        <button className="btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <ProductForm onSave={(p) => {
        const updated = [p, ...products];
        setProducts(updated);
        saveProducts(updated);
      }} />

      <h2 className="page-title" style={{ fontSize: '1.5rem', marginTop: '3rem', marginBottom: '1rem' }}>
        Existing Products ({products.length})
      </h2>

      {products.length === 0 ? (
        <div className="empty-state">
          <h2>No products yet</h2>
          <p>Add your first product using the form above.</p>
        </div>
      ) : (
        <div className="admin-grid">
          {products.map((p) => (
            <div key={p.id} className="admin-card">
              <img src={p.image} alt={p.name} className="admin-thumb" />
              <div className="admin-info">
                <strong>{p.name}</strong>
                <span>{p.brand}</span>
                <span>{p.category}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                  ${p.price.toFixed(2)}
                </span>
                <span style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  Sizes: {p.sizes?.join(', ') || 'N/A'}
                </span>
              </div>
              <button 
                onClick={() => handleDelete(p.id)} 
                className="btn-danger"
                style={{ marginTop: 'auto' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminPage;
