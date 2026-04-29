'use client';
import { useCallback } from 'react';
import { useAuth } from './useAuth';

export function useApi() {
  const { token, logout } = useAuth();

  const apiFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(url, { ...options, headers });

      if (res.status === 401) {
        logout();
        throw new Error('Session expired. Please login again.');
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');
      return data;
    },
    [token, logout]
  );

  return { apiFetch };
}
