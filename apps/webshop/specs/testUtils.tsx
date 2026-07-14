import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { CartContext } from '../src/contexts/CartContext';
import { UseCartReturn } from '../src/types';

export function createMockCart(overrides: Partial<UseCartReturn> = {}): UseCartReturn {
  return {
    items: [],
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    clearCart: jest.fn(),
    totalItems: 0,
    totalPrice: 0,
    isReady: true,
    ...overrides,
  };
}

export function CartTestProvider({
  children,
  value = createMockCart(),
}: {
  children: ReactNode;
  value?: UseCartReturn;
}) {
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function renderWithCart(
  ui: ReactElement,
  cartValue?: Partial<UseCartReturn>,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const value = createMockCart(cartValue);

  return render(ui, {
    wrapper: ({ children }) => (
      <CartContext.Provider value={value}>{children}</CartContext.Provider>
    ),
    ...options,
  });
}
