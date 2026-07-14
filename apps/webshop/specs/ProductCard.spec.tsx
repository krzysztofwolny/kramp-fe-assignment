import React from 'react';
import { render } from '@testing-library/react';
import ProductCard from '../src/components/ProductCard/ProductCard';
import { formatPrice } from '../src/utils/formatPrice';

const mockProduct = {
  id: '1',
  name: 'Heavy Duty Hammer',
  price: 18.99,
  imageUrl: 'https://placehold.co/300x200',
  description: 'A solid 500g steel hammer.',
  category: 'Tools',
  stock: 142,
  createdAt: '2024-01-15T10:00:00.000Z',
};

describe('ProductCard', () => {
  it('renders the product card', () => {
    const { getByTestId } = render(<ProductCard product={mockProduct} />);
    expect(getByTestId('product-card')).toBeTruthy();
  });

  it('displays the correct price', () => {
    const { getByTestId } = render(<ProductCard product={mockProduct} />);
    expect(getByTestId('product-price').innerHTML).toBe(formatPrice(mockProduct.price));
  });

  it('renders the product name', () => {
    const { getByTestId } = render(<ProductCard product={mockProduct} />);
    expect(getByTestId('product-card').textContent).toContain('Heavy Duty Hammer');
  });

  it('shows out of stock label when stock is zero', () => {
    const { getByTestId } = render(
      <ProductCard product={{ ...mockProduct, stock: 0 }} />
    );
    expect(getByTestId('product-stock-label').textContent).toBe('Out of stock');
  });

  it('shows low stock label when stock is three or less', () => {
    const { getByTestId } = render(
      <ProductCard product={{ ...mockProduct, stock: 2 }} />
    );
    expect(getByTestId('product-stock-label').textContent).toBe('Only 2 left');
  });
});
