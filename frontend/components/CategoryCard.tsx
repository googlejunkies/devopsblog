import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { Folder, ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-900"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <Folder className="h-5 w-5" />
        </div>
        {category.posts_count !== undefined && (
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {category.posts_count} {category.posts_count === 1 ? 'post' : 'posts'}
          </span>
        )}
      </div>

      <h3 className="mt-4 font-bold text-lg text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors">
        {category.name}
      </h3>

      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {category.description || 'Explore articles in this category.'}
      </p>

      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
        <span>Browse articles</span>
        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
