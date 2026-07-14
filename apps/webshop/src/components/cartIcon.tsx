import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './cartIcon.module.css';

interface CartIconProps {
  count: number;
}

export function CartIcon({ count }: CartIconProps) {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const displayCount = hasMounted ? count : 0;
  const label = displayCount > 0 ? `Cart (${displayCount})` : 'Cart';

  return (
    <div
      onClick={() => router.push('/checkout')}
      className={styles.cartIcon}
    >
      <span className={styles.label}>{label}</span>
      {displayCount > 0 && (
        <span className={styles.badge}>{displayCount}</span>
      )}
    </div>
  );
}
