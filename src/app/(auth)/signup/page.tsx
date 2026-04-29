'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      router.push('/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-6">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {(['name', 'email', 'password'] as const).map((field) => (
          <div key={field}>
            <label className="label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
              className="input"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              required
              minLength={field === 'password' ? 6 : undefined}
            />
          </div>
        ))}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account…' : 'Sign Up'}
        </button>
      </form>
      <p className="text-neutral-500 text-sm mt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-amber-400 hover:text-amber-300">
          Login
        </Link>
      </p>
    </div>
  );
}
