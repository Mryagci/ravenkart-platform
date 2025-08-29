#!/usr/bin/env node

console.log('🌐 QR Kod Domain Test Edilecek...\n');

console.log('✅ **Yapılan Değişiklikler:**\n');

console.log('1. **QR Kodlar Artık Ravenkart Domain\'ini Kullanıyor:**');
console.log('   - ❌ Vercel URL: https://your-app.vercel.app/v/cardId');
console.log('   - ✅ Ravenkart URL: http://www.ravenkart.com/v/cardId\n');

console.log('2. **Environment Variable Kullanımı:**');
console.log('   - NEXT_PUBLIC_APP_URL="http://www.ravenkart.com"');
console.log('   - Production\'da otomatik olarak bu URL kullanılıyor\n');

console.log('3. **Güncellenen Fonksiyonlar:**');
console.log('   - ✅ create-card QR oluşturma');
console.log('   - ✅ dashboard QR görüntüleme'); 
console.log('   - ✅ QR utils helper fonksiyonları\n');

console.log('🧪 **Test Adımları:**\n');

console.log('**1. Yeni Kartvizit Oluştur:**');
console.log('   - http://localhost:3000/create-card\'a git');
console.log('   - Kartvizit bilgilerini doldur');
console.log('   - "Kaydet" butonuna tıkla');
console.log('   - Console\'da göreceksin:\n');
console.log('     🔗 QR kod oluşturuluyor...');
console.log('     ✅ QR kod oluşturuldu');
console.log('     🌐 Visitor URL: http://www.ravenkart.com/v/[CARD-ID]\n');

console.log('**2. Dashboard\'da QR Kontrol:**');
console.log('   - http://localhost:3000/dashboard\'a git');
console.log('   - QR kodunu sağ tık > "Resmi Farklı Kaydet"');
console.log('   - QR kod reader ile tara');
console.log('   - URL\'in www.ravenkart.com olduğunu gör\n');

console.log('**3. Production\'da Test:**');
console.log('   - Vercel\'de deploy et');
console.log('   - Yeni kartvizit oluştur');
console.log('   - QR kodun www.ravenkart.com\'a yönlendirdiğini kontrol et\n');

console.log('🔧 **Vercel Environment Variables Ayarla:**\n');
console.log('1. Vercel Dashboard\'a git');
console.log('2. Project Settings > Environment Variables');
console.log('3. Ekle:');
console.log('   - Name: NEXT_PUBLIC_APP_URL');
console.log('   - Value: https://www.ravenkart.com');
console.log('4. Redeploy yap\n');

console.log('🎯 **Sonuç:**');
console.log('   ✅ QR kodlar artık Ravenkart sitesinde kalıyor');
console.log('   ✅ Ziyaretçiler başka siteye yönlendirilmiyor');
console.log('   ✅ Professional görünüm');

console.log('\n🚀 **Test et ve push et!**');