import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { cardId, cardData } = await request.json();
    
    if (!cardId || !cardData) {
      return NextResponse.json(
        { error: 'Card ID and data are required' },
        { status: 400 }
      );
    }

    // Supabase client oluştur
    const supabase = createRouteHandlerClient({ cookies });

    // QR kod URL'ini oluştur
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const qrUrl = `${baseUrl}/v/${cardId}`;

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

    // Kartvizit bilgilerini veritabanına kaydet
    const { error: insertError } = await supabase
      .from('cards')
      .upsert({
        id: cardId,
        user_id: cardData.user_id,
        username: cardData.username,
        name: cardData.name,
        title: cardData.title,
        company: cardData.company,
        email: cardData.email,
        phone: cardData.phone,
        website: cardData.website,
        linkedin: cardData.linkedin,
        instagram: cardData.instagram,
        twitter: cardData.twitter,
        description: cardData.description,
        qr_code_url: qrUrl,
        qr_code_data: qrCodeDataUrl,
        is_active: true,
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Database error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save card data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      qrCodeUrl: qrUrl,
      qrCodeData: qrCodeDataUrl
    });

  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}