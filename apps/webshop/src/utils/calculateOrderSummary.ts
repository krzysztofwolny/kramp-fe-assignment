import { CartItem } from '../types';

export interface OrderSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export function calculateOrderSummary(items: CartItem[]): OrderSummary {
  const subtotals = items.map(item => item.price * item.quantity);
  const subtotal = subtotals.reduce((a, b) => a + b, 0);
  const tax = subtotals.reduce((a, b) => a + b * 0.21, 0);
  const shipping = items.reduce(
    (acc, item) => acc + (item.quantity > 5 ? 0 : 4.95),
    0
  );

  return {
    subtotal,
    tax,
    shipping,
    total: subtotal + tax + shipping,
  };
}
