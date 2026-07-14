import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './CartIcon.module.css';

interface CartIconProps {
  count: number;
}

export function CartIcon({ count }: CartIconProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const displayCount = hasMounted ? count : 0;
  const label = displayCount > 0 ? `Cart, ${displayCount} items` : 'Cart';

  return (
    <Link
      href="/checkout"
      className={styles.cartIcon}
      aria-label={label}
    >
      <span className={styles.label} aria-hidden="true">
        {displayCount > 0 ? `Cart (${displayCount})` : 'Cart'}
      </span>
      {displayCount > 0 && (
        <span className={styles.badge} aria-hidden="true">{displayCount}</span>
      )}
    </Link>
  );
}
