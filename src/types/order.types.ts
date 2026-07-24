import { Product } from './product.types';
import { User } from './user.types';

export type OrderStatus =
  | 'PENDING_CONFIRMATION'
  | 'CONFIRMED'
  | 'AWAITING_PAYMENT'
  | 'PAID'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: number;
  quantity: number;
  priceAtTime: string;
  product: Product;
}

export interface Order {
  id: string;
  orderNumber: number;
  userId: string;
  status: OrderStatus;
  total: string;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user?: Pick<User, 'firstName' | 'firstLastName' | 'email' | 'phone'>;
}