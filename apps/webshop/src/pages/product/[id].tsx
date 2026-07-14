import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GET_PRODUCT_QUERY } from '../../graphql/queries';
import { GetProductResult, Product } from '../../types';
import { fetchGraphQL } from '../../utils/fetchGraphQL';
import { formatPrice } from '../../utils/formatPrice';
import { useCartContext } from '../../hooks/useCartContext';
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

  const handleAddToCart = () => {
    if (!product) return;

    cart.addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

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

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.imageWrapper}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.image}
          />
        </div>
        <div className={styles.details}>
          <p className={styles.category}>{product.category}</p>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.price}>{formatPrice(product.price)}</p>
          <p className={styles.description}>{product.description}</p>
          <p className={styles.meta}>
            Listed: {new Date(product.createdAt).toLocaleDateString()}
            {' · '}
            {product.stock} in stock
          </p>
          <button
            type="button"
            className={styles.addToCart}
            onClick={handleAddToCart}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
