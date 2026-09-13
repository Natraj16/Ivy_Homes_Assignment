import { ensureToken } from './auth';

export const BASE_URL = 'https://solve.ivy.homes';
export const API_KEY  = process.env.NEXT_PUBLIC_IVY_API_KEY || 'IVY26-E9D2ECCA680D';

export async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Always try to get a valid (possibly freshly refreshed) token before each request
  const token = await ensureToken();

  const url = new URL(path.startsWith('http') ? path : `${BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);

  const headers = new Headers(options.headers);
  headers.set('X-API-Key', API_KEY);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url.toString(), { ...options, headers });

  if (res.status === 401) {
    // Token was rejected despite our refresh attempt — session is unrecoverable
    // Clear storage and redirect to login if we're in the browser
    if (typeof window !== 'undefined') {
      ['ivy_token', 'ivy_expires_at', 'ivy_user', 'ivy_refresh_token', 'ivy_refresh_url']
        .forEach(k => localStorage.removeItem(k));
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please log in again.');
  }

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      detail = data.detail || detail;
    } catch {}
    throw new Error(detail);
  }

  return res.json();
}
