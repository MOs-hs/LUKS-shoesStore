import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, updateQty, removeFromCart, total, clearCart } = useCart();

  const handleCheckout = () => {
    if (window.confirm('Proceed with Cash on Delivery checkout?')) {
      alert('Order placed successfully! You will pay on delivery.');
      clearCart();
    }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/">Start Shopping</Link>
      </div>
    );
  }

  return (
    <section className="cart">
      <h1 className="page-title">Your Cart</h1>
      <p className="page-subtitle">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
      
      <table className="cart-table" aria-label="Cart items">
        <thead>
          <tr>
            <th>Product</th>
            <th>Size</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={`${item.id}-${item.size}`}>
              <td>
                {item.image && (
                  <img src={item.image} alt={item.name} />
                )}
                <strong>{item.name}</strong>
              </td>
              <td>{item.size}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  className="qty-input"
                  value={item.qty}
                  onChange={(e) => updateQty(item.id, item.size, parseInt(e.target.value || '1'))}
                  aria-label={`Quantity for ${item.name}`}
                />
              </td>
              <td>${item.price.toFixed(2)}</td>
              <td><strong>${(item.price * item.qty).toFixed(2)}</strong></td>
              <td>
                <button 
                  className="btn-danger" 
                  onClick={() => removeFromCart(item.id, item.size)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-summary">
        <div>
          <strong>Total: ${total.toFixed(2)}</strong>
        </div>
        <div className="cart-actions">
          <button 
            className="btn-checkout" 
            onClick={handleCheckout}
          >
            Checkout (Cash on Delivery)
          </button>
          <button 
            className="btn-clear" 
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your cart?')) {
                clearCart();
              }
            }}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
