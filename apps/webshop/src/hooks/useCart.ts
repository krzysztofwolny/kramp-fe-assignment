import { useEffect, useState } from 'react';
import { CartItem, UseCartReturn } from '../types';
import { capQuantity } from '../utils/getStockStatus';

export function useCart(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
    setItems(stored);
    setIsReady(true);
  }, []);

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [items]);

  useEffect(() => {
    if (!isReady) return;

    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isReady]);

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const stockLimit = item.stock;
      const existing = prev.find(i => i.productId === item.productId);

      if (existing) {
        const effectiveStock = stockLimit ?? existing.stock;

        if (effectiveStock !== undefined && effectiveStock <= 0) {
          return prev;
        }

        const nextQuantity = existing.quantity + item.quantity;
        const cappedQuantity = capQuantity(nextQuantity, effectiveStock);

        if (cappedQuantity === existing.quantity) {
          return prev;
        }

        return prev.map(i =>
          i.productId === item.productId
            ? {
                ...i,
                quantity: cappedQuantity,
                stock: effectiveStock ?? i.stock,
                imageUrl: item.imageUrl ?? i.imageUrl,
              }
            : i
        );
      }

      if (stockLimit !== undefined && stockLimit <= 0) {
        return prev;
      }

      const initialQuantity = capQuantity(item.quantity, stockLimit);
      if (initialQuantity <= 0) {
        return prev;
      }

      return [...prev, { ...item, quantity: initialQuantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, addToCart, removeFromCart, clearCart, totalItems, totalPrice, isReady };
}
