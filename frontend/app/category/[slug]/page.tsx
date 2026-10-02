'use client';

import React, { Suspense, useEffect, useState, useCallback, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BlogPost, Category } from '@/types';
import { categoriesApi } from '@/lib/api';
import BlogGrid from '@/components/BlogGrid';
import CategoryNavigation from '@/components/CategoryNavigation';
import Pagination from '@/components/Pagination';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { Folder, ArrowLeft } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

function CategoryContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [count, setCount] = useState<number>(0);
  const [pageSize] = useState<number>(6);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const totalPages = Math.ceil(count / pageSize) || 1;

  const loadCategoryData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [catDetail, allCats, postsRes] = await Promise.all([
        categoriesApi.getCategoryBySlug(slug),
        categoriesApi.getCategories(),
        categoriesApi.getCategoryPosts(slug, { page: currentPage }),
      ]);

      setCategory(catDetail);
      setCategories(allCats);
      setPosts(postsRes.results || []);
      setCount(postsRes.count || 0);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [slug, currentPage]);

  useEffect(() => {
    loadCategoryData();
  }, [loadCategoryData]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
        <div className="h-24 w-1/2 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <LoadingState count={6} />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ErrorState
          title="Category not found"
          message="The category you requested could not be found or the server is unavailable."
          onRetry={loadCategoryData}
        />
        <div className="text-center mt-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to All Posts</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Category Header */}
      <div className="rounded-3xl bg-indigo-50/50 p-8 sm:p-10 border border-indigo-100/60 dark:bg-indigo-950/20 dark:border-indigo-900/30">
        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
          <Folder className="h-4 w-4" />
          <span>Category</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-gray-600 dark:text-gray-300">
          {category.description || `Discover articles and resources filed under ${category.name}.`}
        </p>
        <div className="mt-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
          Showing {posts.length} of {count} articles
        </div>
      </div>

      {/* Navigation Filter Pills */}
      <div className="border-b border-gray-200 pb-4 dark:border-gray-800">
        <CategoryNavigation
          categories={categories}
          activeSlug={slug}
          baseUrl="/blog"
        />
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <EmptyState
          title="No posts in this category"
          message={`There are currently no published articles in ${category.name}. Check back soon or browse other topics.`}
          actionHref="/blog"
          actionText="Browse other categories"
        />
      ) : (
        <>
          <BlogGrid posts={posts} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={`/category/${slug}`}
          />
        </>
      )}
    </div>
  );
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);

  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-12"><LoadingState count={6} /></div>}>
      <CategoryContent slug={resolvedParams.slug} />
    </Suspense>
  );
}
