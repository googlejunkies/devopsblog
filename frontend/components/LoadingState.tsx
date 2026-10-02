import React from 'react';

export default function LoadingState({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="aspect-[16/9] w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="mt-4 space-y-3">
            <div className="flex gap-2">
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="pt-4 flex justify-between items-center">
              <div className="h-6 w-24 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
