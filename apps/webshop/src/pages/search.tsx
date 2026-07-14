import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SEARCH_PRODUCTS_QUERY } from '../graphql/queries';
import { groupBy } from '../utils/groupBy';
import { fetchGraphQL } from '../utils/fetchGraphQL';
import ProductCard from '../components/ProductCard';
import { Product, SearchProductsResult } from '../types';
import styles from './search.module.css';

export default function SearchPage() {
  const router = useRouter();
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const q = (router.query.q as string) || '';

    setIsLoading(true);
    setError(null);

    fetchGraphQL<SearchProductsResult>(SEARCH_PRODUCTS_QUERY, { q })
      .then(data => {
        setResults(data.searchProducts);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        setResults([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router.isReady, router.query.q]);

  const grouped = groupBy(results, 'category');

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>
          {router.query.q ? `Results for "${router.query.q}"` : 'All products'}
        </h1>

        {isLoading && <p>Loading...</p>}

        {error && <p className={styles.empty}>{error}</p>}

        {!isLoading && !error && !results.length && (
          <p className={styles.empty}>No products found.</p>
        )}

        {Object.keys(grouped).map(category => (
          <section key={category} className={styles.category}>
            <h2 className={styles.categoryTitle}>{category}</h2>
            <div className={styles.grid}>
              {grouped[category].map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
