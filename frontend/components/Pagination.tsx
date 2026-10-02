import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string | undefined>;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== 'page') params.set(k, v);
    });
    if (page > 1) {
      params.set('page', page.toString());
    }
    const query = params.toString();
    return `${baseUrl}${query ? `?${query}` : ''}`;
  };

  // Generate range of page numbers
  const pages: number[] = [];
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = startPage + maxButtons - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav className="flex items-center justify-center gap-1 sm:gap-2 my-8" aria-label="Pagination">
      {/* Prev Button */}
      {hasPrev ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <button
          disabled
          className="flex cursor-not-allowed items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-400 dark:border-gray-800 dark:text-gray-600"
          aria-label="Previous Page Disabled"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>
      )}

      {/* Page Numbers */}
      {startPage > 1 && (
        <>
          <Link
            href={buildUrl(1)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            1
          </Link>
          {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
        </>
      )}

      {pages.map((p) => {
        const isActive = p === currentPage;
        return isActive ? (
          <span
            key={p}
            aria-current="page"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm"
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={buildUrl(p)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {p}
          </Link>
        );
      })}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
          <Link
            href={buildUrl(totalPages)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next Button */}
      {hasNext ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <button
          disabled
          className="flex cursor-not-allowed items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-400 dark:border-gray-800 dark:text-gray-600"
          aria-label="Next Page Disabled"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </nav>
  );
}
