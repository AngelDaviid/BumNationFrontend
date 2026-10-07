export type RawSearchParams = Record<string, string | string[] | undefined>;

export type QueryUpdates = Record<string, string | undefined>;

export const firstParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export function buildQueryHref(basePath: string, current: URLSearchParams | RawSearchParams, updates: QueryUpdates) {
  const params =
    current instanceof URLSearchParams ? new URLSearchParams(current.toString()) : new URLSearchParams();
  if (!(current instanceof URLSearchParams)) {
    for (const [key, value] of Object.entries(current)) {
      const v = firstParam(value);
      if (v) params.set(key, v);
    }
  }
  if (!("page" in updates)) params.delete("page");
  for (const [key, value] of Object.entries(updates)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
