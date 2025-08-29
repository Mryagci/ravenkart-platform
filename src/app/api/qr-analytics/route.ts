import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase client will be created inside functions

export async function POST(request: NextRequest) {
  try {
    // Supabase client oluştur
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
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
    // Supabase client oluştur
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
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

    // Detaylı istatistikleri hesapla
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

    // Son 30 günlük veri
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const monthlyScans = data.filter(scan => 
      new Date(scan.scanned_at) >= thirtyDaysAgo
    )

    // Günlük istatistikler (son 30 gün)
    const dailyStats = {}
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      dailyStats[dateStr] = data.filter(scan => 
        scan.scanned_at.split('T')[0] === dateStr
      ).length
    }

    // Cihaz analizi (User Agent'tan)
    const deviceStats = {}
    data.forEach(scan => {
      if (!scan.user_agent) return
      const ua = scan.user_agent.toLowerCase()
      let device = 'Bilinmeyen'
      
      if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
        device = 'Mobil'
      } else if (ua.includes('tablet') || ua.includes('ipad')) {
        device = 'Tablet'
      } else {
        device = 'Masaüstü'
      }
      
      deviceStats[device] = (deviceStats[device] || 0) + 1
    })

    // Saatlik dağılım
    const hourlyStats = {}
    for (let h = 0; h < 24; h++) {
      hourlyStats[h] = 0
    }
    data.forEach(scan => {
      if (scan.scanned_at) {
        const hour = new Date(scan.scanned_at).getHours()
        hourlyStats[hour] = (hourlyStats[hour] || 0) + 1
      }
    })

    // Haftalık dağılım
    const weeklyStats = {}
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
    dayNames.forEach(day => weeklyStats[day] = 0)
    
    data.forEach(scan => {
      if (scan.scanned_at) {
        const dayName = dayNames[new Date(scan.scanned_at).getDay()]
        weeklyStats[dayName] = (weeklyStats[dayName] || 0) + 1
      }
    })

    // Eşsiz ziyaretçi sayısı (IP bazlı yaklaşık)
    const uniqueIPs = new Set(data.map(scan => scan.ip_address)).size

    return NextResponse.json({
      totalScans,
      todayScans,
      recentScans: recentScans.length,
      monthlyScans: monthlyScans.length,
      uniqueVisitors: uniqueIPs,
      dailyStats,
      deviceStats,
      hourlyStats,
      weeklyStats,
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