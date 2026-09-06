import { TOKEN_KEY, clearAuthSession } from './auth';

function getApiBaseUrl(): string {
  const rawUrl = (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://promptxub.onrender.com'
  ).trim().replace(/\/+$/, '');

  if (rawUrl.endsWith('/api/v1')) {
    return rawUrl;
  }
  if (rawUrl.endsWith('/api')) {
    return `${rawUrl}/v1`;
  }
  return `${rawUrl}/api/v1`;
}

export const API_BASE_URL = getApiBaseUrl();

export interface ApiClientOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Robust API Client with Request & Response Interceptors
 * - Automatically attaches Authorization: Bearer <token> from localStorage
 * - Safe for Server-Side Rendering (SSR) via typeof window !== 'undefined'
 * - Cleans up session and redirects to /login on 401 Unauthorized
 */
export async function apiClient<T = any>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { timeoutMs = 30000, headers: customHeaders, ...fetchOptions } = options;

  // 1. REQUEST INTERCEPTOR: Build headers & attach Authorization token safely
  const headers = new Headers(customHeaders);

  // Set default Content-Type if sending JSON body (not FormData)
  if (fetchOptions.body && !(fetchOptions.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // SSR-Safe Check: Retrieve token from localStorage only on client-side
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && token !== 'null' && token !== 'undefined') {
      headers.set('Authorization', `Bearer ${token.trim()}`);
    }
  }

  // Timeout control
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const fullUrl = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 2. RESPONSE INTERCEPTOR: Handle 401 Unauthorized
    if (response.status === 401) {
      console.warn(`[API Client] 401 Unauthorized from ${fullUrl}. Clearing session.`);
      clearAuthSession();

      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?expired=true';
      }

      throw new Error('Session expired or unauthorized. Please log in again.');
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`API Error (${response.status} ${response.statusText}): ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return (await response.json()) as T;
    }
    return (await response.text()) as unknown as T;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Connection timed out after ${timeoutMs}ms (${fullUrl})`);
    }
    throw error;
  }
}
