#!/usr/bin/env node

console.log('🔍 QR KOD URL DEBUG\n');

// Test different URL formats
const testCardId = '76a36303-10ec-45b6-b82f-3498f9a708e0';

console.log('📱 **Farklı URL Formatları:**\n');

console.log('1. 🔴 **Mevcut Format:**');
console.log(`   URL: https://www.ravenkart.com/ziyaretci/${testCardId}`);
console.log('   Problem: QR okuyucular bunu Google\'da arıyor\n');

console.log('2. 🟡 **Localhost Test:**');
console.log(`   URL: http://localhost:3000/ziyaretci/${testCardId}`);
console.log('   Test edilecek: Local URL direkt açılıyor mu?\n');

console.log('3. 🟢 **Production URL (Tam Format):**');
console.log(`   URL: https://ravenkart.com/ziyaretci/${testCardId}`);
console.log('   Not: www. olmadan daha iyi tanınabilir\n');

console.log('📊 **QR Kod Tanıma Kriterleri:**');
console.log('   ✅ URL http:// veya https:// ile başlamalı');
console.log('   ✅ Geçerli domain olmalı');
console.log('   ✅ Özel karakterler encode olmamalı');
console.log('   ✅ URL uzunluğu makul olmalı\n');

console.log('🧪 **Test Senaryoları:**\n');

console.log('**Senaryo 1: Environment Variable Kontrolü**');
console.log('   - NEXT_PUBLIC_APP_URL değerini kontrol et');
console.log('   - QR kodda hangi URL var görmek için\n');

console.log('**Senaryo 2: QR Kod İçeriğini Decode Et**');
console.log('   - Mevcut QR kodu QR reader ile oku');
console.log('   - İçindeki tam URL\'i görmek için\n');

console.log('**Senaryo 3: Farklı URL Formatlarını Test Et**');
console.log('   - www.ravenkart.com vs ravenkart.com');
console.log('   - Hangi format daha iyi tanınıyor?\n');

console.log('🎯 **Beklenen Davranış:**');
console.log('   ✅ QR okuyunca "Bu siteyi aç" seçeneği çıkmalı');
console.log('   ✅ Google arama yapmadan direkt siteye gitmeli');
console.log('   ✅ Mobil tarayıcıda kartvizit sayfası açılmalı');

console.log('\n📲 **Sonraki Adım: QR kod içeriğini debug edelim**');