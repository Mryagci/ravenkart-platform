'use client';

import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950">
      <main className="p-8">
        {children}
      </main>
    </div>
  );
}