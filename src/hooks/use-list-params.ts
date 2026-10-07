import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildQueryHref, QueryUpdates } from "@/common/url-params";

const SEARCH_DELAY_MS = 400;

const parsePage = (value: string | null) => {
  const page = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(page) && page > 1 ? page : 1;
};

interface UseListParamsOptions {
  liveSearch?: boolean;
}

export function useListParams({ liveSearch = true }: UseListParamsOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") ?? "";
  const page = parsePage(searchParams.get("page"));

  const [search, setSearch] = useState(urlSearch);
  const [syncedSearch, setSyncedSearch] = useState(urlSearch);

  if (syncedSearch !== urlSearch) {
    setSyncedSearch(urlSearch);
    setSearch(urlSearch);
  }

  const replace = (updates: QueryUpdates) =>
    router.replace(buildQueryHref(pathname, searchParams, updates), { scroll: false });

  const term = search.trim();

  const commitSearch = () => {
    setSyncedSearch(term);
    replace({ search: term || undefined });
  };

  useEffect(() => {
    if (!liveSearch || term === syncedSearch) return;
    const timeout = setTimeout(() => {
      setSyncedSearch(term);
      router.replace(buildQueryHref(pathname, searchParams, { search: term || undefined }), { scroll: false });
    }, SEARCH_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [liveSearch, term, syncedSearch, router, pathname, searchParams]);

  const goToPage = (target: number) => replace({ page: target > 1 ? String(target) : undefined });

  return {
    search,
    setSearch,
    commitSearch,
    debouncedSearch: urlSearch,
    page,
    nextPage: () => goToPage(page + 1),
    prevPage: () => goToPage(page - 1),
    getParam: (key: string) => searchParams.get(key) ?? undefined,
    setFilter: (key: string, value?: string) => replace({ [key]: value }),
    setDetail: (key: string, value?: string) => replace({ [key]: value, page: searchParams.get("page") ?? undefined }),
  };
}
