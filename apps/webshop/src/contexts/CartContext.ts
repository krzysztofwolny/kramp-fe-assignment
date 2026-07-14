import { createContext } from 'react';
import { CartContextValue } from '../types';

export const CartContext = createContext<CartContextValue | null>(null);
