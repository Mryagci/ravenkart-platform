import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cardId, userAgent, timestamp, referrer } = body

    if (!cardId) {
      return NextResponse.json(
        { error: 'cardId gerekli' },
        { status: 400 }
      )
    }

    // IP adresini al
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

    // Analytics verisini kaydet
    const { error } = await supabase
      .from('qr_analytics')
      .insert({
        card_id: cardId,
        scanned_at: timestamp,
        ip_address: ip,
        user_agent: userAgent,
        referrer: referrer || null,
      })

    if (error) {
      console.error('Analytics kayıt hatası:', error)
      // Analytics hatası QR yönlendirmesini engellemsin, sessizce devam et
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('QR analytics error:', error)
    // Analytics hatası olsa bile QR yönlendirmesi çalışsın
    return NextResponse.json({ success: true })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cardId = searchParams.get('cardId')

    if (!cardId) {
      return NextResponse.json(
        { error: 'cardId gerekli' },
        { status: 400 }
      )
    }

    // Analytics verilerini getir
    const { data, error } = await supabase
      .from('qr_analytics')
      .select('*')
      .eq('card_id', cardId)
      .order('scanned_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Analytics verileri alınamadı' },
        { status: 500 }
      )
    }

    // Temel istatistikleri hesapla
    const totalScans = data.length
    const today = new Date().toISOString().split('T')[0]
    const todayScans = data.filter(scan => 
      scan.scanned_at.split('T')[0] === today
    ).length

    // Son 7 günlük veri
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentScans = data.filter(scan => 
      new Date(scan.scanned_at) >= sevenDaysAgo
    )

    return NextResponse.json({
      totalScans,
      todayScans,
      recentScans: recentScans.length,
      scans: data.slice(0, 100) // Son 100 tarama
    })

  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}