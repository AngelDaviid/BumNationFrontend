const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return '/api';
    }

    return (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/+$/, '');
};

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

interface FetchOptions {
    method?: HttpMethod;
    body?: unknown;
    tags?: string[];
    revalidate?: number;
    signal?: AbortSignal;
}

export async function apiClient<T>(
    endpoint: string,
    options: FetchOptions = {},
): Promise<T> { 

    const { method = 'GET', body, tags, revalidate, signal } = options;

    const isFormData = body instanceof FormData;

    const headers: Record<string, string> = {};

    if (body !== undefined && !isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const baseUrl = getBaseUrl();
    const path = endpoint.replace(/^\/+/, ''); 
    const url = `${baseUrl}/${path}`;

    const response = await fetch(url, {
        method,
        headers,
        body: isFormData ? (body as FormData) : (body ? JSON.stringify(body) : undefined),
        next: tags || revalidate !== undefined ? { tags, revalidate } : undefined,
        signal
    })

    if (!response.ok) {
        const error = await response.json();
        throw error;
    }

    if (response.status === 204) {
        return null as T;
    }

    return response.json()
}