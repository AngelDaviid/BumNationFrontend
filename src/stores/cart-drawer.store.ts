import { create } from 'zustand';

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
