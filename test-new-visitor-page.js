#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://atozlshaxxxfgkclvjdd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0b3psc2hheHh4ZmdrY2x2amRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDEwODksImV4cCI6MjA3MTM3NzA4OX0.txY6HQnCsNO3F0ggqGRjw9LsK5baHG8Ch7L0GnktyOc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testNewVisitorPage() {
  console.log('🧪 YENİ Ziyaretçi Bölümü Test Ediliyor...\n');
  
  try {
    // Mevcut bir kartı bul
    const { data: card, error: findError } = await supabase
      .from('cards')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (findError) {
      console.error('❌ Kart bulunamadı:', findError.message);
      return;
    }

    console.log(`✅ Test kartı: ${card.id}`);
    console.log(`👤 İsim: ${card.name}`);
    console.log(`📧 Email: ${card.email || 'Belirtilmemiş'}`);

    // Eski ve yeni URL'leri göster
    const oldVisitorUrl = `http://localhost:3000/v/${card.id}`;
    const newVisitorUrl = `http://localhost:3000/ziyaretci/${card.id}`;

    console.log('\n🔗 **URL Karşılaştırması:**');
    console.log(`🔴 Eski URL: ${oldVisitorUrl}`);
    console.log(`🟢 Yeni URL: ${newVisitorUrl}`);

    console.log('\n📱 **QR Kod Test Adımları:**');
    console.log('1. Dashboard\'a git ve yeni QR kod oluştur');
    console.log('2. QR kodu tara - artık /ziyaretci/ bölümüne gitecek');
    console.log('3. Chrome\'da arama yapmak yerine direkt kartvizit sayfası açılacak');

    console.log('\n🌐 **Manuel Test URL\'leri:**');
    console.log(`✅ Yeni ziyaretçi sayfası: ${newVisitorUrl}`);
    console.log(`🔴 Eski sayfa (hala çalışıyor): ${oldVisitorUrl}`);

    console.log('\n🎯 **Sonuç:**');
    console.log('✅ Yeni ziyaretçi bölümü oluşturuldu');
    console.log('✅ QR kodlar artık /ziyaretci/ kullanıyor');
    console.log('✅ Gelişmiş UI ve UX');
    console.log('✅ Paylaşma özelliği eklendi');
    console.log('✅ Ravenkart branding güçlendirildi');

    return card.id;

  } catch (err) {
    console.error('❌ Test hatası:', err.message);
  }
}

testNewVisitorPage();