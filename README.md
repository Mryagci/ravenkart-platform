# 🚀 Ravenkart - Dijital Kimlik Platformu

NFC/QR destekli modern dijital kartvizit platformu. Next.js 14 ve Supabase ile geliştirilmiştir.

## ✨ Özellikler

- 🎨 Modern gradient animasyonlu hero bölümü
- 📱 Mobil-öncelikli tasarım
- 🔐 Supabase Auth entegrasyonu
- 💎 Glassmorphism UI tasarımı
- ⚡ Next.js App Router
- 🎭 Framer Motion animasyonları
- 🎯 TypeScript desteği
- 📊 Multi-tenant SaaS mimarisi

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Kütüphanesi**: shadcn/ui, Radix UI
- **Animasyonlar**: Framer Motion
- **Backend**: Supabase (Auth, DB, Storage)
- **Deployment**: Vercel

## 📦 Kurulum

1. **Repoyu klonlayın**
```bash
git clone <repo-url>
cd ravenkart
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment değişkenlerini ayarlayın**
```bash
cp .env.local.example .env.local
# .env.local dosyasını Supabase bilgilerinizle güncelleyin
```

4. **Supabase şemasını oluşturun**
```bash
# Supabase Dashboard'dan supabase-schema.sql dosyasını çalıştırın
```

5. **Development serverını başlatın**
```bash
npm run dev
```

## 🗂️ Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication sayfaları
│   ├── dashboard/         # Dashboard sayfaları
│   ├── u/                 # Public profil sayfaları
│   └── globals.css        # Global stiller
├── components/            # React bileşenleri
│   ├── ui/               # Temel UI bileşenleri
│   ├── forms/            # Form bileşenleri
│   └── layout/           # Layout bileşenleri
├── lib/                  # Utility fonksiyonları
├── types/                # TypeScript türleri
└── utils/                # Yardımcı fonksiyonlar
```

## 📋 Geliştirme Durumu

### ✅ Tamamlanan
- [x] Proje yapısı kurulumu
- [x] Supabase şema tasarımı ve RLS politikaları
- [x] Hero section gradient animasyonları
- [x] Temel UI bileşenleri (shadcn/ui)
- [x] Authentication sistemi (login/register)
- [x] Dashboard profil yönetimi
- [x] Public profil sayfası (/u/[username])
- [x] QR kod oluşturma ve gösterimi
- [x] Profil fotoğrafı yükleme sistemi
- [x] Sosyal medya linkleri yönetimi
- [x] Proje/ürün showcase
- [x] Ayarlar sayfası
- [x] vCard export özelliği
- [x] Responsive tasarım
- [x] Vercel deployment konfigürasyonu

### 📅 Gelecek Sürümler İçin Planlanan
- [ ] QR kod tarama özelliği
- [ ] NFC entegrasyonu
- [ ] Analytics dashboard ve istatistikler
- [ ] Multi-language desteği
- [ ] Tema özelleştirme
- [ ] Toplu profil yönetimi
- [ ] API endpoint'leri
- [ ] Mobile app

## 🚀 Deployment

Vercel ile tek tık deployment için:

1. GitHub'a push yapın
2. Vercel'de projeyi import edin
3. Environment değişkenlerini ayarlayın
4. Deploy edin!

## 📖 Dökümanlar

- [PRD](./Ravenkart_PRD.md) - Product Requirements Document
- [Database Schema](./supabase-schema.sql) - Supabase veritabanı şeması

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altındadır.

---

💎 **Ravenkart** ile dijital kimliğinizi oluşturun!.