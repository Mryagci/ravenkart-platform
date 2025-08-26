# 🤖 Ravenkart - Claude Proje Takip Dosyası

## 📊 Proje Özeti
**Adı:** Ravenkart - Dijital Kartvizit Platformu  
**Teknoloji:** Next.js 14 + TypeScript + Supabase + PayTR  
**Durum:** Aktif Geliştirme  
**Son Güncelleme:** 26 Ağustos 2025  

---

## 🗂️ Proje Mimarisi

### Teknolojiler
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Payment:** PayTR entegrasyonu
- **Deployment:** Vercel
- **Animasyonlar:** Framer Motion

### Önemli Dizinler
```
src/
├── app/
│   ├── api/paytr/          # PayTR API endpoints
│   ├── auth/               # Authentication sayfaları
│   ├── pricing/            # Fiyatlandırma sayfası
│   └── payment/            # Payment success/failure
├── components/
│   └── layout/             # Layout componentleri
└── server/                 # Server-side utilities
    ├── supabaseAdmin.ts    # Admin client
    └── paytr.ts           # PayTR utilities

supabase/migrations/        # Database migrations
scripts/                   # Test ve utility scripts
```

### Environment Variables
```env
# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=     # ⚠️ KRITIK: Admin işlemleri için
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# PayTR
PAYTR_MERCHANT_ID=             # ⚠️ KRITIK: PayTR'den alınacak
PAYTR_MERCHANT_KEY=            # ⚠️ KRITIK: PayTR'den alınacak  
PAYTR_MERCHANT_SALT=           # ⚠️ KRITIK: PayTR'den alınacak
PAYTR_TEST_MODE=true

# App
NEXT_PUBLIC_APP_URL=
NEXTAUTH_SECRET=
```

---

## ✅ TAMAMLANAN İŞLER

### 🗄️ Database & Backend
- [x] **Supabase Database Setup** - Tüm tablolar oluşturuldu
  - [x] `cards` tablosu (dijital kartvizitler)
  - [x] `qr_analytics` tablosu (QR tarama istatistikleri)  
  - [x] `payments` tablosu (ödeme kayıtları)
  - [x] `subscriptions` tablosu (abonelik yönetimi)
  - [x] `webhook_events` tablosu (idempotency için)
- [x] **Row Level Security (RLS)** - Tüm tablolarda aktif
- [x] **Database Views** - `user_stats` ve `payment_stats`
- [x] **Triggers & Functions** - `updated_at`, `generate_unique_username`, vb.
- [x] **Indexes** - Performance optimizasyonu

### 💳 PayTR Ödeme Entegrasyonu  
- [x] **API Endpoints**
  - [x] `/api/paytr/initiate` - Ödeme başlatma
  - [x] `/api/paytr/webhook` - PayTR callback handler
- [x] **Security Implementation**
  - [x] HMAC-SHA256 hash validation
  - [x] Webhook idempotency (duplicate prevention)
  - [x] Environment variable validation
- [x] **Server Utilities**
  - [x] `src/server/supabaseAdmin.ts` - Admin client
  - [x] `src/server/paytr.ts` - PayTR hash/token utilities
- [x] **Node.js Runtime** - Crypto operations için

### 🎨 Frontend & UI
- [x] **Layout Components**
  - [x] Responsive navbar (glassmorphism effect)
  - [x] Hero section (gradient animations)
  - [x] Features section  
  - [x] Stats section (1990 users, 12K+ shares, 99% satisfaction)
  - [x] CTA section
- [x] **Pricing Page** - PayTR entegrasyonu ile
- [x] **Payment Pages**
  - [x] Success page (`/payment/success`)
  - [x] Failure page (`/payment/failure`)
- [x] **Authentication** - Supabase Auth entegrasyonu

### 🔧 Development Tools
- [x] **Test Scripts**
  - [x] `scripts/test-webhook.ts` - Webhook simulation
  - [x] `scripts/validate-setup.js` - Core functions test
  - [x] `scripts/test-api-endpoints.js` - API test suite
- [x] **Setup Guides**
  - [x] `scripts/get-supabase-keys.md`
  - [x] `scripts/get-paytr-keys.md`
  - [x] `.env.template` - Environment template

---

## 🔄 DEVAM EDEN İŞLER

### 🛡️ Superadmin Panel Implementation
- [x] **Architecture Planning** - Superadmin yapısı tasarlandı
- [x] **CLAUDE.md Update** - Proje dokümantasyonu güncellendi
- [ ] **Database Schema** - Superadmin tabloları oluşturulacak
- [ ] **Middleware Setup** - Authentication kontrolü
- [ ] **Admin Layout** - Dashboard ve navigation
- [ ] **Product Management** - CRUD interface
- [ ] **Pricing Management** - Plan konfigürasyonu
- [ ] **Policy Management** - İçerik yönetimi
- [ ] **Contact Management** - İletişim bilgileri

### 🔐 Credentials & Configuration
- [ ] **Supabase Service Role Key** - Dashboard'dan alınacak
- [ ] **PayTR Test Credentials** - PayTR'ye kayıt, API bilgileri alınacak
- [ ] **Environment Variables** - Gerçek değerlerle güncelleme

---

## 📝 YAPILACAK İŞLER

### 🚨 KRİTİK ÖNCELİK (Hemen)

#### Payment Testing & Validation
- [ ] **End-to-End Payment Test**
  - [ ] Gerçek PayTR credentials ile test
  - [ ] Personal plan satın alma flow'u
  - [ ] Database'de payment + subscription kaydı kontrolü
- [ ] **Webhook Idempotency Test** 
  - [ ] Aynı merchant_oid ile duplicate webhook gönderme
  - [ ] Database'de sadece bir kayıt olduğunu doğrulama
- [ ] **Error Scenarios Testing**
  - [ ] Failed payment handling
  - [ ] Timeout scenarios  
  - [ ] Invalid webhook data
  - [ ] Network connection issues

#### Security & Performance
- [ ] **PayTR IP Whitelist** - Production webhook security
- [ ] **Rate Limiting** - API endpoint'leri için
- [ ] **Input Validation** - Request body sanitization
- [ ] **Error Logging** - Structured logging system

### 🔶 ORTA ÖNCELİK (Sonraki Sprint)

#### Production Deployment
- [ ] **Vercel Deployment Setup**
  - [ ] Environment variables configuration
  - [ ] Build optimization
  - [ ] Domain configuration
  - [ ] SSL setup
- [ ] **PayTR Production Configuration**
  - [ ] Live merchant credentials
  - [ ] Production callback URLs
  - [ ] Webhook IP restrictions

#### User Experience Enhancements
- [ ] **Payment UI Improvements**
  - [ ] Loading states during payment
  - [ ] Better error messages
  - [ ] Progress indicators
  - [ ] Mobile optimization
- [ ] **Dashboard Integration**
  - [ ] Payment history sayfası
  - [ ] Subscription status display
  - [ ] Plan upgrade/downgrade UI
  - [ ] Invoice downloads

#### Email & Notifications  
- [ ] **Email Templates**
  - [ ] Payment success notification
  - [ ] Payment failure notification
  - [ ] Subscription renewal reminders
  - [ ] Plan upgrade confirmations
- [ ] **Email Service Setup** - Resend veya SendGrid

### 🔶 ORTA ÖNCELİK (Superadmin Panel)

#### 🛡️ Superadmin Core Features
- [ ] **Authentication System**
  - [ ] Middleware for admin route protection
  - [ ] Superadmin check utility (1erkinyagci@gmail.com)
  - [ ] Session management ve timeout
  - [ ] Audit logging for all admin actions
- [ ] **Database Schema**
  - [ ] `superadmins` table creation
  - [ ] `site_products` table (dynamic products)
  - [ ] `pricing_plans` table (configurable pricing)
  - [ ] `site_policies` table (privacy, terms, etc.)
  - [ ] `contact_info` table (contact details)

#### 🎛️ Admin Management Interfaces
- [ ] **Admin Dashboard** (`/admin/dashboard`)
  - [ ] Overview statistics (users, payments, cards)
  - [ ] Recent activities log
  - [ ] Quick actions panel
  - [ ] System health indicators
- [ ] **Product Management** (`/admin/products`)
  - [ ] CRUD operations for site products/services
  - [ ] Drag-drop ordering
  - [ ] Feature list editor
  - [ ] Image upload for products
  - [ ] Active/inactive toggle
- [ ] **Pricing Configuration** (`/admin/pricing`)
  - [ ] Plan management (Personal, Professional, Enterprise)
  - [ ] Monthly/yearly pricing updates
  - [ ] Feature list per plan
  - [ ] Popular plan flag
  - [ ] A/B testing support (future)
- [ ] **Policy Management** (`/admin/policies`)
  - [ ] Rich text editor for policies
  - [ ] Version control system
  - [ ] Preview mode
  - [ ] Auto-save drafts
  - [ ] Publish/unpublish functionality
- [ ] **Contact Management** (`/admin/contact`)
  - [ ] Email addresses management
  - [ ] Phone numbers
  - [ ] Physical addresses
  - [ ] Social media links
  - [ ] Support hours configuration

#### 🎨 Admin UI/UX
- [ ] **Layout Components**
  - [ ] Admin sidebar navigation
  - [ ] Breadcrumb navigation
  - [ ] Admin-specific header
  - [ ] Dark/light mode toggle
- [ ] **Data Tables**
  - [ ] Sortable columns
  - [ ] Filtering capabilities
  - [ ] Pagination
  - [ ] Bulk actions
- [ ] **Form Components**
  - [ ] React Hook Form + Zod validation
  - [ ] Rich text editor integration
  - [ ] Image upload components
  - [ ] Auto-save functionality

#### 🔒 Security & Performance
- [ ] **Security Measures**
  - [ ] Server-side validation on all endpoints
  - [ ] Rate limiting for admin APIs
  - [ ] CSRF protection
  - [ ] Input sanitization
  - [ ] Error logging and monitoring
- [ ] **Performance Optimization**
  - [ ] Caching strategies for admin data
  - [ ] Optimistic updates
  - [ ] Background job processing
  - [ ] Database query optimization

### 🔵 DÜŞÜK ÖNCELİK (Future Features)

#### Advanced Payment Features
- [ ] **Subscription Management**
  - [ ] Plan upgrade/downgrade logic
  - [ ] Prorated billing calculations  
  - [ ] Subscription cancellation
  - [ ] Auto-renewal management
- [ ] **Invoice System**
  - [ ] PDF invoice generation
  - [ ] Invoice numbering system
  - [ ] Tax calculations (KDV)
  - [ ] Invoice email delivery

#### Advanced Admin Features
- [ ] **User Management** (`/admin/users`)
  - [ ] User list with search/filter
  - [ ] User detail view
  - [ ] Manual subscription management
  - [ ] User activity logs
  - [ ] Account suspension/activation
- [ ] **Payment Analytics** (`/admin/payments`)
  - [ ] Payment monitoring dashboard
  - [ ] Revenue tracking
  - [ ] Conversion rate analysis
  - [ ] Plan popularity metrics
  - [ ] Churn rate monitoring
  - [ ] Refund processing interface

#### International Features  
- [ ] **Multi-Currency Support**
  - [ ] USD, EUR pricing
  - [ ] Currency conversion API
  - [ ] Localized pricing display
- [ ] **Multi-Language**
  - [ ] English interface
  - [ ] Localized email templates

---

## 🛠️ TEKNİK NOTLAR

### API Endpoints
```typescript
// Payment Initiation
POST /api/paytr/initiate
Headers: X-User-ID, Content-Type: application/json
Body: { planType, billingCycle, userEmail, userName, userPhone? }
Response: { success, paymentToken, iframeUrl, orderId }

// Webhook Handler  
POST /api/paytr/webhook
Content-Type: application/x-www-form-urlencoded
Body: PayTR form data (merchant_oid, status, hash, etc.)
Response: 'OK' (200) or error status
```

### Database Schema
```sql
-- Core tables
cards (id, user_id, username, name, is_active, ...)
payments (id, user_id, order_id, amount, status, plan_type, ...)
subscriptions (id, user_id, plan_type, start_date, end_date, is_active, ...)
webhook_events (id, event_id, raw_payload, received_at)

-- Key constraints
payments.order_id UNIQUE           -- PayTR merchant_oid
subscriptions.user_id UNIQUE       -- One active subscription per user
webhook_events.event_id UNIQUE     -- Idempotency key
```

### Test Komutları
```bash
# Development server
npm run dev

# API testing
curl -X POST http://localhost:3000/api/paytr/initiate \
  -H "Content-Type: application/json" \
  -H "X-User-ID: test-user-123" \
  -d '{"planType":"personal","billingCycle":"monthly","userEmail":"test@test.com","userName":"Test User"}'

# Environment validation
node scripts/validate-env.js

# Webhook testing
node scripts/test-webhook.ts
```

---

## ⚠️ BİLİNEN SORUNLAR & ÇÖZÜMLER

### Import Path Issues ✅ ÇÖZÜLDÜ
**Sorun:** TypeScript absolute imports (`@/src/...`) çalışmıyordu  
**Çözüm:** Relative imports (`../../../../server/...`) kullanıldı

### Environment Validation ✅ ÇÖZÜLDÜ  
**Sorun:** API endpoint'leri environment variable format kontrolü yapıyordu
**Çözüm:** `validateAdminEnv()` ve `assertPayTREnv()` functions eklendi

### Database Column Issues ✅ ÇÖZÜLDÜ
**Sorun:** `is_active`, `end_date`, `plan_type` kolonları eksikti
**Çözüm:** Manuel SQL ile kolonlar eklendi, migration tamamlandı

---

## 🎯 SONRAKİ ADIMLAR

### Hemen Yapılacaklar
1. **PayTR hesabı aç** → Test credentials al
2. **Supabase Service Role Key** al → `.env.local` güncelle  
3. **End-to-end payment test** yap
4. **Webhook idempotency test** yap

### Bu Hafta İçinde
1. **Error scenarios** test et
2. **Vercel deployment** hazırlık
3. **Payment UI** improvements
4. **Email notifications** setup

### Gelecek Sprintler
1. **Admin panel** development
2. **Analytics dashboard**
3. **Advanced subscription** features

---

## 📞 DESTEK & DOKÜMANTASYON

### Önemli Linkler
- **Supabase Dashboard:** https://supabase.com/dashboard  
- **PayTR Documentation:** https://www.paytr.com/entegrasyon
- **Vercel Dashboard:** https://vercel.com/dashboard

### Faydalı Komutlar
```bash
# Build kontrolü
npm run build

# Type checking
npm run typecheck

# Lint kontrolü  
npm run lint

# Database migration (Supabase SQL Editor'da)
-- SQL dosyası: supabase/migrations/2025-08-26_paytr_complete_setup.sql
```

---

**💡 Not:** Bu dosya proje ilerledikçe güncellenecek. Her tamamlanan iş için checkbox işaretlenecek, yeni görevler eklenecek.

**🔄 Son Güncelleme:** Bu dosya her önemli değişiklikte güncellenmelidir.