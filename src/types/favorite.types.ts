import { Product } from './product.types';

export interface Favorite {
  id: string;
  userId: string;
  productId: number;
  createdAt: string;
  product: Product;
}
