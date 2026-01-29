import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface InquiryCartItem {
  productId: number;
  partNumber: string;
  name: string;
  brand: string;
  imageUrl?: string;
}

interface InquiryCartContextType {
  items: InquiryCartItem[];
  addItem: (item: InquiryCartItem) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  isInCart: (productId: number) => boolean;
}

const InquiryCartContext = createContext<InquiryCartContextType | undefined>(undefined);

const STORAGE_KEY = 'inquiryCart';

export function InquiryCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InquiryCartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load inquiry cart from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save inquiry cart to localStorage:', error);
    }
  }, [items]);

  const addItem = (item: InquiryCartItem) => {
    setItems(prev => {
      // Check if item already exists
      if (prev.some(i => i.productId === item.productId)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (productId: number) => {
    return items.some(i => i.productId === productId);
  };

  return (
    <InquiryCartContext.Provider value={{ items, addItem, removeItem, clearCart, isInCart }}>
      {children}
    </InquiryCartContext.Provider>
  );
}

export function useInquiryCart() {
  const context = useContext(InquiryCartContext);
  if (!context) {
    throw new Error('useInquiryCart must be used within InquiryCartProvider');
  }
  return context;
}
