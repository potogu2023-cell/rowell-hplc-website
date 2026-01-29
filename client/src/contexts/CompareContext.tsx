import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CompareItem {
  productId: number;
  partNumber: string;
  name: string;
  brand: string;
  imageUrl?: string;
}

interface CompareContextType {
  items: CompareItem[];
  addItem: (item: CompareItem) => void;
  removeItem: (productId: number) => void;
  clearItems: () => void;
  isInCompare: (productId: number) => boolean;
  maxItems: number;
  canAddMore: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = 'compareItems';
const MAX_ITEMS = 4;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load compare items from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save compare items to localStorage:', error);
    }
  }, [items]);

  const addItem = (item: CompareItem) => {
    setItems(prev => {
      // Check if item already exists
      if (prev.some(i => i.productId === item.productId)) {
        return prev;
      }
      // Check if max items reached
      if (prev.length >= MAX_ITEMS) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: number) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const clearItems = () => {
    setItems([]);
  };

  const isInCompare = (productId: number) => {
    return items.some(i => i.productId === productId);
  };

  const canAddMore = items.length < MAX_ITEMS;

  return (
    <CompareContext.Provider 
      value={{ 
        items, 
        addItem, 
        removeItem, 
        clearItems, 
        isInCompare, 
        maxItems: MAX_ITEMS,
        canAddMore 
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
}
