import { act, renderHook, waitFor } from '@testing-library/react';
import { useCart } from '../src/hooks/useCart';

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads an empty cart by default', async () => {
    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
  });

  it('adds a new item to the cart', async () => {
    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    act(() => {
      result.current.addToCart({
        productId: '1',
        name: 'Hammer',
        price: 18.99,
        quantity: 1,
        stock: 5,
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(18.99);
  });

  it('increments quantity for an existing item', async () => {
    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    act(() => {
      result.current.addToCart({
        productId: '1',
        name: 'Hammer',
        price: 10,
        quantity: 1,
        stock: 5,
      });
      result.current.addToCart({
        productId: '1',
        name: 'Hammer',
        price: 10,
        quantity: 1,
        stock: 5,
      });
    });

    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
  });

  it('caps quantity at available stock', async () => {
    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    act(() => {
      result.current.addToCart({
        productId: '1',
        name: 'Hammer',
        price: 10,
        quantity: 1,
        stock: 2,
      });
      result.current.addToCart({
        productId: '1',
        name: 'Hammer',
        price: 10,
        quantity: 1,
        stock: 2,
      });
      result.current.addToCart({
        productId: '1',
        name: 'Hammer',
        price: 10,
        quantity: 1,
        stock: 2,
      });
    });

    expect(result.current.items[0].quantity).toBe(2);
  });

  it('removes items from the cart', async () => {
    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    act(() => {
      result.current.addToCart({
        productId: '1',
        name: 'Hammer',
        price: 10,
        quantity: 1,
      });
      result.current.removeFromCart('1');
    });

    expect(result.current.items).toEqual([]);
  });

  it('persists cart items to localStorage', async () => {
    const { result } = renderHook(() => useCart());

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    act(() => {
      result.current.addToCart({
        productId: '1',
        name: 'Hammer',
        price: 10,
        quantity: 1,
      });
    });

    await waitFor(() => {
      expect(localStorage.getItem('cart')).toContain('Hammer');
    });
  });
});
