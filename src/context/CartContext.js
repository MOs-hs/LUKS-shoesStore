import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const loadInitialCart = () => {
  try {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadInitialCart());

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, quantity = 1) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === item.id && p.size === item.size);
      if (found) {
        return prev.map((p) =>
          p === found ? { ...p, qty: p.qty + quantity } : p
        );
      }
      return [...prev, { ...item, qty: quantity }];
    });
  };

  const updateQty = (id, size, qty) => {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id && p.size === size ? { ...p, qty } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const removeFromCart = (id, size) => {
    setCart((prev) => prev.filter((p) => !(p.id === id && p.size === size)));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};
