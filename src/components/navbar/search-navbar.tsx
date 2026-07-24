import Image from 'next/image';
import { RefObject } from 'react';
import { useProductSearch } from '@/hooks/search/use-product-search';
import { useSearchDropdown } from '@/hooks/search/use-search-dropdown-menu';

interface SearchBarProps {
  containerRef: RefObject<HTMLDivElement | null>;
  search: ReturnType<typeof useProductSearch>;
  dropdown: ReturnType<typeof useSearchDropdown>;
  onSubmitClose?: () => void;
  variant?: 'desktop' | 'mobile';
}

export function SearchBar({
  containerRef,
  search,
  dropdown,
  onSubmitClose,
  variant = 'desktop',
}: SearchBarProps) {
  const isDesktop = variant === 'desktop';

  return (
    <div ref={containerRef} className={isDesktop ? 'relative w-100' : 'relative flex-1 mx-2'}>
      <form
        onSubmit={(e) => search.handleSubmit(e, onSubmitClose)}
        className={`flex items-center gap-2 bg-zinc-800 rounded-full px-4 ${isDesktop ? 'py-2' : 'py-2.5'}`}
      >
        <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search.query}
          onChange={(e) => search.setQuery(e.target.value)}
          onFocus={dropdown.open}
          placeholder="¿Qué estás buscando?"
          className={`bg-transparent text-zinc-300 placeholder-zinc-500 outline-none w-full ${
            isDesktop ? 'text-md' : 'text-sm'
          }`}
        />
      </form>

      {dropdown.isOpen && search.showDropdown && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden z-50 ${
            isDesktop ? 'bg-zinc-900' : 'bg-zinc-800'
          }`}
        >
          {search.isLoadingSuggestions && <p className="px-4 py-3 text-sm text-zinc-500">Buscando…</p>}

          {!search.isLoadingSuggestions && search.suggestions.length === 0 && (
            <p className="px-4 py-3 text-sm text-zinc-500">Sin resultados</p>
          )}

          {!search.isLoadingSuggestions &&
            search.suggestions.map((product) => (
              <button
                key={product.id}
                type="button"
                // onClick={() => search.onSelectSuggestion(product.id, dropdown.close)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-zinc-300 hover:text-white transition-colors ${
                  isDesktop ? 'hover:bg-zinc-800' : 'hover:bg-zinc-700'
                }`}
              >
                <div
                  className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-lg ${
                    isDesktop ? 'bg-zinc-800' : 'bg-zinc-700'
                  }`}
                >
                  {product.imageUrl && (
                    <Image src={product.imageUrl} alt={product.name} fill sizes="36px" className="object-cover" />
                  )}
                </div>
                <span className="truncate ">{product.name}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}