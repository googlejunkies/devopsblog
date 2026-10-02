import React from 'react';
import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionHref?: string;
}

export default function EmptyState({
  title = 'No posts found',
  message = 'There are no blog posts matching your search criteria or category filter.',
  actionText = 'View all articles',
  actionHref = '/blog',
}: EmptyStateProps) {
  return (
    <div className="my-12 flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 text-center dark:border-gray-800 dark:bg-gray-900">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
        <FileQuestion className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">{message}</p>
      {actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
