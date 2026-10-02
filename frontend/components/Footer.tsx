import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900 dark:text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                <BookOpen className="h-4 w-4" />
              </div>
              <span>DevOps<span className="text-indigo-600 dark:text-indigo-400">Blog</span></span>
            </Link>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 max-w-sm">
              A production-ready full-stack blog platform built with Next.js App Router, Django REST Framework, and PostgreSQL.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                  Latest Posts
                </Link>
              </li>
              <li>
                <Link href="/category/technology" className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/category/programming" className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                  Programming
                </Link>
              </li>
              <li>
                <Link href="/category/ai" className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                  Artificial Intelligence
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">System</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="http://localhost:8000/admin/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Django Admin
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:8000/api/posts/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  REST API Documentation
                </a>
              </li>
              <li>
                <Link href="/login" className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} DevOpsBlog. Production Full-Stack Architecture.</p>
          <p className="mt-2 sm:mt-0">Next.js & Django REST Framework & PostgreSQL</p>
        </div>
      </div>
    </footer>
  );
}
