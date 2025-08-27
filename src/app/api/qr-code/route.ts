import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { cardId, cardData, userId } = await request.json();
    
    if (!cardId || !cardData || !userId) {
      return NextResponse.json(
        { error: 'Card ID, data and user ID are required' },
        { status: 400 }
      );
    }

    // Supabase admin client oluştur - RLS bypass için
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        db: {
          schema: 'public',
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    console.log('Using user ID:', userId);

    // Kartvizit bilgilerini veritabanına kaydet - frontend'den gelen user ID ile
    const cardRecord = {
      user_id: userId,
      username: cardData.username,
      name: cardData.name,
      is_active: true,
      updated_at: new Date().toISOString()
    };
    
    console.log('Card record to insert:', cardRecord);

    // Opsiyonel alanları ekle (sadece dolu olanları)
    if (cardData.title) cardRecord.title = cardData.title;
    if (cardData.company) cardRecord.company = cardData.company;
    if (cardData.email) cardRecord.email = cardData.email;
    if (cardData.phone) cardRecord.phone = cardData.phone;
    if (cardData.website) cardRecord.website = cardData.website;
    if (cardData.location) cardRecord.location = cardData.location;
    if (cardData.iban) cardRecord.iban = cardData.iban;
    if (cardData.projects) cardRecord.projects = cardData.projects;

    const { data: insertedCard, error: insertError } = await supabase
      .from('cards')
      .insert(cardRecord)
      .select()
      .single();

    if (insertError) {
      console.error('Database error:', insertError);
      console.error('Card record that failed:', cardRecord);
      return NextResponse.json(
        { error: `Failed to save card data: ${insertError.message}` },
        { status: 500 }
      );
    }
    
    console.log('Successfully inserted card:', insertedCard);

    // QR kod URL'ini oluştur - database'den dönen ID ile
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const qrUrl = `${baseUrl}/v/${insertedCard.id}`;

    // QR kodu oluştur
    const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    });

    return NextResponse.json({
      success: true,
      qrCodeUrl: qrUrl,
      qrCodeData: qrCodeDataUrl,
      cardId: insertedCard.id
    });

  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}