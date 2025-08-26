/**
 * Credentials Page - Redirects to Admin Panel
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Shield } from 'lucide-react';

export default function CredentialsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin dashboard
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6 p-8">
        <div className="relative">
          <Shield className="w-16 h-16 text-blue-500" />
          <Loader2 className="w-8 h-8 animate-spin text-white absolute -top-2 -right-2" />
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Credentials Erişimi</h1>
          <p className="text-slate-400 mb-4">Admin paneline yönlendiriliyor...</p>
          <div className="flex items-center justify-center space-x-1 text-blue-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}