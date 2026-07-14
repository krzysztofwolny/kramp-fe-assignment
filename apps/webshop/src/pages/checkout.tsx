import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartContext } from '../hooks/useCartContext';
import { FrequentlyBoughtTogether } from '../components/FrequentlyBoughtTogether/FrequentlyBoughtTogether';
import { calculateOrderSummary } from '../utils/calculateOrderSummary';
import { formatPrice } from '../utils/formatPrice';
import { getImageSrc } from '../utils/getImageSrc';
import styles from './checkout.module.css';

const CART_PLACEHOLDER_IMAGE =
  'https://placehold.co/80x60/e0e0e0/666666?text=Product';

export default function CheckoutPage() {
  const cart = useCartContext();
  const [confirmed, setConfirmed] = useState(false);

  const handlePlaceOrder = () => {
    cart.clearCart();
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className={styles.confirmation}>
        <h1>Order placed!</h1>
        <p>Thank you for your order. You will receive a confirmation email shortly.</p>
        <Link href="/">Continue shopping</Link>
      </div>
    );
  }

  const items = cart.items;
  const summary = calculateOrderSummary(items);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>Checkout</h1>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Your cart is empty.</p>
            <Link href="/" className={styles.continueLink}>Continue shopping</Link>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map(item => (
                <div key={item.productId} className={styles.item}>
                  <Link
                    href={`/product/${item.productId}`}
                    className={styles.itemImageLink}
                  >
                    <Image
                      src={getImageSrc(item.imageUrl ?? CART_PLACEHOLDER_IMAGE)}
                      alt={item.name}
                      width={56}
                      height={42}
                      className={styles.itemImage}
                    />
                  </Link>
                  <Link
                    href={`/product/${item.productId}`}
                    className={styles.itemName}
                  >
                    {item.name}
                  </Link>
                  <span className={styles.itemQty}>×{item.quantity}</span>
                  <span className={styles.itemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => cart.removeFromCart(item.productId)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(summary.subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>VAT (21%)</span>
                <span>{formatPrice(summary.tax)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{formatPrice(summary.shipping)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <strong>{formatPrice(summary.total)}</strong>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.placeOrderButton}
                onClick={handlePlaceOrder}
              >
                Place order
              </button>
              <Link href="/" className={styles.continueLink}>Continue shopping</Link>
            </div>
          </>
        )}
      </div>

      {items.length > 0 && (
        <FrequentlyBoughtTogether
          excludeProductIds={items.map(item => item.productId)}
        />
      )}
    </div>
  );
}
