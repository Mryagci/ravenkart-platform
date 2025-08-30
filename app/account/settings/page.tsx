/**
 * Account Settings Page - Redirects to Admin Dashboard
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AccountSettings() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin dashboard
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-slate-400">Admin paneline yönlendiriliyor...</p>
      </div>
    </div>
  );
}