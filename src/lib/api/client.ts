type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

interface FetchOptions {
    method?: HttpMethod;
    body?: unknown;
    token?: string;
    tags?: string[];
    signal?: AbortSignal;
}

function buildUrl(endpoint: string) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (!API_URL) {
        throw new Error(
            'NEXT_PUBLIC_API_URL no está definida. Revisa tu .env.local y reinicia el servidor de desarrollo.',
        );
    }

    const baseUrl = API_URL.replace(/\/+$/, ''); 
    const path = endpoint.replace(/^\/+/, ''); 
    return `${baseUrl}/${path}`;
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({
            statusCode: response.status,
            message: response.statusText,
        }));
        throw error;
    }

    if (response.status === 204) {
        return null as T;
    }

    return response.json()
}

export async function apiClient<T>(
    endpoint: string,
    options: FetchOptions = {},
): Promise<T> {
    const { method = 'GET', body, token, tags, signal } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(buildUrl(endpoint), {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        next: tags ? { tags } : undefined,
        signal
    })

    return handleResponse<T>(response);
}

// Sube un archivo como multipart/form-data (campo "file"), usado para imágenes
export async function apiUpload<T>(
    endpoint: string,
    file: File,
    token: string,
    method: HttpMethod = 'PATCH',
): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(buildUrl(endpoint), {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });

    return handleResponse<T>(response);
}

// Convierte el error del backend en un mensaje legible
export function getErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado.') {
    if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as { message: unknown }).message;
        if (Array.isArray(message)) return message.join(', ');
        if (typeof message === 'string' && message) return message;
    }
    return fallback;
}
