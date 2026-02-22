'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  orgId: string | null;
  loading: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    orgId: null,
    loading: true,
  });

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      api
        .get<User>('/users/me')
        .then((user) => {
          setState({ user, orgId: localStorage.getItem('orgId'), loading: false });
        })
        .catch(() => {
          api.setToken(null);
          setState({ user: null, orgId: null, loading: false });
        });
    } else {
      setState({ user: null, orgId: null, loading: false });
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<{ user: User; orgId: string; accessToken: string }>(
        '/auth/login',
        { email, password },
      );
      api.setToken(res.accessToken);
      if (res.orgId) localStorage.setItem('orgId', res.orgId);
      setState({ user: res.user, orgId: res.orgId, loading: false });
      router.push('/dashboard');
    },
    [router],
  );

  const register = useCallback(
    async (data: { email: string; password: string; firstName: string; lastName: string; orgName?: string }) => {
      const res = await api.post<{ user: User; orgId: string; accessToken: string }>(
        '/auth/register',
        data,
      );
      api.setToken(res.accessToken);
      if (res.orgId) localStorage.setItem('orgId', res.orgId);
      setState({ user: res.user, orgId: res.orgId, loading: false });
      router.push('/dashboard');
    },
    [router],
  );

  const logout = useCallback(() => {
    api.setToken(null);
    localStorage.removeItem('orgId');
    setState({ user: null, orgId: null, loading: false });
    router.push('/auth/login');
  }, [router]);

  return { ...state, login, register, logout };
}
