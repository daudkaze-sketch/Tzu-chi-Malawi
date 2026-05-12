'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (session || token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [status, session, router]);

  return null;
}
