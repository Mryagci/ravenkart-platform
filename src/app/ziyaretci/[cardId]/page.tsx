'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { ExternalLink, Mail, Phone, Globe, MapPin, UserPlus, Download, Home, Share2 } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface BusinessCard {
  id: string
  name: string
  title?: string
  company?: string
  email?: string
  phone?: string
  website?: string
  location?: string
  projects?: any[]
  created_at: string
  user_id: string
  is_active: boolean
}

export default function ZiyaretciKartvizitSayfasi() {
  const params = useParams()
  const cardId = params.cardId as string
  const [card, setCard] = useState<BusinessCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (cardId) {
      fetchCard()
      trackVisit()
    }
  }, [cardId])

  const fetchCard = async () => {
    try {
      setLoading(true)
      console.log('🔍 Ziyaretçi kartvizit aranıyor:', cardId)
      
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', cardId)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Card fetch error:', error)
        
        if (error.code === 'PGRST116') {
          setError('Bu kartvizit bulunamadı veya aktif değil.')
        } else {
          setError(`Kartvizit yüklenirken hata oluştu.`)
        }
        return
      }

      if (!data) {
        setError('Kartvizit verisi bulunamadı')
        return
      }

      console.log('✅ Ziyaretçi kartvizit bulundu:', data.name)
      setCard(data)
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Kartvizit yüklenirken beklenmeyen hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const trackVisit = async () => {
    try {
      await fetch('/api/qr-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: cardId,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || null,
          visitType: 'qr_scan' // Ziyaretçi sayfası için özel etiket
        })
      })
    } catch (error) {
      console.log('Analytics tracking failed:', error)
    }
  }

  const addToContacts = () => {
    if (!card) return

    const { downloadVCF } = require('../../../lib/vcf-utils')
    
    downloadVCF({
      name: card.name,
      company: card.company || '',
      title: card.title || '',
      phone: card.phone || '',
      email: card.email || '',
      website: card.website || '',
      location: card.location || ''
    })
  }

  const saveScreenshot = async () => {
    if (!card) return
    
    try {
      const html2canvas = (await import('html2canvas')).default
      const element = document.querySelector('.visitor-card-container')
      
      if (element) {
        const canvas = await html2canvas(element as HTMLElement, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
        })
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${card.name.replace(/\s+/g, '-').toLowerCase()}-kartvizit.png`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }
        })
      }
    } catch (error) {
      console.error('Screenshot alınamadı:', error)
      alert('Görüntü kaydedilemedi')
    }
  }

  const shareCard = async () => {
    const url = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card?.name} - Dijital Kartvizit`,
          text: `${card?.name} adlı kişinin dijital kartvizitini görüntüleyin`,
          url: url,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url)
        alert('Link kopyalandı!')
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url)
      alert('Kartvizit linki kopyalandı!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Kartvizit yükleniyor...</p>
          <p className="text-gray-400 text-sm mt-2">Ravenkart Ziyaretçi Merkezi</p>
        </div>
      </div>
    )
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Kartvizit Bulunamadı</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button onClick={() => window.location.href = '/'} className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Ravenkart Ana Sayfa
            </Button>
            <p className="text-xs text-gray-400">Ravenkart Ziyaretçi Merkezi</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <span className="text-gray-700 font-medium">Ravenkart</span>
          </div>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Ziyaretçi</span>
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-md mx-auto px-4">
          <Card className="shadow-xl visitor-card-container overflow-hidden">
            <CardContent className="p-0">
              {/* Card Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white text-center">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 backdrop-blur-sm">
                  {card.name.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-2xl font-bold mb-1">{card.name}</h1>
                {card.title && <p className="text-blue-100 text-lg">{card.title}</p>}
                {card.company && <p className="text-blue-200 text-sm">{card.company}</p>}
              </div>

              {/* Contact Information */}
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  {card.email && (
                    <motion.a
                      href={`mailto:${card.email}`}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
                    >
                      <Mail className="w-5 h-5 mr-3 text-blue-600" />
                      <span className="text-gray-800 font-medium">{card.email}</span>
                    </motion.a>
                  )}
                  
                  {card.phone && (
                    <motion.a
                      href={`tel:${card.phone}`}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors border border-green-100"
                    >
                      <Phone className="w-5 h-5 mr-3 text-green-600" />
                      <span className="text-gray-800 font-medium">{card.phone}</span>
                    </motion.a>
                  )}
                  
                  {card.website && (
                    <motion.a
                      href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors border border-purple-100"
                    >
                      <Globe className="w-5 h-5 mr-3 text-purple-600" />
                      <span className="text-gray-800 font-medium flex-1 truncate">{card.website}</span>
                      <ExternalLink className="w-4 h-4 ml-2 text-gray-400" />
                    </motion.a>
                  )}
                  
                  {card.location && (
                    <div className="flex items-center p-4 bg-red-50 rounded-xl border border-red-100">
                      <MapPin className="w-5 h-5 mr-3 text-red-600" />
                      <span className="text-gray-800 font-medium">{card.location}</span>
                    </div>
                  )}
                </div>

                {/* Projects */}
                {card.projects && card.projects.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Projeler</h3>
                    <div className="space-y-3">
                      {card.projects.map((project, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <h4 className="font-medium text-gray-800">{project.name}</h4>
                          {project.description && (
                            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={addToContacts}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Kişilere Ekle
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={saveScreenshot}
                      variant="outline"
                      className="border-blue-200 hover:bg-blue-50"
                      size="lg"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Kaydet
                    </Button>
                    
                    <Button 
                      onClick={shareCard}
                      variant="outline"
                      className="border-purple-200 hover:bg-purple-50"
                      size="lg"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Paylaş
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ravenkart CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white border-0">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-xl mb-2">
                  🚀 Sen de Ravenkart'ta!
                </h3>
                <p className="text-blue-100 mb-4">
                  Kendi dijital kartvizitini oluştur, QR kod ile paylaş ve profesyonel imajını güçlendir.
                </p>
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="secondary"
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Hemen Başla - Ücretsiz
                </Button>
                <p className="text-xs text-blue-200 mt-3">
                  ✨ 30 saniyede kartvizitini oluştur
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Powered by <span className="font-semibold">Ravenkart</span> - Dijital Kartvizit Platformu
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}