'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Calendar, Shield, LogOut, CheckCircle, ArrowRight } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-r-transparent" />
        <p className="mt-4 text-sm text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formattedDate = user.date_joined
    ? new Date(user.date_joined).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown';

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Profile Header */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold text-2xl shadow-sm">
              {user.first_name ? user.first_name[0].toUpperCase() : user.username[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {user.first_name || user.last_name
                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                    : user.username}
                </h1>
                {user.is_staff && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <Shield className="h-3 w-3" />
                    <span>Staff</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.is_staff && (
              <a
                href="http://localhost:8000/admin/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <Shield className="h-4 w-4 text-amber-500" />
                <span>Admin Panel</span>
              </a>
            )}
            <button
              onClick={async () => {
                await logout();
                router.push('/');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Account Details</h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-500 dark:text-gray-400 w-24">Username:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{user.username}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-500 dark:text-gray-400 w-24">Email:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{user.email}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-500 dark:text-gray-400 w-24">Joined:</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Security & Status</h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Active Account</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Token-based authentication active</span>
            </div>
            {user.is_staff && (
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Shield className="h-4 w-4" />
                <span>Django Superuser/Staff privileges</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              <span>Explore blog articles</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
