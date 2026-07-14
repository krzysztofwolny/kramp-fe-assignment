import React, { ComponentType } from 'react';
import * as NextRouter from 'next/router';
import { CartContext } from '../contexts/CartContext';
import { UseCartReturn } from '../types';

const mockRouter: NextRouter.NextRouter = {
  push: () => Promise.resolve(true),
  replace: () => Promise.resolve(true),
  reload: () => undefined,
  back: () => undefined,
  forward: () => undefined,
  prefetch: () => Promise.resolve(),
  beforePopState: () => undefined,
  events: {
    on: () => undefined,
    off: () => undefined,
    emit: () => undefined,
  },
  isFallback: false,
  isReady: true,
  isPreview: false,
  pathname: '/',
  route: '/',
  asPath: '/',
  basePath: '',
  query: {},
};

Object.defineProperty(NextRouter, 'useRouter', {
  value: () => mockRouter,
});

export function withRouter(Story: ComponentType) {
  return <Story />;
}

export function withCart(cartOverrides: Partial<UseCartReturn> = {}) {
  const cartValue: UseCartReturn = {
    items: [],
    addToCart: () => undefined,
    removeFromCart: () => undefined,
    clearCart: () => undefined,
    totalItems: 0,
    totalPrice: 0,
    isReady: true,
    ...cartOverrides,
  };

  return function CartDecorator(Story: ComponentType) {
    return (
      <CartContext.Provider value={cartValue}>
        <Story />
      </CartContext.Provider>
    );
  };
}
