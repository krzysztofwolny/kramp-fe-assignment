import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { getImageSrc } from '../../utils/getImageSrc';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article
      className={styles.card}
      data-testid="product-card"
    >
      <div className={styles.imageWrapper}>
        <Image
          src={getImageSrc(product.imageUrl)}
          alt={product.name}
          fill
          className={styles.image}
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 300px"
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price} data-testid="product-price">{formatPrice(product.price)}</p>
        <Link
          href={`/product/${product.id}`}
          className={styles.button}
        >
          View product
        </Link>
      </div>
    </article>
  );
}
