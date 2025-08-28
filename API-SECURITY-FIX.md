# 🚨 ACİL GÜVENLİK UYARISI - Google API Key İhlali

## DURUM:
- ❌ Google API key GitHub'da public oldu
- ❌ Google tarafından tespit edildi
- ✅ Key'ler dosyalardan temizlendi

## YAPMAN GEREKEN ADIMLAR (SIRASIYLA):

### 1. ⚡ Google Cloud Console (ŞİMDİ YAP!)
```
1. https://console.cloud.google.com/apis/credentials adresine git
2. RAVENKARTVISION projesini seç
3. "AIzaSyAqzRCXGZH3cb2ZLjDmqEW2Hdv8zcuRco8" key'ini bul
4. Edit → "REGENERATE KEY" butonuna bas
5. Yeni key'i kopyala ve güvenli yerde sakla
```

### 2. 🔒 API Key Restrictions Ekle
```
1. Aynı sayfada "Edit" butonuna bas
2. "Application restrictions" → HTTP referrers
3. Şu domain'leri ekle:
   - https://www.ravenkart.com/*
   - https://localhost:3000/*
   - https://*.vercel.app/*
4. "API restrictions" → "Cloud Vision API" seç
5. "Save" butonuna bas
```

### 3. 📝 Environment Variables Güncelle
```
1. .env.local dosyasında yeni key'i değiştir
2. Vercel dashboard'da environment variables güncelle
3. vercel-env-setup.md'deki placeholder'ı yeni key ile değiştir
```

### 4. 🔍 Billing & Usage Kontrol
```
1. Google Cloud Console → Billing
2. Son kullanım durumunu kontrol et
3. Anormal aktivite var mı?
4. API quota'ları kontrol et
```

### 5. 🧹 Temizlik & Güvenlik
```
1. Git history'den key'i tamamen sil (git filter-branch)
2. GitHub'da "Settings → Security → Secret scanning" aktif mi?
3. Gelecekte .env dosyalarını .gitignore'a ekle
```

## ⚠️ ÖNEMLİ NOTLAR:

- Eski key artık çalışmayacak, OCR fonksiyonları durabilir
- Yeni key'i aldıktan sonra localhost'ta test et
- Vercel'e deploy etmeden önce environment variables güncelle
- Bu tür key'leri asla GitHub'a commit etme

## 🛡️ Gelecek İçin Güvenlik:

1. **.env** dosyalarını **.gitignore**'a ekle
2. Production key'leri sadece Vercel environment variables'da tut
3. Development için ayrı key kullan
4. API key restrictions her zaman aktif et

## SONRAKI ADIM:
Yeni key'i aldıktan sonra bana ver, dosyaları güncelleyeyim.