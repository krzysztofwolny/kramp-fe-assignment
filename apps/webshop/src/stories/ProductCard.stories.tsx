import { storiesOf } from '@storybook/react';
import ProductCard from '../components/ProductCard/ProductCard';
import {
  expensiveProduct,
  lowStockProduct,
  mockProduct,
  outOfStockProduct,
} from '../test-fixtures/products';

storiesOf('ProductCard', module)
  .add('default', () => <ProductCard product={mockProduct} />)
  .add('expensive item', () => <ProductCard product={expensiveProduct} />)
  .add('low stock', () => <ProductCard product={lowStockProduct} />)
  .add('out of stock', () => <ProductCard product={outOfStockProduct} />);
