import { BASE_URL, API_KEY } from './api';

// ─── Types ─────────────────────────────────────────────────────────────────

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;       // seconds — currently 900 (15 min)
  refresh_url: string;      // e.g. "/auth/refresh"
  user: { email: string; [key: string]: any };
}

// ─── Storage helpers ────────────────────────────────────────────────────────

function set(key: string, val: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, val);
}
function get(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}
function clear(...keys: string[]) {
  if (typeof window === 'undefined') return;
  keys.forEach(k => localStorage.removeItem(k));
}

function persistTokens(data: AuthResponse) {
  // Store access token with its expiry (subtract 60 s safety buffer)
  const expiresAt = Date.now() + (data.expires_in - 60) * 1000;
  set('ivy_token',      data.access_token);
  set('ivy_expires_at', expiresAt.toString());
  set('ivy_user',       JSON.stringify(data.user));
  if (data.refresh_token) set('ivy_refresh_token', data.refresh_token);
  if (data.refresh_url)   set('ivy_refresh_url',   data.refresh_url);
}

// ─── Public API ─────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let detail = 'Login failed';
    try { detail = (await res.json()).detail || detail; } catch {}
    throw new Error(detail);
  }

  const data: AuthResponse = await res.json();
  persistTokens(data);
}

export function getToken(): string | null {
  return get('ivy_token');
}

/**
 * Returns true if the stored access token is still valid.
 * Does NOT attempt a refresh — use ensureToken() for that.
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token     = get('ivy_token');
  const expiresAt = get('ivy_expires_at');
  if (!token || !expiresAt) return false;
  return Date.now() < parseInt(expiresAt, 10);
}

// Prevent concurrent refresh calls
let _refreshPromise: Promise<boolean> | null = null;

/**
 * Silently refresh the access token using the stored refresh token.
 * Returns true on success, false if refresh is not possible.
 */
async function silentRefresh(): Promise<boolean> {
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    const refreshToken = get('ivy_refresh_token');
    const refreshUrl   = get('ivy_refresh_url') || '/auth/refresh';
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${BASE_URL}${refreshUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!res.ok) return false;

      const data: AuthResponse = await res.json();
      persistTokens(data);
      return true;
    } catch {
      return false;
    } finally {
      _refreshPromise = null;
    }
  })();

  return _refreshPromise;
}

/**
 * Ensure a valid access token is available.
 * If the token has expired, attempts a silent refresh.
 * Returns the valid token, or null if the session cannot be recovered.
 *
 * Call this in fetchApi() before every authenticated request.
 */
export async function ensureToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const token     = get('ivy_token');
  const expiresAt = get('ivy_expires_at');

  if (!token) return null;

  // Token still valid
  if (expiresAt && Date.now() < parseInt(expiresAt, 10)) {
    return token;
  }

  // Token expired — try to refresh silently
  const ok = await silentRefresh();
  if (ok) return get('ivy_token');

  // Refresh also failed — clear session
  clear('ivy_token', 'ivy_expires_at', 'ivy_user', 'ivy_refresh_token', 'ivy_refresh_url');
  return null;
}

export async function logout(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const token = get('ivy_token');
    if (token) {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'X-API-Key': API_KEY, 'Authorization': `Bearer ${token}` },
      });
    }
  } catch {
    // Best-effort server logout — always clear local state
  } finally {
    clear('ivy_token', 'ivy_expires_at', 'ivy_user', 'ivy_refresh_token', 'ivy_refresh_url');
  }
}
