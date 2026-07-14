import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductsGrid } from '../src/components/ProductsGrid/ProductsGrid';
import { mockProductList } from '../src/test-fixtures/products';

describe('ProductsGrid', () => {
  it('renders product cards without a title', () => {
    render(<ProductsGrid products={mockProductList.slice(0, 2)} />);

    expect(screen.getAllByTestId('product-card')).toHaveLength(2);
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });

  it('renders an optional section title', () => {
    render(
      <ProductsGrid
        products={mockProductList.slice(0, 2)}
        title="Featured products"
      />
    );

    expect(screen.getByRole('heading', { name: 'Featured products' })).toBeTruthy();
  });

  it('renders in embedded mode', () => {
    const { container } = render(
      <ProductsGrid
        products={mockProductList.slice(0, 1)}
        title="Tools"
        embedded
      />
    );

    expect(container.querySelector('section')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Tools' })).toBeTruthy();
  });
});
