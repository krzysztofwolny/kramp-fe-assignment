import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { UseCartReturn } from '../types';

export function useCartContext(): UseCartReturn {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCartContext must be used within CartContext.Provider');
  }

  return context;
}
