import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CheckoutPage from '../src/pages/checkout';
import { formatPrice } from '../src/utils/formatPrice';
import { renderWithCart } from './testUtils';

jest.mock('../src/components/FrequentlyBoughtTogether/FrequentlyBoughtTogether', () => ({
  FrequentlyBoughtTogether: () => null,
}));

describe('CheckoutPage', () => {
  it('shows an empty cart message', () => {
    renderWithCart(<CheckoutPage />);

    expect(screen.getByText('Your cart is empty.')).toBeTruthy();
  });

  it('renders cart items with quantity and price', () => {
    const { container } = renderWithCart(<CheckoutPage />, {
      items: [
        {
          productId: '1',
          name: 'Heavy Duty Hammer',
          price: 18.99,
          quantity: 2,
          imageUrl: 'https://placehold.co/80x60',
        },
      ],
      totalItems: 2,
    });

    expect(screen.getByText('Heavy Duty Hammer')).toBeTruthy();
    expect(screen.getByText('×2')).toBeTruthy();
    expect(container.querySelector('.itemPrice')?.textContent).toBe(
      formatPrice(18.99 * 2)
    );
  });

  it('removes an item when remove is clicked', () => {
    const removeFromCart = jest.fn();

    renderWithCart(<CheckoutPage />, {
      items: [
        {
          productId: '1',
          name: 'Heavy Duty Hammer',
          price: 18.99,
          quantity: 1,
        },
      ],
      removeFromCart,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Remove Heavy Duty Hammer from cart' }));

    expect(removeFromCart).toHaveBeenCalledWith('1');
  });
});
