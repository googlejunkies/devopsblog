'use client';

import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BlogPost, Category } from '@/types';
import { postsApi, categoriesApi } from '@/lib/api';
import BlogGrid from '@/components/BlogGrid';
import CategoryNavigation from '@/components/CategoryNavigation';
import Pagination from '@/components/Pagination';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { Search } from 'lucide-react';

function BlogListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [count, setCount] = useState<number>(0);
  const [pageSize] = useState<number>(6);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>(currentSearch);

  const totalPages = Math.ceil(count / pageSize) || 1;

  const fetchBlogData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [postsRes, catsRes] = await Promise.all([
        postsApi.getPosts({
          page: currentPage,
          category: currentCategory || undefined,
          search: currentSearch || undefined,
          pageSize,
        }),
        categoriesApi.getCategories(),
      ]);

      setPosts(postsRes.results || []);
      setCount(postsRes.count || 0);
      setCategories(catsRes || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentCategory, currentSearch, pageSize]);

  useEffect(() => {
    fetchBlogData();
  }, [fetchBlogData]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set('search', searchInput.trim());
    if (currentCategory) params.set('category', currentCategory);
    // Reset to page 1 on new search
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          All Blog Posts
        </h1>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
          Articles on DevOps, cloud infrastructure, Python backends, and modern frontend development.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6 dark:border-gray-800">
        <CategoryNavigation
          categories={categories}
          activeSlug={currentCategory}
          baseUrl="/blog"
        />

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative min-w-[260px] sm:min-w-[300px]">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          <Search className="pointer-events-none absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
        </form>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState count={6} />
      ) : error ? (
        <ErrorState onRetry={fetchBlogData} />
      ) : posts.length === 0 ? (
        <EmptyState
          title="No articles found"
          message={
            currentSearch
              ? `No articles matched your search query "${currentSearch}".`
              : 'There are currently no published articles in this selection.'
          }
          actionHref="/blog"
          actionText="Clear Filters"
        />
      ) : (
        <>
          <BlogGrid posts={posts} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/blog"
            searchParams={{
              category: currentCategory || undefined,
              search: currentSearch || undefined,
            }}
          />
        </>
      )}
    </div>
  );
}

export default function BlogListPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12"><LoadingState count={6} /></div>}>
      <BlogListContent />
    </Suspense>
  );
}
