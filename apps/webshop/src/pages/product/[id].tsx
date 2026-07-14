import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GET_PRODUCT_QUERY } from '../../graphql/queries';
import { GetProductResult, Product } from '../../types';
import { fetchGraphQL } from '../../utils/fetchGraphQL';
import { formatPrice } from '../../utils/formatPrice';
import { getImageSrc } from '../../utils/getImageSrc';
import { useCartContext } from '../../hooks/useCartContext';
import { FrequentlyBoughtTogether } from '../../components/FrequentlyBoughtTogether/FrequentlyBoughtTogether';
import { getStockLabel, isOutOfStock } from '../../utils/getStockStatus';
import styles from './[id].module.css';

export default function ProductPage() {
  const router = useRouter();
  const cart = useCartContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  const productId = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;

  useEffect(() => {
    if (!router.isReady || !productId) return;

    const controller = new AbortController();

    setProduct(null);
    setError(null);

    fetchGraphQL<GetProductResult>(
      GET_PRODUCT_QUERY,
      { id: productId },
      { signal: controller.signal }
    )
      .then(data => {
        setProduct(data.product);
      })
      .catch(err => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to load product');
      });

    return () => controller.abort();
  }, [router.isReady, productId]);

  if (error) {
    return (
      <div className={styles.page}>
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.page}>
        <p>Loading...</p>
      </div>
    );
  }

  const quantityInCart =
    cart.items.find(item => item.productId === product.id)?.quantity ?? 0;
  const outOfStock = isOutOfStock(product.stock);
  const canAddMore = !outOfStock && quantityInCart < product.stock;
  const lowStockLabel = getStockLabel(product.stock);
  const addToCartLabel = outOfStock
    ? 'Out of stock'
    : canAddMore
      ? 'Add to cart'
      : 'Maximum quantity in cart';

  const handleAddToCart = () => {
    if (!canAddMore) return;

    cart.addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock,
      imageUrl: product.imageUrl,
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.imageWrapper}>
          <Image
            src={getImageSrc(product.imageUrl)}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 600px"
            className={styles.image}
          />
        </div>
        <div className={styles.details}>
          <Link
            href={`/search?q=${encodeURIComponent(product.category)}`}
            className={styles.category}
          >
            {product.category}
          </Link>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          <p className={styles.description}>{product.description}</p>
          {outOfStock ? (
            <p className={styles.outOfStock}>Out of stock</p>
          ) : (
            <>
              <p className={styles.meta}>
                Listed: {new Date(product.createdAt).toLocaleDateString()}
                {' · '}
                {product.stock} in stock
              </p>
              {lowStockLabel && (
                <p className={styles.lowStock}>{lowStockLabel}</p>
              )}
            </>
          )}
          <button
            type="button"
            className={styles.addToCart}
            onClick={handleAddToCart}
            disabled={!canAddMore}
          >
            {addToCartLabel}
          </button>
        </div>
      </div>

      <FrequentlyBoughtTogether
        excludeProductIds={[product.id]}
        categorySeeds={[product.category]}
      />
    </div>
  );
}
