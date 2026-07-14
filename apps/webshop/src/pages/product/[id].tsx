import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GetProductResult, Product } from '../../types';
import { fetchGraphQL } from '../../utils/fetchGraphQL';
import { useCartContext } from '../../hooks/useCartContext';
import styles from './[id].module.css';

const GET_PRODUCT_QUERY = `
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      category
      imageUrl
      stock
      createdAt
    }
  }
`;

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

    setProduct(null);
    setError(null);

    fetchGraphQL<GetProductResult>(GET_PRODUCT_QUERY, { id: productId })
      .then(data => {
        setProduct(data.product);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      });
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
          <p className={styles.price}>€{product.price.toFixed(2)}</p>
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
