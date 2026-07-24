import { create } from 'zustand';

interface SearchState {
  query: string;
  debouncedQuery: string;
  setQuery: (value: string) => void;
  setQueryImmediate: (value: string) => void;
}

const DEBOUNCE_MS = 400;


let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  debouncedQuery: '',

  setQuery: (value) => {
    set({ query: value });

    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      set({ debouncedQuery: value });
    }, DEBOUNCE_MS);
  },

  setQueryImmediate: (value) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    set({ query: value, debouncedQuery: value });
  },
}));