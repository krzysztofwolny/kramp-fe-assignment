import { storiesOf } from '@storybook/react';
import { ProductsGrid } from '../components/ProductsGrid/ProductsGrid';
import { mockProductList } from '../test-fixtures/products';

storiesOf('ProductsGrid', module)
  .add('featured products', () => (
    <ProductsGrid
      products={mockProductList}
      title="Featured products"
    />
  ))
  .add('embedded category section', () => (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <ProductsGrid
        products={mockProductList.filter(product => product.category === 'Tools')}
        title="Tools"
        embedded
      />
    </div>
  ))
  .add('frequently bought together', () => (
    <ProductsGrid
      products={mockProductList.slice(0, 4)}
      title="Frequently bought together"
    />
  ));
