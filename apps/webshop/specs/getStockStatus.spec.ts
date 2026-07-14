import { capQuantity, getStockLabel, isOutOfStock } from '../src/utils/getStockStatus';

describe('getStockStatus', () => {
  it('detects out of stock products', () => {
    expect(isOutOfStock(0)).toBe(true);
    expect(isOutOfStock(1)).toBe(false);
  });

  it('returns low stock labels up to three items', () => {
    expect(getStockLabel(3)).toBe('Only 3 left');
    expect(getStockLabel(4)).toBeNull();
  });

  it('returns out of stock label for zero stock', () => {
    expect(getStockLabel(0)).toBe('Out of stock');
  });

  it('caps quantity to available stock', () => {
    expect(capQuantity(5, 3)).toBe(3);
    expect(capQuantity(2, 3)).toBe(2);
    expect(capQuantity(2)).toBe(2);
  });
});
