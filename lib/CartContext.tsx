'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: string;
  rating: number;
  description: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem('artisan-cart');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Sanitize: ensure items have valid product data
          const validItems = Array.isArray(parsed)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ? parsed.filter((i: any) => i && i.product && i.product.id)
            : [];
          setItems(validItems);
        } catch (e) {
          console.error("Failed to parse cart", e);
          setItems([]);
        }
      }
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('artisan-cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (product: Product, quantity: number) => {
    if (!product || !product.id) return;

    setItems(prevItems => {
      // Guard against any corrupted items in state
      const safeItems = prevItems.filter(item => item && item.product && item.product.id);

      const existing = safeItems.find(item => item.product.id === product.id);
      if (existing) {
        return safeItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...safeItems, { product, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => {
    if (!item.product || !item.product.price) return sum;
    const price = parseFloat(item.product.price.replace('$', ''));
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
