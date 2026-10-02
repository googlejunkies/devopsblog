'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BlogPost, Category } from '@/types';
import { postsApi, categoriesApi } from '@/lib/api';
import BlogGrid from '@/components/BlogGrid';
import CategoryCard from '@/components/CategoryCard';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { ArrowRight, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [postsRes, catsRes] = await Promise.all([
        postsApi.getPosts({ pageSize: 6 }),
        categoriesApi.getCategories(),
      ]);
      setPosts(postsRes.results || []);
      setCategories(catsRes || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 px-6 py-16 sm:px-12 sm:py-24 text-center text-white shadow-xl">
            <div className="mx-auto max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Next.js 16 + Django REST Framework + PostgreSQL</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Engineering, DevOps & Modern Architecture
              </h1>
              <p className="text-lg text-indigo-100 sm:text-xl max-w-2xl mx-auto leading-relaxed">
                Deep dives into full-stack development, cloud native deployments, PostgreSQL optimizations, and AI workflow orchestration.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-indigo-900 shadow-sm hover:bg-indigo-50 transition-colors"
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Explore Articles</span>
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <span>Join Community</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl flex items-center gap-2">
              <Layers className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <span>Browse by Topic</span>
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Curated articles organized by software engineering domains.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <span>All posts</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* Featured / Latest Posts Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Latest Publications
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Fresh insights, tutorials, and architectural patterns.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            <span>View all articles</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingState count={6} />
        ) : error ? (
          <ErrorState onRetry={loadData} />
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 p-8 text-center dark:border-gray-800">
            <p className="text-gray-500">No blog posts available yet.</p>
          </div>
        ) : (
          <BlogGrid posts={posts} />
        )}
      </section>
    </div>
  );
}
