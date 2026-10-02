import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types';
import { Calendar, Clock, User as UserIcon, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  priority?: boolean;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Draft';

  const authorName = post.author
    ? `${post.author.first_name || ''} ${post.author.last_name || ''}`.trim() || post.author.username
    : 'Author';

  const defaultImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* Featured Image */}
      <Link href={`/blog/${post.slug}`} className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-800 block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image || defaultImage}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {post.category && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-indigo-600/90 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
              {post.category.name}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Meta Bar */}
        <div className="mb-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <time dateTime={post.published_at || ''}>{formattedDate}</time>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{post.read_time || '5 min read'}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-xl font-bold tracking-tight text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 line-clamp-2">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-1 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Author & Read More */}
        <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-between dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 text-xs font-medium">
              <UserIcon className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {authorName}
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 group-hover:translate-x-0.5 transition-transform"
          >
            <span>Read more</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
