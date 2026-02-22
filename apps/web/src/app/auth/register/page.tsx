'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HardHat } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    orgName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <HardHat className="h-9 w-9 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Get started today.</h2>
          <p className="mt-3 text-primary-200">
            Join teams already managing their construction projects with Constructo.
          </p>
        </div>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 lg:hidden text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600">
            <HardHat className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Constructo</h1>
        </div>
        <div className="mb-8 hidden lg:block">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Start managing your projects in minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-600">{error}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="firstName"
              label="First Name"
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              required
            />
            <Input
              id="lastName"
              label="Last Name"
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              required
            />
          </div>
          <Input
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@company.com"
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="Min 8 characters"
            required
          />
          <Input
            id="orgName"
            label="Company Name"
            value={form.orgName}
            onChange={(e) => update('orgName', e.target.value)}
            placeholder="Your construction company"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </form>
      </div>
      </div>
    </div>
  );
}
