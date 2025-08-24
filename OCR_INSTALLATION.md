# Gerçek OCR Kurulumu (Tesseract.js)

Şu anda card scanner template görüntüler kullanıyor. Gerçek OCR için:

## 1. Tesseract.js Kurulumu
```bash
npm install tesseract.js
```

## 2. OCR Fonksiyonunu Güncelleyin
`src/app/apps/card-scanner/page.tsx` dosyasında:

```javascript
const extractTextFromImage = async (imageData: string): Promise<Partial<ScannedCard>> => {
  return new Promise(async (resolve) => {
    try {
      setScanResult('Görüntü analiz ediliyor...')
      
      // Tesseract.js OCR
      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker('tur+eng') // Turkish + English
      
      setScanResult('Metin çıkarılıyor...')
      const { data: { text } } = await worker.recognize(imageData)
      await worker.terminate()
      
      setScanResult('Bilgiler ayrıştırılıyor...')
      const extractedData = parseBusinessCardText(text)
      
      resolve(extractedData)
    } catch (error) {
      console.error('OCR Error:', error)
      resolve({
        name: 'Manuel Giriş Gerekli',
        title: '',
        company: '',
        email: '',
        phone: '',
        website: ''
      })
    }
  })
}
```

## 3. Performans Optimizasyonu
- Worker'ı component seviyesinde cache edin
- Görüntüyü yeniden boyutlandırın (max 800px genişlik)
- Kontrast ve parlaklığı artırın

## 4. Alternatif OCR Servisleri
- Google Cloud Vision API
- Azure Computer Vision
- AWS Textract
- Tesseract API (server-side)

## Şu Anki Durum
OCR şimdilik template gösteriyor. Kullanıcı:
1. Kartvizit tarar
2. Template bilgileri görür  
3. Gerçek bilgileri manuel girer
4. Kaydet butonuna basar
5. Supabase'e kaydedilir