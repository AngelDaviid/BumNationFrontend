import { Product } from './product.types';

export interface CartItem {
  id: string;
  cartId: string;
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}