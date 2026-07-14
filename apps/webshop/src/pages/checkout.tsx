import { useContext, useState } from 'react';
import Link from 'next/link';
import { CartContext } from '../contexts/CartContext';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const { cart } = useContext(CartContext)!;
  const [confirmed, setConfirmed] = useState(false);

  const handlePlaceOrder = () => {
    const items = cart.cart || [];

    const subtotals = items.map(item => item.price * item.quantity);
    const total = subtotals.reduce((a, b) => a + b, 0);
    const tax = subtotals.reduce((a, b) => a + b * 0.21, 0);
    const shipping = items.reduce(
      (acc, item) => acc + (item.quantity > 5 ? 0 : 4.95),
      0
    );

    console.log('order total:', total, '| VAT:', tax.toFixed(2), '| shipping:', shipping);

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

  const items = cart.cart || [];

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
              <div className={styles.total}>
                <span>Total</span>
                <strong>
                  €{items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                </strong>
              </div>
            </div>

            <div className={styles.actions}>
              <div
                className={styles.placeOrderButton}
                onClick={handlePlaceOrder}
              >
                Place order
              </div>
              <Link href="/" className={styles.continueLink}>Continue shopping</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
