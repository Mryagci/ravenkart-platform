# 🔒 Vercel Environment Variables Güvenli Kurulum

## ✅ Güvenlik Yaklaşımı:
- **API key'ler sadece Vercel dashboard'da saklanacak**
- **GitHub'da hiçbir API key bulunmayacak**  
- **Localhost .env.local sadece development için**

## 📋 Vercel Dashboard'da Eklenecek Variables:

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://atozlshaxxxfgkclvjdd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Supabase Dashboard'dan al]
SUPABASE_URL=https://atozlshaxxxfgkclvjdd.supabase.co  
SUPABASE_SERVICE_ROLE_KEY=[Supabase Settings > API > service_role key]
```

### App Configuration
```
NEXT_PUBLIC_APP_URL=https://www.ravenkart.com
NEXTAUTH_SECRET=[güçlü random secret oluştur]
```

### PayTR (Test/Production)
```
PAYTR_MERCHANT_ID=[PayTR'den al]
PAYTR_MERCHANT_KEY=[PayTR'den al]
PAYTR_MERCHANT_SALT=[PayTR'den al]
PAYTR_TEST_MODE=true
```

### Google Cloud Vision
```
GOOGLE_VISION_API_KEY=[Google Cloud Console'dan regenerate et]
```

## 🎯 Vercel Dashboard Adımları:
1. **Project Settings > Environment Variables**
2. **Her variable için Production, Preview, Development seç**
3. **"Add" ile tek tek ekle**
4. **"Redeploy" ile güncel key'lerle deploy et**

## 🔐 Güvenlik Avantajları:
- ✅ GitHub'da hiçbir secret yok
- ✅ Vercel encrypted storage
- ✅ Team access control mümkün
- ✅ Key rotation kolay
- ✅ Audit log var