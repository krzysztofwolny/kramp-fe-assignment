export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
  stock: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

/** Subset of product fields returned by the header quick-search query. */
export type ProductSearchHit = Pick<
  Product,
  'id' | 'name' | 'price' | 'imageUrl' | 'description' | 'stock' | 'createdAt'
>;

export type ProductCategory = 'Tools' | 'Fasteners' | 'Safety Equipment' | 'Power Tools';

export interface UseCartReturn {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isReady: boolean;
}

export interface CartContextValue {
  cart: UseCartReturn;
}
