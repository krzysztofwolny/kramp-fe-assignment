import { Product, ProductSearchHit } from '../types';

export const mockProduct: Product = {
  id: '1',
  name: 'Heavy Duty Hammer',
  price: 18.99,
  imageUrl: 'https://placehold.co/300x200',
  description: 'A solid 500g steel hammer for demanding workshop tasks.',
  category: 'Tools',
  stock: 142,
  createdAt: '2024-01-15T10:00:00.000Z',
};

export const expensiveProduct: Product = {
  id: '17',
  name: 'Cordless Drill/Driver 18V',
  price: 119.0,
  imageUrl: 'https://placehold.co/300x200',
  description: '18V brushless cordless drill/driver with 2×2Ah batteries.',
  category: 'Power Tools',
  stock: 62,
  createdAt: '2024-01-18T10:00:00.000Z',
};

export const lowStockProduct: Product = {
  ...mockProduct,
  id: '3',
  name: 'Adjustable Wrench 300mm',
  stock: 2,
};

export const outOfStockProduct: Product = {
  ...mockProduct,
  id: '99',
  name: 'Discontinued Tool',
  stock: 0,
};

export const mockSearchResults: ProductSearchHit[] = [
  mockProduct,
  expensiveProduct,
  {
    id: '5',
    name: 'Hex Bolt M8×40 (Pack of 50)',
    price: 8.49,
    imageUrl: 'https://placehold.co/300x200',
    description: 'Grade 8.8 zinc-plated hex head bolts.',
    stock: 1200,
    createdAt: '2024-01-05T07:00:00.000Z',
  },
];

export const mockProductList: Product[] = [
  mockProduct,
  expensiveProduct,
  lowStockProduct,
  {
    id: '5',
    name: 'Hex Bolt M8×40 (Pack of 50)',
    price: 8.49,
    imageUrl: 'https://placehold.co/300x200',
    description: 'Grade 8.8 zinc-plated hex head bolts.',
    category: 'Fasteners',
    stock: 1200,
    createdAt: '2024-01-05T07:00:00.000Z',
  },
];
