import React, { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';

export const metadata = {
  title: 'Sign In | DevOpsBlog',
  description: 'Sign in to access your profile and authenticated features.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-gray-500">Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
