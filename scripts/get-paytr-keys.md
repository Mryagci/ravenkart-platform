# PayTR Test Credentials Alma Rehberi

## 1. PayTR'ye Kayıt Ol
- https://www.paytr.com/
- "Ücretsiz Hesap Aç" butonuna tıkla

## 2. Test Hesabı Oluştur
- Email ile kayıt ol
- Email doğrulama yap
- Dashboard'a giriş yap

## 3. API Bilgilerini Al
- Dashboard'da "Entegrasyon" > "API Bilgileri" seç
- Şu bilgileri kopyala:
  - **Merchant ID** (örn: 123456)
  - **Merchant Key** (örn: ABC123DEF456)
  - **Merchant Salt** (örn: XYZ789UVW)

## 4. .env.local'e Ekle
```env
PAYTR_MERCHANT_ID=123456
PAYTR_MERCHANT_KEY=ABC123DEF456GHI789
PAYTR_MERCHANT_SALT=XYZ789UVW012PQR
PAYTR_TEST_MODE=true
```

## 5. Callback URL Setup
PayTR Dashboard'da:
- "Entegrasyon" > "Callback Ayarları"
- **Callback URL:** `http://localhost:3000/api/paytr/webhook`
- **Success URL:** `http://localhost:3000/payment/success`  
- **Fail URL:** `http://localhost:3000/payment/failure`

## 6. Test Kartları (PayTR Sandbox)
### Başarılı Test
- **Kart:** 4355 0841 0000 0001
- **CVV:** 123
- **Tarih:** 12/25

### Başarısız Test  
- **Kart:** 4025 0000 0000 0006
- **CVV:** 123
- **Tarih:** 12/25