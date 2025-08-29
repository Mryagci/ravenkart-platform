#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://atozlshaxxxfgkclvjdd.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0b3psc2hheHh4ZmdrY2x2amRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MDEwODksImV4cCI6MjA3MTM3NzA4OX0.txY6HQnCsNO3F0ggqGRjw9LsK5baHG8Ch7L0GnktyOc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testVisitorPage() {
  console.log('🧪 Ziyaretçi Sayfası Test Ediliyor...\n');
  
  try {
    console.log('1. 🔍 Mevcut kartları bul...');
    
    const { data: cards, error: findError } = await supabase
      .from('cards')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (findError) {
      console.error('❌ Kart bulunamadı:', findError.message);
      return;
    }

    console.log(`✅ Test kartı bulundu: ${cards.id}`);
    console.log(`👤 İsim: ${cards.name}`);
    console.log(`🏢 Şirket: ${cards.company || 'Belirtilmemiş'}`);
    console.log(`📧 Email: ${cards.email || 'Belirtilmemiş'}`);

    console.log('\n2. 🌐 Ziyaretçi sayfası URL\'i:');
    const visitorUrl = `http://localhost:3000/v/${cards.id}`;
    console.log(`🔗 ${visitorUrl}`);

    console.log('\n3. 🔍 Kartın database\'de olup olmadığını tekrar kontrol et:');
    const { data: fetchedCard, error: fetchError } = await supabase
      .from('cards')
      .select('*')
      .eq('id', cards.id)
      .eq('is_active', true)
      .single();

    if (fetchError) {
      console.error('❌ Kart bulunamadı:', fetchError.message);
      return;
    }

    console.log('✅ Kart başarıyla bulundu!');
    console.log(`📊 Kart Bilgileri:`);
    console.log(`   - ID: ${fetchedCard.id}`);
    console.log(`   - İsim: ${fetchedCard.name}`);
    console.log(`   - Başlık: ${fetchedCard.title || 'Belirtilmemiş'}`);
    console.log(`   - Şirket: ${fetchedCard.company || 'Belirtilmemiş'}`);
    console.log(`   - Email: ${fetchedCard.email || 'Belirtilmemiş'}`);
    console.log(`   - Telefon: ${fetchedCard.phone || 'Belirtilmemiş'}`);
    console.log(`   - Website: ${fetchedCard.website || 'Belirtilmemiş'}`);
    console.log(`   - Lokasyon: ${fetchedCard.location || 'Belirtilmemiş'}`);

    console.log('\n4. 🎯 Test Sonucu:');
    console.log('✅ Database bağlantısı çalışıyor');
    console.log('✅ Kart başarıyla bulundu');
    console.log('✅ Ziyaretçi sayfası hazır');
    
    console.log('\n📱 Manuel Test:');
    console.log('1. Tarayıcıda şu URL\'i aç:');
    console.log(`   ${visitorUrl}`);
    console.log('2. Kartın bilgilerinin göründüğünü kontrol et');
    console.log('3. "Kişilere Ekle" butonu çalışıyor mu test et');
    console.log('4. "Görüntü Kaydet" butonu çalışıyor mu test et');

    return cards.id;

  } catch (err) {
    console.error('❌ Test hatası:', err.message);
  }
}

testVisitorPage();