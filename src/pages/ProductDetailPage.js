import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductById } from '../data/products';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useMemo(() => getProductById(id), [id]);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const canAdd = !!selectedSize;

  const handleAddToCart = () => {
    if (!canAdd) return;
    
    addToCart({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      image: product.image, 
      size: selectedSize 
    }, quantity);
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    const qty = Math.max(1, Math.min(99, value));
    setQuantity(qty);
  };

  if (!product) {
    return (
      <div className="empty-state">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <section className="product-detail">
      <div className="product-detail-left">
        <img src={product.image} alt={product.name} className="detail-img" />
      </div>
      <div className="product-detail-right">
        <h1 className="brand">{product.brand}</h1>
        <h2 className="page-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
          {product.name}
        </h2>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="description">{product.description || 'Premium quality footwear designed for comfort and style.'}</p>

        {showSuccess && (
          <div className="success">
            Item added to cart successfully!
          </div>
        )}

        <div className="sizes">
          <div className="sizes-label">Select Size</div>
          <div className="sizes-list">
            {product.sizes && product.sizes.length > 0 ? (
              product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`size-btn ${selectedSize === s ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(s)}
                  aria-label={`Select size ${s}`}
                >
                  {s}
                </button>
              ))
            ) : (
              <p>No sizes available</p>
            )}
          </div>
        </div>

        <div className="quantity-selector" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
          <label htmlFor="product-quantity" className="sizes-label">Quantity</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              id="product-quantity"
              type="number"
              min="1"
              max="99"
              value={quantity}
              onChange={handleQuantityChange}
              className="qty-input"
              style={{
                width: '80px',
                textAlign: 'center',
                padding: '0.625rem',
                border: '2px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1rem',
                fontWeight: '600'
              }}
              aria-label="Product quantity"
            />
            <button
              type="button"
              className="qty-btn"
              onClick={() => setQuantity(Math.min(99, quantity + 1))}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          disabled={!canAdd}
          onClick={handleAddToCart}
          aria-label={canAdd ? `Add ${quantity} item${quantity > 1 ? 's' : ''} to cart` : 'Please select a size first'}
        >
          {canAdd ? `Add ${quantity} ${quantity > 1 ? 'Items' : 'Item'} to Cart` : 'Select a Size'}
        </button>
      </div>
    </section>
  );
};

export default ProductDetailPage;
