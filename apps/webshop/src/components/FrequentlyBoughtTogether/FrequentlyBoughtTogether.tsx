import { useEffect, useState } from 'react';
import { ProductsGrid } from '../ProductsGrid/ProductsGrid';
import { Product } from '../../types';
import { getFrequentlyBoughtTogether } from '../../utils/getFrequentlyBoughtTogether';

interface FrequentlyBoughtTogetherProps {
  excludeProductIds: string[];
  categorySeeds?: string[];
  embedded?: boolean;
}

export function FrequentlyBoughtTogether({
  excludeProductIds,
  categorySeeds,
  embedded = false,
}: FrequentlyBoughtTogetherProps) {
  const [products, setProducts] = useState<Product[]>([]);

  const excludeKey = excludeProductIds.join(',');
  const seedsKey = categorySeeds?.join(',') ?? '';

  useEffect(() => {
    if (!excludeKey && !seedsKey) {
      setProducts([]);
      return;
    }

    const controller = new AbortController();

    getFrequentlyBoughtTogether({
      excludeProductIds: excludeKey ? excludeKey.split(',') : [],
      categorySeeds: seedsKey ? seedsKey.split(',') : undefined,
      signal: controller.signal,
    })
      .then(setProducts)
      .catch(error => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        setProducts([]);
      });

    return () => controller.abort();
  }, [excludeKey, seedsKey]);

  if (!products.length) {
    return null;
  }

  return (
    <ProductsGrid
      products={products}
      title="Frequently bought together"
      embedded={embedded}
    />
  );
}
