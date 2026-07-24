type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

interface FetchOptions {
    method?: HttpMethod;
    body?: unknown;
    token?: string;
    tags?: string[];
    signal?: AbortSignal;
}

export async function apiClient<T>(
    endpoint: string,
    options: FetchOptions = {},
): Promise<T> {

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (!API_URL) {
        throw new Error(
            'NEXT_PUBLIC_API_URL no está definida. Revisa tu .env.local y reinicia el servidor de desarrollo.',
        );
    }

    const { method = 'GET', body, token, tags, signal } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const baseUrl = API_URL.replace(/\/+$/, ''); 
    const path = endpoint.replace(/^\/+/, ''); 
    const url = `${baseUrl}/${path}`;

    const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        next: tags ? { tags } : undefined,
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