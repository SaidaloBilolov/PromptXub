'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function RootAdminPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-[#0F172A] flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 text-slate-300 font-semibold text-sm animate-pulse">
        <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span>Redirecting to PromptXub Admin Portal...</span>
      </div>
    </div>
  );
}
