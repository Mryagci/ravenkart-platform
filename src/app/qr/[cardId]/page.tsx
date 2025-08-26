'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function QRRedirectPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const cardId = params.cardId as string

  useEffect(() => {
    if (!cardId) {
      setError('Geçersiz QR kod')
      setLoading(false)
      return
    }

    handleQRRedirect()
  }, [cardId])

  async function handleQRRedirect() {
    try {
      // Analytics verisi kaydet
      await fetch('/api/qr-analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || '',
        }),
      })

      // Kart bilgisini al ve redirect URL'ini bul
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: card, error: cardError } = await supabase
        .from('cards')
        .select('qr_redirect_url, username')
        .eq('id', cardId)
        .single()

      if (cardError || !card) {
        throw new Error('Kartvizit bulunamadı')
      }

      // Redirect URL varsa oraya, yoksa kartvizit sayfasına yönlendir
      const redirectUrl = card.qr_redirect_url || `/u/${card.username}`
      
      // External URL ise window.location.href kullan
      if (card.qr_redirect_url && (card.qr_redirect_url.startsWith('http://') || card.qr_redirect_url.startsWith('https://'))) {
        window.location.href = card.qr_redirect_url
      } else {
        router.push(redirectUrl)
      }

    } catch (error) {
      console.error('QR redirect error:', error)
      setError('Yönlendirme başarısız oldu')
      setLoading(false)
      
      // 3 saniye sonra ana sayfaya yönlendir
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Yönlendiriliyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Hata</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Ana sayfaya yönlendiriliyorsunuz...</p>
        </div>
      </div>
    )
  }

  return null
}