# Google Cloud Vision API Kurulum Rehberi

## 🚀 Hızlı Başlangıç (5 Dakika)

### Adım 1: Google Cloud Console'a Git
1. [Google Cloud Console](https://console.cloud.google.com/) açın
2. Google hesabınızla giriş yapın
3. Yeni bir proje oluşturun: "Ravenkart-OCR" 

### Adım 2: Vision API'yi Etkinleştir
1. **API & Services > Library** bölümüne git
2. "Cloud Vision API" ara ve seç
3. **"Enable"** butonuna tıkla
4. ✅ Vision API aktif oldu!

### Adım 3: Service Account Oluştur
1. **IAM & Admin > Service Accounts** git
2. **"Create Service Account"** tıkla
3. İsim: `ravenkart-ocr-service`
4. Role: **"Cloud Vision API User"** seç
5. **"Create"** tıkla

### Adım 4: API Key Oluştur
1. Oluşturulan service account'a tıkla
2. **"Keys"** tab'ine git
3. **"Add Key > Create new key"** 
4. **JSON** formatını seç
5. **"Create"** - dosya indirilecek

### Adım 5: Credentials Ekle
İndirilen JSON dosyasını aç ve içeriği kopyala:

```bash
# .env.local dosyasına şunu ekle:
GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account","project_id":"ravenkart-ocr-123456",...tüm JSON içeriği...}'
```

## 💰 Fiyatlandırma

### ✅ **Ücretsiz Limitler:**
- İlk **1,000 OCR işlemi/ay** tamamen **ÜCRETSİZ**
- Her yeni Google hesabı için $300 kredi

### 💵 **Ücretli Limitler:**
- 1,001+ işlem: **$1.50/1000 işlem** (~₺45/1000 kart)
- Aylık 1000 kartvizit = **₺0**
- Aylık 5000 kartvizit = **₺180**

## 🔧 Test Etmek İçin

1. Credentials'ları ekleyin
2. Sunucuyu yeniden başlatın: `npm run dev`
3. http://localhost:3000/apps/card-scanner sayfasını açın
4. Kamera ile kartvizit fotoğrafı çekin
5. **"OCR ile Doldur"** butonuna tıklayın

## ⚠️ Güvenlik Notları

- JSON credentials'ları asla Git'e commit etmeyin
- Production'da environment variables kullanın
- API key'leri düzenli olarak rotate edin

## 🆘 Sorun Giderme

### "Credentials not configured"
- `.env.local` dosyasındaki JSON formatını kontrol edin
- Tüm JSON'u tek satırda, tek tırnak içinde yazın

### "API not enabled" 
- Google Cloud Console'da Vision API'nin etkin olduğunu kontrol edin

### "Permission denied"
- Service Account'un "Cloud Vision API User" rolü olduğunu kontrol edin

## 📞 Destek

Kurulum sırasında sorun yaşarsanız:
1. Hata mesajını kopyalayın
2. Google Cloud Console'daki ayarları kontrol edin
3. Credentials JSON formatını doğrulayın