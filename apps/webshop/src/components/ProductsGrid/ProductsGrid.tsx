import ProductCard from '../ProductCard/ProductCard';
import { Product } from '../../types';
import styles from './ProductsGrid.module.css';

interface ProductsGridProps {
  products: Product[];
  title?: string;
  embedded?: boolean;
}

export function ProductsGrid({ products, title, embedded }: ProductsGridProps) {
  return (
    <section className={embedded ? styles.embedded : styles.section}>
      {title && (
        <div className={styles.header}>
          <h2>{title}</h2>
        </div>
      )}
      <div className={styles.grid}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
