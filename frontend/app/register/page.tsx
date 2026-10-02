import React from 'react';
import RegisterForm from '@/components/RegisterForm';

export const metadata = {
  title: 'Create Account | DevOpsBlog',
  description: 'Join the DevOpsBlog community by creating a new account.',
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  );
}
