import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'giftora_cart_v1';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage:', e);
    }
    return [];
  });

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      }
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  // Add single or multiple quantities of a product
  const addToCart = (product, qty = 1) => {
    if (!product || !product.id) return;
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const next = [...prevCart];
        next[existingIndex] = {
          ...next[existingIndex],
          qty: next[existingIndex].qty + qty
        };
        return next;
      } else {
        return [...prevCart, { ...product, qty: Math.max(1, qty) }];
      }
    });
  };

  // Remove an item entirely by ID
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Update specific quantity (or remove if qty <= 0)
  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, Math.floor(qty)) } : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Computed values
  const count = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
  const total = Number(
    cart.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0).toFixed(2)
  );
  // Free shipping over $80, standard $9.99, $0 if empty
  const shipping = total === 0 ? 0 : total >= 80 ? 0 : 9.99;
  const grandTotal = Number((total + shipping).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        count,
        total,
        shipping,
        grandTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
