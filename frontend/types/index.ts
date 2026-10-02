export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  date_joined: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  posts_count?: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  image: string | null;
  author: User;
  category: Category;
  status: 'DRAFT' | 'PUBLISHED';
  published_at: string | null;
  updated_at?: string;
  created_at: string;
  read_time: string;
  meta_title?: string;
  meta_description?: string;
  related_posts?: BlogPost[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  [key: string]: string | string[];
}
