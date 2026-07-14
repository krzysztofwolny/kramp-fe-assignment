export const LOW_STOCK_THRESHOLD = 3;

export function isOutOfStock(stock: number): boolean {
  return stock <= 0;
}

export function getStockLabel(stock: number): string | null {
  if (isOutOfStock(stock)) {
    return 'Out of stock';
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return `Only ${stock} left`;
  }

  return null;
}

export function capQuantity(quantity: number, stock?: number): number {
  if (stock === undefined) {
    return quantity;
  }

  return Math.min(quantity, Math.max(stock, 0));
}
