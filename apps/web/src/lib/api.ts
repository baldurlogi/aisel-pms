export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type QueryParams = Record<string, string | number | boolean>;

export const api = {
  get: <T, P extends QueryParams = QueryParams>(
    path: string,
    params?: P,
    options?: RequestInit,
  ) => {
    const queryString = params ? `?${serializeParams(params)}` : '';
    return request<T>(`${path}${queryString}`, 'GET', undefined, options);
  },
  post: <T>(path: string, data: unknown, options?: RequestInit) =>
    request<T>(path, 'POST', data, options),
  put: <T>(path: string, data: unknown, options?: RequestInit) =>
    request<T>(path, 'PUT', data, options),
  delete: <T>(path: string, options?: RequestInit) =>
    request<T>(path, 'DELETE', undefined, options),
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T = unknown>(
  path: string,
  method: HttpMethod = 'GET',
  data?: unknown,
  options: RequestInit = {},
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}) as Record<string, unknown>);

    if (res.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
      return Promise.reject(new Error('Unauthorized'));
    }

    throw new Error(error.message || 'Request failed');
  }

  return res.json();
}

function serializeParams(params: Record<string, string | number | boolean>) {
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    urlParams.append(key, String(value));
  });
  return urlParams.toString();
}
