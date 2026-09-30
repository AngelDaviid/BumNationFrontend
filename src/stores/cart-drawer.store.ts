import { create } from 'zustand';

// Estado del carrito lateral que se abre al agregar un producto
interface CartDrawerState {
  isOpen: boolean;
  open: () => void;
  setOpen: (isOpen: boolean) => void;
}

export const useCartDrawerStore = create<CartDrawerState>()((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  setOpen: (isOpen) => set({ isOpen }),
}));
