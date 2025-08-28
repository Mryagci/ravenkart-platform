# Vercel 404 Hatası Debug Rehberi

## Yapılan Değişiklikler:

1. ✅ **vercel.json** oluşturuldu
2. ✅ **next.config.mjs** güncellendi (`output: 'standalone'`)
3. ✅ Build test edildi - başarılı

## Sıradaki Adımlar (SIRASIYLA):

### 1. Environment Variables Ekle
Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://atozlshaxxxfgkclvjdd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0b3psc2hheHh4ZmdrY2x2amRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDEwODksImV4cCI6MjA3MTM3NzA4OX0.txY6HQnCsNO3F0ggqGRjw9LsK5baHG8Ch7L0GnktyOc
SUPABASE_URL=https://atozlshaxxxfgkclvjdd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=test_service_key_for_api_structure_test
NEXT_PUBLIC_APP_URL=https://www.ravenkart.com
NEXTAUTH_SECRET=ravenkart-secret-2025
PAYTR_MERCHANT_ID=test123
PAYTR_MERCHANT_KEY=test_key_12345
PAYTR_MERCHANT_SALT=test_salt_67890
PAYTR_TEST_MODE=true
GOOGLE_VISION_API_KEY=AIzaSyAqzRCXGZH3cb2ZLjDmqEW2Hdv8zcuRco8
```

**ÖNEMLİ:** Her değişken için Production, Preview, Development seç!

### 2. Git Push & Redeploy
```bash
git add .
git commit -m "fix: add vercel.json and update next.config for deployment"
git push origin main
```

### 3. Domain Settings Kontrol
Vercel Dashboard → Settings → Domains:
- `ravenkart.com` doğru mu?
- `www.ravenkart.com` redirect var mı?

### 4. Build Logs Kontrol
Deployment başarısızsa:
- Vercel Dashboard → Deployments → Son deployment
- View Function Logs
- Build Logs kontrol et

## Muhtemel Sorunlar:

### A) Build Hatası
- Environment variables eksik
- Node.js versiyonu uyumsuz
- Dependencies eksik

### B) Runtime Hatası  
- API routes çalışmıyor
- Supabase bağlantı sorunu
- Environment variables runtime'da bulunamıyor

### C) Domain Hatası
- DNS ayarları yanlış
- Custom domain doğru yapılandırılmamış

## Test Adımları:
1. Vercel URL'de test et (*.vercel.app)
2. Custom domain'de test et (ravenkart.com)
3. API endpoint'leri test et (/api/contact)

## Eğer Hâlâ 404 Alıyorsan:
1. Vercel functions logs'a bak
2. Browser developer tools'da network tab'ı kontrol et
3. `_next/static` dosyalarının yüklenip yüklenmediğini kontrol et