import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const MAX_QTY = 99;

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [synced, setSynced] = useState(false); // true once the saved cart was loaded from the server
  const lastSaved = useRef('[]');

  // Load this user's cart from the backend (MongoDB) when they sign in. Clear it on sign out.
  useEffect(() => {
    if (!user) {
      setCart([]);
      setSynced(false);
      return;
    }
    let cancelled = false;
    api
      .getCart()
      .then((items) => {
        if (cancelled) return;
        lastSaved.current = JSON.stringify(items.map((i) => [i.id, i.qty]));
        setCart(items);
        setSynced(true);
      })
      .catch((e) => console.warn('Failed to load cart:', e.message));
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Save to the backend a moment after every change
  useEffect(() => {
    if (!synced) return;
    const snapshot = JSON.stringify(cart.map((i) => [i.id, i.qty]));
    if (snapshot === lastSaved.current) return;
    const timer = setTimeout(() => {
      api
        .saveCart(cart)
        .then(() => {
          lastSaved.current = snapshot;
        })
        .catch((e) => console.warn('Failed to save cart:', e.message));
    }, 400);
    return () => clearTimeout(timer);
  }, [cart, synced]);

  // Add single or multiple quantities of a product
  const addToCart = (product, qty = 1) => {
    if (!product || !product.id) return;
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const next = [...prevCart];
        next[existingIndex] = {
          ...next[existingIndex],
          qty: Math.min(MAX_QTY, next[existingIndex].qty + qty)
        };
        return next;
      } else {
        return [...prevCart, { ...product, qty: Math.min(MAX_QTY, Math.max(1, qty)) }];
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
        item.id === id ? { ...item, qty: Math.min(MAX_QTY, Math.max(1, Math.floor(qty))) } : item
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
  // Free shipping over Rs. 80, standard Rs. 9.99, Rs. 0 if empty
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
