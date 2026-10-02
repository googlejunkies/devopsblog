import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BlogCard from '@/components/BlogCard';
import { BlogPost } from '@/types';

const mockPost: BlogPost = {
  id: 1,
  title: 'Test Blog Post Title',
  slug: 'test-blog-post-title',
  excerpt: 'This is a sample excerpt for testing purposes.',
  image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
  author: {
    id: 1,
    username: 'testauthor',
    email: 'author@example.com',
    first_name: 'John',
    last_name: 'Doe',
    is_staff: false,
    date_joined: '2026-01-01T00:00:00Z',
  },
  category: {
    id: 1,
    name: 'DevOps',
    slug: 'devops',
    description: 'DevOps articles',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  status: 'PUBLISHED',
  published_at: '2026-02-15T12:00:00Z',
  created_at: '2026-02-15T12:00:00Z',
  read_time: '4 min read',
};

describe('BlogCard Component', () => {
  it('renders blog post title, excerpt, and author properly', () => {
    render(<BlogCard post={mockPost} />);

    expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument();
    expect(screen.getByText('This is a sample excerpt for testing purposes.')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('DevOps')).toBeInTheDocument();
    expect(screen.getByText('4 min read')).toBeInTheDocument();
  });

  it('links correctly to the blog detail page', () => {
    render(<BlogCard post={mockPost} />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/blog/test-blog-post-title');
  });
});
