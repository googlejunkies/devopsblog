import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BlogPost } from '@/types';
import BlogCard from '@/components/BlogCard';
import { Calendar, Clock, User as UserIcon, ArrowLeft, Folder, RefreshCw } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/posts/${slug}/`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found | DevOpsBlog',
      description: 'The requested article could not be found.',
    };
  }

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      authors: [post.author?.username || 'DevOpsBlog Author'],
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export default async function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const formattedPublished = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Draft';

  const formattedUpdated = post.updated_at
    ? new Date(post.updated_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const authorName = post.author
    ? `${post.author.first_name || ''} ${post.author.last_name || ''}`.trim() || post.author.username
    : 'Author';

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Articles</span>
        </Link>
      </div>

      {/* Header Info */}
      <header className="space-y-4">
        {post.category && (
          <Link
            href={`/category/${post.category.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
          >
            <Folder className="h-3.5 w-3.5" />
            <span>{post.category.name}</span>
          </Link>
        )}

        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white leading-tight">
          {post.title}
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Author & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-gray-200 py-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 font-bold text-sm">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{authorName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{post.author?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Published: {formattedPublished}</span>
            </span>
            {formattedUpdated && (
              <span className="inline-flex items-center gap-1">
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Updated: {formattedUpdated}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.read_time}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.image && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Full Content (Sanitized on backend by Bleach) */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: post.content || '' }}
      />

      {/* Related Posts Section */}
      {post.related_posts && post.related_posts.length > 0 && (
        <section className="border-t border-gray-200 pt-12 mt-12 dark:border-gray-800">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Related Articles in {post.category.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {post.related_posts.map((rel) => (
              <BlogCard key={rel.id} post={rel} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
