#!/usr/bin/env node

/**
 * Analytics sistemi için test verisi oluşturur
 * Test kartları ve QR taramalarını simüle eder
 */

const BASE_URL = 'http://localhost:3000';

async function createTestAnalyticsData() {
  console.log('📊 Analitik Test Verisi Oluşturuluyor...\n');

  // Test verisi - farklı cihaz ve zamanlardan taramalar
  const testScans = [
    // Bugün
    { cardId: 'test-card-123', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)', timestamp: new Date().toISOString() },
    { cardId: 'test-card-123', userAgent: 'Mozilla/5.0 (Android 11; Mobile; rv:68.0)', timestamp: new Date().toISOString() },
    { cardId: 'test-card-123', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', timestamp: new Date().toISOString() },
    
    // Dün
    { cardId: 'test-card-123', userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X)', timestamp: new Date(Date.now() - 24*60*60*1000).toISOString() },
    { cardId: 'test-card-123', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', timestamp: new Date(Date.now() - 24*60*60*1000).toISOString() },
    { cardId: 'test-card-123', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', timestamp: new Date(Date.now() - 24*60*60*1000).toISOString() },
    
    // Bu hafta
    { cardId: 'test-card-123', userAgent: 'Mozilla/5.0 (Android 12; Mobile; rv:90.0)', timestamp: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
    { cardId: 'test-card-123', userAgent: 'Mozilla/5.0 (Windows NT 11.0; Win64; x64)', timestamp: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
    
    // Geçen hafta
    { cardId: 'test-card-123', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)', timestamp: new Date(Date.now() - 10*24*60*60*1000).toISOString() },
    { cardId: 'test-card-123', userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)', timestamp: new Date(Date.now() - 12*24*60*60*1000).toISOString() },
    { cardId: 'test-card-123', userAgent: 'Mozilla/5.0 (Android 13; Tablet; rv:95.0)', timestamp: new Date(Date.now() - 15*24*60*60*1000).toISOString() }
  ];

  console.log(`🔧 ${testScans.length} test taramasi gönderiliyor...`);

  let successCount = 0;
  let errorCount = 0;

  // Her test taramasını gönder
  for (const scan of testScans) {
    try {
      const response = await fetch(`${BASE_URL}/api/qr-analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scan)
      });

      if (response.ok) {
        successCount++;
        console.log(`✅ Tarama kaydedildi: ${scan.userAgent.includes('iPhone') ? '📱 iPhone' : 
                                             scan.userAgent.includes('Android') ? '📱 Android' : 
                                             scan.userAgent.includes('iPad') ? '📱 iPad' : '💻 Masaüstü'}`);
      } else {
        errorCount++;
        console.log(`❌ Tarama kaydedilemedi: ${response.status}`);
      }
    } catch (error) {
      errorCount++;
      console.log(`❌ Hata: ${error.message}`);
    }

    // API'yi overload etmemek için kısa bekleme
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n📈 Test Sonucu:`);
  console.log(`   ✅ Başarılı: ${successCount}`);
  console.log(`   ❌ Hatalı: ${errorCount}`);

  // Şimdi analytics verilerini test et
  console.log(`\n🔍 Analytics API test ediliyor...`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/qr-analytics?cardId=test-card-123`);
    
    if (response.ok) {
      const data = await response.json();
      
      console.log(`\n📊 Analytics Verileri:`);
      console.log(`   📈 Toplam Tarama: ${data.totalScans}`);
      console.log(`   🆕 Bugünkü Tarama: ${data.todayScans}`);
      console.log(`   👥 Eşsiz Ziyaretçi: ${data.uniqueVisitors}`);
      console.log(`   📱 Cihaz Dağılımı:`);
      Object.entries(data.deviceStats || {}).forEach(([device, count]) => {
        console.log(`      ${device}: ${count}`);
      });
      
    } else {
      console.log(`❌ Analytics API hatası: ${response.status}`);
    }
    
  } catch (error) {
    console.log(`❌ Analytics test hatası: ${error.message}`);
  }

  console.log(`\n🎉 Test tamamlandı!`);
  console.log(`\n📋 Kullanım:`)
  console.log(`   1. http://localhost:3000/dashboard sayfasına git`);
  console.log(`   2. "Detaylı Analitik" butonuna tıkla`);
  console.log(`   3. Test kartını seç (eğer yoksa önce create-card'da kart oluştur)`);
  console.log(`   4. Analitik verilerini görüntüle!`);
  console.log(`\n🚀 Analitik sistemi hazır!`);
}

// Testi çalıştır
createTestAnalyticsData().catch(console.error);