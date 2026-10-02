import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';

interface CategoryNavigationProps {
  categories: Category[];
  activeSlug?: string;
  baseUrl?: string;
}

export default function CategoryNavigation({
  categories,
  activeSlug,
  baseUrl = '/blog',
}: CategoryNavigationProps) {
  const isAll = !activeSlug;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <Link
        href={baseUrl}
        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          isAll
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        All
      </Link>
      {categories.map((cat) => {
        const isActive = activeSlug === cat.slug;
        return (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {cat.name}
            {cat.posts_count !== undefined && (
              <span className={`ml-1.5 text-xs opacity-80`}>
                ({cat.posts_count})
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
