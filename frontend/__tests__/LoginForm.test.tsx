import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from '@/components/LoginForm';
import { AuthProvider } from '@/context/AuthContext';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue(null),
  }),
}));

describe('LoginForm Component', () => {
  it('renders login form inputs and submit button', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    expect(screen.getByLabelText(/Username or Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('validates empty inputs on submit', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    const submitBtn = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(submitBtn);

    // HTML5 required validation or error message is triggered
    expect(screen.getByLabelText(/Username or Email/i)).toBeRequired();
    expect(screen.getByLabelText(/Password/i)).toBeRequired();
  });
});
