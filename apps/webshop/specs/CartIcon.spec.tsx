import React from 'react';
import { render, screen } from '@testing-library/react';
import { CartIcon } from '../src/components/CartIcon/CartIcon';

describe('CartIcon', () => {
  it('renders an empty cart label', async () => {
    render(<CartIcon count={0} />);

    expect(await screen.findByLabelText('Cart')).toBeTruthy();
    expect(screen.getByText('Cart')).toBeTruthy();
  });

  it('shows the item count after mount', async () => {
    render(<CartIcon count={3} />);

    expect(await screen.findByLabelText('Cart, 3 items')).toBeTruthy();
    expect(screen.getByText('Cart (3)')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('links to the checkout page', async () => {
    render(<CartIcon count={1} />);

    const link = await screen.findByRole('link', { name: 'Cart, 1 items' });
    expect(link.getAttribute('href')).toBe('/checkout');
  });
});
