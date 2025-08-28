# Vercel Environment Variables Setup

Bu dosyayı Vercel dashboard'da Project Settings > Environment Variables bölümünde kullanın:

## Production Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://atozlshaxxxfgkclvjdd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0b3psc2hheHh4ZmdrY2x2amRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDEwODksImV4cCI6MjA3MTM3NzA4OX0.txY6HQnCsNO3F0ggqGRjw9LsK5baHG8Ch7L0GnktyOc
SUPABASE_URL=https://atozlshaxxxfgkclvjdd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[GERÇEKİNİ SUPABASE'DEN AL]
NEXT_PUBLIC_APP_URL=https://www.ravenkart.com
NEXTAUTH_SECRET=[GÜVENLİ BİR SECRET OLUŞTUR]

# PayTR (Şu an test değerleri)
PAYTR_MERCHANT_ID=test123
PAYTR_MERCHANT_KEY=test_key_12345
PAYTR_MERCHANT_SALT=test_salt_67890
PAYTR_TEST_MODE=true

# Google Cloud Vision
GOOGLE_VISION_API_KEY=AIzaSyAqzRCXGZH3cb2ZLjDmqEW2Hdv8zcuRco8
```

## Adımlar:
1. Vercel dashboard'a git
2. Proje seç 
3. Settings > Environment Variables
4. Yukarıdaki her bir variable'ı ekle
5. Production, Preview, Development için seç
6. Deploy et