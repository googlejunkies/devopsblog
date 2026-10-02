import { AuthResponse, BlogPost, Category, PaginatedResponse, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  data: Record<string, any>;
  status: number;

  constructor(message: string, status: number, data: Record<string, any> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('blog_auth_token');
  }
  return null;
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('blog_auth_token', token);
  }
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('blog_auth_token');
    localStorage.removeItem('blog_user');
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Token ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred while communicating with the server.';
    if (data) {
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data.detail) {
        errorMessage = data.detail;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.non_field_errors) {
        errorMessage = Array.isArray(data.non_field_errors)
          ? data.non_field_errors.join(' ')
          : data.non_field_errors;
      } else {
        // Collect first field error
        const firstKey = Object.keys(data)[0];
        if (firstKey) {
          const val = data[firstKey];
          errorMessage = `${firstKey}: ${Array.isArray(val) ? val.join(' ') : val}`;
        }
      }
    }
    throw new ApiError(errorMessage, response.status, data || {});
  }

  return data as T;
}

export const authApi = {
  async register(data: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }): Promise<AuthResponse> {
    const res = await fetchApi<AuthResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAuthToken(res.token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('blog_user', JSON.stringify(res.user));
    }
    return res;
  },

  async login(data: { username: string; password: string }): Promise<AuthResponse> {
    const res = await fetchApi<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setAuthToken(res.token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('blog_user', JSON.stringify(res.user));
    }
    return res;
  },

  async logout(): Promise<void> {
    try {
      await fetchApi('/auth/logout/', {
        method: 'POST',
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      removeAuthToken();
    }
  },

  async getMe(): Promise<User> {
    return fetchApi<User>('/auth/me/');
  },
};

export const postsApi = {
  async getPosts(params: {
    page?: number;
    category?: string;
    search?: string;
    pageSize?: number;
  } = {}): Promise<PaginatedResponse<BlogPost>> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.pageSize) query.append('page_size', params.pageSize.toString());

    const qs = query.toString();
    return fetchApi<PaginatedResponse<BlogPost>>(`/posts/${qs ? `?${qs}` : ''}`);
  },

  async getPostBySlug(slug: string): Promise<BlogPost> {
    return fetchApi<BlogPost>(`/posts/${slug}/`);
  },
};

export const categoriesApi = {
  async getCategories(): Promise<Category[]> {
    return fetchApi<Category[]>('/categories/');
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    return fetchApi<Category>(`/categories/${slug}/`);
  },

  async getCategoryPosts(
    slug: string,
    params: { page?: number } = {}
  ): Promise<PaginatedResponse<BlogPost>> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    const qs = query.toString();
    return fetchApi<PaginatedResponse<BlogPost>>(`/categories/${slug}/posts/${qs ? `?${qs}` : ''}`);
  },
};
