import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import logo from '../assets/logo.jpg';

const Navbar = () => {
  const location = useLocation();
  const { cart } = useCart();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const path = location.pathname;
  const isActive = (p) => (path.startsWith(p) ? 'active' : '');
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('admin_token');
    setIsAdminLoggedIn(!!token);

    // Listen for storage changes (when admin logs in/out)
    const handleStorageChange = () => {
      const token = localStorage.getItem('admin_token');
      setIsAdminLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    // Also check periodically in case same-tab changes occur
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [location.pathname]);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo-area" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src={logo} alt="Store Logo" className="logo" />
          <span className="brand-name">LUKS</span>
        </Link>
        <nav className="nav-links" aria-label="Main Navigation">
          <Link className={isActive('/')} to="/">Home</Link>
          <Link className={isActive('/category/men')} to="/category/men">Men</Link>
          <Link className={isActive('/category/women')} to="/category/women">Women</Link>
          <Link className={isActive('/category/children')} to="/category/children">Children</Link>
          <Link 
            to="/cart" 
            className={`badge-link ${isActive('/cart')}`}
            style={{ position: 'relative' }}
          >
            Cart
            {cartItemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}
              >
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link 
            to="/admin" 
            className={isActive('/admin')}
            style={{ 
              color: isAdminLoggedIn ? 'var(--success)' : 'var(--text)',
              fontWeight: isAdminLoggedIn ? '700' : '500'
            }}
            title={isAdminLoggedIn ? 'Admin: Logged in' : 'Admin: Click to login'}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
