import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const GiftBoxContext = createContext(null);

const MAX_QTY = 99;

const DEFAULT_BOX = {
  items: [],
  budget: 100,
  ribbon: 'rose', // 'rose' | 'gold' | 'navy' | 'sage'
  message: '',
  recipient: 'partner', // 'partner' | 'friend' | 'parent' | 'colleague'
  occasion: 'birthday', // 'birthday' | 'anniversary' | 'wedding' | 'holiday'
  interests: ''
};

export const RIBBON_COLORS = {
  rose: { label: 'Velvet Rose', hex: '#8C4843' },
  gold: { label: 'Champagne Gold', hex: '#C8A56A' },
  navy: { label: 'Dark Chocolate', hex: '#3B2118' },
  sage: { label: 'Heritage Olive', hex: '#5E6B54' }
};

export function GiftBoxProvider({ children }) {
  const { user } = useAuth();
  const [box, setBox] = useState(DEFAULT_BOX);
  const [synced, setSynced] = useState(false);
  const lastSaved = useRef('');

  const fingerprint = (b) =>
    JSON.stringify({ ...b, items: b.items.map((i) => [i.id, i.qty]) });

  // Load this user's saved box from the backend when they sign in
  useEffect(() => {
    if (!user) {
      setBox(DEFAULT_BOX);
      setSynced(false);
      return;
    }
    let cancelled = false;
    api
      .getGiftBox()
      .then((saved) => {
        if (cancelled) return;
        const loaded = { ...DEFAULT_BOX, ...saved };
        lastSaved.current = fingerprint(loaded);
        setBox(loaded);
        setSynced(true);
      })
      .catch((e) => console.warn('Failed to load gift box:', e.message));
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Save to the backend a moment after every change
  useEffect(() => {
    if (!synced) return;
    const snapshot = fingerprint(box);
    if (snapshot === lastSaved.current) return;
    const timer = setTimeout(() => {
      api
        .saveGiftBox(box)
        .then(() => {
          lastSaved.current = snapshot;
        })
        .catch((e) => console.warn('Failed to save gift box:', e.message));
    }, 600);
    return () => clearTimeout(timer);
  }, [box, synced]);

  // Setters
  const setBudget = (budget) => {
    const val = Math.min(100000, Math.max(20, Number(budget) || 20));
    setBox((prev) => ({ ...prev, budget: val }));
  };

  const setRibbon = (ribbon) => {
    setBox((prev) => ({ ...prev, ribbon }));
  };

  const setMessage = (message) => {
    // Truncate at 140 chars
    setBox((prev) => ({ ...prev, message: message.slice(0, 140) }));
  };

  const setRecipient = (recipient) => {
    setBox((prev) => ({ ...prev, recipient }));
  };

  const setOccasion = (occasion) => {
    setBox((prev) => ({ ...prev, occasion }));
  };

  const setInterests = (interests) => {
    setBox((prev) => ({ ...prev, interests }));
  };

  const addItem = (product, qty = 1) => {
    if (!product || !product.id) return;
    setBox((prev) => {
      const idx = prev.items.findIndex((i) => i.id === product.id);
      if (idx > -1) {
        const newItems = [...prev.items];
        newItems[idx] = { ...newItems[idx], qty: Math.min(MAX_QTY, newItems[idx].qty + qty) };
        return { ...prev, items: newItems };
      }
      return { ...prev, items: [...prev.items, { ...product, qty: Math.min(MAX_QTY, Math.max(1, qty)) }] };
    });
  };

  const removeItem = (id) => {
    setBox((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id)
    }));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setBox((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, qty: Math.min(MAX_QTY, Math.max(1, Math.floor(qty))) } : item
      )
    }));
  };

  const replaceItems = (newItems) => {
    setBox((prev) => ({ ...prev, items: newItems }));
  };

  const clearBox = () => {
    setBox((prev) => ({
      ...prev,
      items: [],
      message: ''
    }));
  };

  // Computations
  const total = Number(
    box.items.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0).toFixed(2)
  );
  const remaining = Number((box.budget - total).toFixed(2));
  const isOverBudget = total > box.budget;
  const isEmpty = box.items.length === 0;
  const count = box.items.reduce((sum, item) => sum + (item.qty || 1), 0);

  return (
    <GiftBoxContext.Provider
      value={{
        box,
        setBudget,
        addItem,
        removeItem,
        updateQty,
        setRibbon,
        setMessage,
        setRecipient,
        setOccasion,
        setInterests,
        replaceItems,
        clearBox,
        total,
        remaining,
        isOverBudget,
        isEmpty,
        count,
        ribbonInfo: RIBBON_COLORS[box.ribbon] || RIBBON_COLORS.rose
      }}
    >
      {children}
    </GiftBoxContext.Provider>
  );
}

export function useGiftBox() {
  const context = useContext(GiftBoxContext);
  if (!context) {
    throw new Error('useGiftBox must be used within a GiftBoxProvider');
  }
  return context;
}
