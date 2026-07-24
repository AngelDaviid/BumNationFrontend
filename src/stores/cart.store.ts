import { create } from 'zustand';
import { Cart, CartItem } from '@/types';

interface CartState {
  cart: Cart | null;
  itemCount: number;
  setCart: (cart: Cart) => void;
  addItem: (item: CartItem) => void;
  updateItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: null,
  itemCount: 0,

  setCart: (cart) =>
    set({
      cart,
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    }),

  addItem: (newItem) => {
    const { cart } = get();
    if (!cart) return;

    const existingIndex = cart.items.findIndex(
      (item) => item.id === newItem.id,
    );

    const updatedItems =
      existingIndex >= 0
        ? cart.items.map((item, i) => (i === existingIndex ? newItem : item))
        : [...cart.items, newItem];

    const updatedCart = { ...cart, items: updatedItems };
    set({
      cart: updatedCart,
      itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
    });
  },

  updateItem: (itemId, quantity) => {
    const { cart } = get();
    if (!cart) return;

    const updatedItems = cart.items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item,
    );

    set({
      cart: { ...cart, items: updatedItems },
      itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
    });
  },

  removeItem: (itemId) => {
    const { cart } = get();
    if (!cart) return;

    const updatedItems = cart.items.filter((item) => item.id !== itemId);
    set({
      cart: { ...cart, items: updatedItems },
      itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
    });
  },

  clearCart: () =>
    set({
      cart: null,
      itemCount: 0,
    }),
}));