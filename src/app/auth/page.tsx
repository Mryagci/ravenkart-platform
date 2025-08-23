"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// Supabase'i import ETMİYORUZ, her seferinde yeni instance

// --- Yardımcılar her şeyden ÖNCE (kullanımdan önce tanımlı)
function isValidEmail(v: string) {
  return /\S+@\S+\.\S+/.test(v);
}

// Search params'ı ayrı component'ta kullan
function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode") ?? "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Session check YOK - auth sayfasında gerek yok
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      setLoading(true);

      // HER SEFERINDE YENİ CLIENT - listener yok!
      const { createClient } = await import("@supabase/supabase-js");
      const freshSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: true, autoRefreshToken: false } } // auto refresh KAPALI
      );

      if (mode === "signup") {
        if (!isValidEmail(email)) throw new Error("Geçerli bir e-posta girin.");
        const { error } = await freshSupabase.auth.signUp({ email, password });
        if (error) throw error;
        router.replace("/");
        return;
      }

      // login
      const { error } = await freshSupabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.replace("/");
    } catch (e: any) {
      setErr(e?.message || "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center p-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">RAVENKART</h1>
          <p className="text-white/70">Dijital Kartvizit Platformu</p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20"
        >
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">
            {mode === "signup" ? "Hesap Oluştur" : "Hoş Geldiniz"}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-white/80">E-posta</label>
              <input
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                type="email"
                placeholder="ornek@email.com"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-white/80">Şifre</label>
              <input
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                type="password"
                placeholder="••••••••"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {err && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{err}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full mt-6 py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-2xl shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
            <span className="relative z-10 flex items-center justify-center">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  İşleniyor...
                </>
              ) : (
                mode === "signup" ? "Kayıt Ol" : "Giriş Yap"
              )}
            </span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              {mode === "signup" ? "Zaten hesabınız var mı?" : "Hesabınız yok mu?"}
            </p>
            <a
              className="text-white hover:text-white/80 font-medium underline transition-colors"
              href={`/auth?mode=${mode === "signup" ? "login" : "signup"}`}
            >
              {mode === "signup" ? "Giriş Yap" : "Ücretsiz Kayıt Ol"}
            </a>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-white/40 text-xs mt-8">
          © 2024 Ravenkart. Tüm hakları saklıdır.
        </p>
      </div>
    </main>
  );
}

// --- Ana sayfa bileşeni ARROW yerine FUNCTION olarak export et (hoisted)
export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center"><div>Yükleniyor...</div></div>}>
      <AuthForm />
    </Suspense>
  );
}