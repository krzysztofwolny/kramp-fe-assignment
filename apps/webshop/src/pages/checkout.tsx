import { useState } from 'react';
import Link from 'next/link';
import { useCartContext } from '../hooks/useCartContext';
import { calculateOrderSummary } from '../utils/calculateOrderSummary';
import styles from './checkout.module.css';

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
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemQty}>×{item.quantity}</span>
                  <span className={styles.itemPrice}>
                    €{(item.price * item.quantity).toFixed(2)}
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
                <span>€{summary.subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>VAT (21%)</span>
                <span>€{summary.tax.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>€{summary.shipping.toFixed(2)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <strong>€{summary.total.toFixed(2)}</strong>
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
    </div>
  );
}
