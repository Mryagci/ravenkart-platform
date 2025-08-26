# Paytr Ödeme Altyapısı Kurulum Kılavuzu

## 1. Supabase Veritabanı Kurulumu

### Adım 1: Cards Tablosunu Oluşturun
Supabase SQL Editor'da `supabase-full-migration.sql` dosyasını çalıştırın.

### Adım 2: Ödeme Tablolarını Oluşturun  
Supabase SQL Editor'da `paytr-tables.sql` dosyasını çalıştırın.

## 2. Paytr Hesap Kurulumu

1. **Paytr'a kaydolun:** https://www.paytr.com/
2. **Test hesabı oluşturun** (ücretsiz)
3. **API bilgilerinizi alın:**
   - Merchant ID
   - Merchant Key
   - Merchant Salt

## 3. Environment Variables Yapılandırması

`.env.local` dosyasını güncelleyin:

```env
# Paytr Configuration
PAYTR_MERCHANT_ID=your_actual_merchant_id
PAYTR_MERCHANT_KEY=your_actual_merchant_key
PAYTR_MERCHANT_SALT=your_actual_merchant_salt
PAYTR_TEST_MODE=true

# Supabase Service Role Key (ödeme API'leri için gerekli)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 4. Paytr Panel Ayarları

1. Paytr panelinde **"Entegrasyon"** bölümüne gidin
2. **Callback URL** ayarını yapın:
   - Test: `http://localhost:3000/api/payment/callback`
   - Canlı: `https://yourdomain.com/api/payment/callback`

3. **Başarı/Hata URL'leri:**
   - Başarı: `https://yourdomain.com/payment/success`
   - Hata: `https://yourdomain.com/payment/failure`

## 5. Test Kartları

Paytr test modunda kullanabileceğiniz kartlar:

### Başarılı Test Kartları:
- **Visa:** 4355 0841 0000 0001
- **MasterCard:** 5406 6701 0000 0004
- **CVV:** 123
- **Son Kullanma:** Gelecek tarih (örn: 12/25)

### Başarısız Test Kartları:
- **Yetersiz Bakiye:** 4025 0000 0000 0006
- **Kart Blokeli:** 4531 4442 0000 0007

## 6. Test Etme

1. Fiyatlandırma sayfasına gidin
2. Bir plan seçin
3. Test kartı ile ödeme yapın
4. Başarı/başarısızlık sayfalarını kontrol edin

## 7. Canlıya Geçiş

1. Paytr'dan canlı hesap onayı alın
2. `PAYTR_TEST_MODE=false` yapın
3. Gerçek domain'i callback URL'lerinde güncelleyin
4. SSL sertifikası olduğundan emin olun

## 8. Güvenlik Notları

- **ASLA** production'da test kartları kullanmayın
- Callback endpoint'ini **IP kısıtlaması** ile koruyun
- **Hash doğrulama** her zaman yapılmalı
- **Webhook güvenliği** için Paytr IP'lerini whitelist'e ekleyin

## 9. Sorun Giderme

### Yaygın Hatalar:

**"Hash verification failed"**
- Merchant Key veya Salt yanlış
- Hash hesaplama sırası hatalı

**"Payment not found"** 
- Order ID eşleşmiyor
- Veritabanı bağlantı sorunu

**"Invalid merchant"**
- Merchant ID yanlış
- Test modunda canlı bilgiler kullanılıyor

### Log Kontrolü:
```bash
# Development
npm run dev

# Callback logları için:
tail -f /var/log/nginx/access.log | grep callback
```

## 10. Destek

- **Paytr Destek:** destek@paytr.com
- **API Dokümantasyon:** https://www.paytr.com/entegrasyon
- **Test Panel:** https://test.paytr.com/

---

## Dosya Yapısı

```
src/
├── app/
│   ├── api/
│   │   └── payment/
│   │       ├── create-order/route.ts
│   │       └── callback/route.ts
│   ├── payment/
│   │   ├── success/page.tsx
│   │   └── failure/page.tsx
│   └── pricing/page.tsx
├── supabase-full-migration.sql
└── paytr-tables.sql
```

Tüm dosyalar hazır! Kurulumu tamamladıktan sonra sistem tamamen çalışır durumda olacak.