import { calculateOrderSummary } from '../src/utils/calculateOrderSummary';
import { CartItem } from '../src/types';

describe('calculateOrderSummary', () => {
  const items: CartItem[] = [
    { productId: '1', name: 'Hammer', price: 10, quantity: 2 },
    { productId: '2', name: 'Bolt', price: 5, quantity: 1 },
  ];

  it('calculates subtotal from line items', () => {
    const summary = calculateOrderSummary(items);
    expect(summary.subtotal).toBe(25);
  });

  it('calculates shipping per item when quantity is five or less', () => {
    const summary = calculateOrderSummary(items);
    expect(summary.shipping).toBe(9.9);
  });

  it('waives shipping for items with quantity above five', () => {
    const summary = calculateOrderSummary([
      { productId: '1', name: 'Bulk bolts', price: 2, quantity: 6 },
    ]);
    expect(summary.shipping).toBe(0);
  });

  it('returns a total including subtotal, tax, and shipping', () => {
    const summary = calculateOrderSummary(items);
    expect(summary.total).toBe(summary.subtotal + summary.tax + summary.shipping);
  });
});
