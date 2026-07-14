import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { getImageSrc } from '../../utils/getImageSrc';
import { getStockLabel, isOutOfStock } from '../../utils/getStockStatus';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const outOfStock = isOutOfStock(product.stock);
  const stockLabel = getStockLabel(product.stock);

  return (
    <article
      className={`${styles.card} ${outOfStock ? styles.outOfStock : ''}`}
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
        {stockLabel && (
          <span
            className={`${styles.stockBadge} ${outOfStock ? styles.stockBadgeOut : styles.stockBadgeLow}`}
            data-testid="product-stock-label"
          >
            {stockLabel}
          </span>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price} data-testid="product-price">{formatPrice(product.price)}</p>
        <Link
          href={`/product/${product.id}`}
          className={`${styles.button} ${outOfStock ? styles.buttonMuted : ''}`}
        >
          {outOfStock ? 'Out of stock' : 'View product'}
        </Link>
      </div>
    </article>
  );
}
