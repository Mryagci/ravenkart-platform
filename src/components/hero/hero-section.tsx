"use client";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('user-logged-in');
    setUser(isLoggedIn ? { email: 'demo@user.com' } : null);
    setLoading(false);
  }, []);

  return (
    <section className="min-h-[60vh] grid place-items-center text-center p-8">
      <div>
        <h1 className="text-4xl font-bold mb-3">Ravenkart</h1>
        <p className="opacity-80 mb-6">Dijital kartvizit platformu</p>
        <a
          href={user ? "/dashboard" : "/auth?mode=login"}
          className="inline-block bg-black text-white rounded px-5 py-2"
        >
          {user ? "Dashboard'a git" : "Hemen başla"}
        </a>
      </div>
    </section>
  );
}
