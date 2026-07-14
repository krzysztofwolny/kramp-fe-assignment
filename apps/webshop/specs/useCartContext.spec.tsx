import React from 'react';
import { renderHook } from '@testing-library/react';
import { useCartContext } from '../src/hooks/useCartContext';
import { CartContext } from '../src/contexts/CartContext';
import { createMockCart } from './testUtils';

describe('useCartContext', () => {
  it('returns cart context when used inside the provider', () => {
    const cart = createMockCart({ totalItems: 2 });

    const { result } = renderHook(() => useCartContext(), {
      wrapper: ({ children }) => (
        <CartContext.Provider value={cart}>{children}</CartContext.Provider>
      ),
    });

    expect(result.current.totalItems).toBe(2);
  });

  it('throws when used outside the provider', () => {
    expect(() => renderHook(() => useCartContext())).toThrow(
      'useCartContext must be used within CartContext.Provider'
    );
  });
});
