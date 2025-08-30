import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { deleteLogo } from '../../../lib/storage-utils'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(request: NextRequest) {
  try {
    const { cardId, userId } = await request.json()

    if (!cardId || !userId) {
      return NextResponse.json(
        { error: 'Card ID ve User ID gerekli' },
        { status: 400 }
      )
    }

    console.log('🗑️ Kart siliniyor:', cardId)

    // Önce kartın detaylarını al (logo URL'i için)
    const { data: card, error: fetchError } = await supabase
      .from('cards')
      .select('logo_url')
      .eq('id', cardId)
      .eq('user_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Kart fetch hatası:', fetchError)
      return NextResponse.json(
        { error: 'Kart bilgileri alınamadı' },
        { status: 500 }
      )
    }

    // Eğer logo varsa, Storage'dan sil
    if (card?.logo_url) {
      try {
        await deleteLogo(card.logo_url, userId)
        console.log('✅ Logo dosyası silindi')
      } catch (logoError) {
        console.error('Logo silme hatası:', logoError)
        // Logo silme hatası kritik değil, devam et
      }
    }

    // Kartı veritabanından sil (soft delete)
    const { error: deleteError } = await supabase
      .from('cards')
      .update({ is_active: false })
      .eq('id', cardId)
      .eq('user_id', userId)

    if (deleteError) {
      console.error('Kart silme hatası:', deleteError)
      return NextResponse.json(
        { error: 'Kart silinemedi' },
        { status: 500 }
      )
    }

    console.log('✅ Kart başarıyla silindi:', cardId)

    return NextResponse.json({ 
      success: true,
      message: 'Kart ve logo dosyası silindi'
    })

  } catch (error) {
    console.error('Kart silme API hatası:', error)
    return NextResponse.json(
      { error: 'Beklenmeyen hata oluştu' },
      { status: 500 }
    )
  }
}