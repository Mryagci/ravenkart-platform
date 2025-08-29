'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import { Button } from '../../../components/ui/button'
import { Card, CardContent } from '../../../components/ui/card'
import { ExternalLink, User, Mail, Phone, Globe, MapPin, Building2, QrCode, Edit, UserPlus, Download, Home } from 'lucide-react'

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
  address?: string
  iban?: string
  projects?: any[]
  created_at: string
  user_id: string
  is_active: boolean
}

export default function VisitorCardPage() {
  const params = useParams()
  const cardId = params.cardId as string
  const [card, setCard] = useState<BusinessCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (cardId) {
      fetchCard()
      // Analytics tracking
      trackVisit()
    }
  }, [cardId])

  const fetchCard = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', cardId)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Card fetch error:', error)
        setError('Kartvizit bulunamadı veya aktif değil')
        return
      }

      if (!data) {
        setError('Kartvizit bulunamadı')
        return
      }

      setCard(data)
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Kartvizit yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const trackVisit = async () => {
    try {
      // QR Analytics tracking
      await fetch('/api/qr-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: cardId,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || null
        })
      })
    } catch (error) {
      console.log('Analytics tracking failed:', error)
      // Don't block user experience for analytics failure
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
      location: card.address || ''
    })
  }

  const saveScreenshot = async () => {
    if (!card) return
    
    try {
      // Capture screenshot using html2canvas
      const html2canvas = (await import('html2canvas')).default
      const element = document.querySelector('.card-container')
      
      if (element) {
        const canvas = await html2canvas(element as HTMLElement, {
          backgroundColor: '#f8fafc',
          scale: 2,
          logging: false,
        })
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `kartvizit-${card.name.replace(/\s+/g, '-').toLowerCase()}.png`
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


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Kartvizit yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Kartvizit Bulunamadı</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.href = '/'}>
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    )
  }

  // Ana kartvizit görünümü

  // Main card display
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-8">
      <div className="max-w-md mx-auto px-4">
        <Card className="shadow-xl card-container">
          <CardContent className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {card.name.charAt(0).toUpperCase()}
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">{card.name}</h1>
              {card.title && <p className="text-gray-600 text-lg">{card.title}</p>}
              {card.company && <p className="text-gray-500">{card.company}</p>}
            </div>

            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              {card.email && (
                <motion.a
                  href={`mailto:${card.email}`}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Mail className="w-5 h-5 mr-3 text-blue-500" />
                  <span className="text-gray-700">{card.email}</span>
                </motion.a>
              )}
              
              {card.phone && (
                <motion.a
                  href={`tel:${card.phone}`}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Phone className="w-5 h-5 mr-3 text-green-500" />
                  <span className="text-gray-700">{card.phone}</span>
                </motion.a>
              )}
              
              {card.website && (
                <motion.a
                  href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Globe className="w-5 h-5 mr-3 text-purple-500" />
                  <span className="text-gray-700 flex-1 truncate">{card.website}</span>
                  <ExternalLink className="w-4 h-4 ml-2 text-gray-400" />
                </motion.a>
              )}
              
              {card.address && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 mr-3 text-red-500" />
                  <span className="text-gray-700">{card.address}</span>
                </div>
              )}

              {card.iban && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Building2 className="w-5 h-5 mr-3 text-orange-500" />
                  <span className="text-gray-700 font-mono text-sm">{card.iban}</span>
                </div>
              )}
            </div>

            {/* Projects */}
            {card.projects && card.projects.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Projeler</h3>
                <div className="space-y-3">
                  {card.projects.map((project, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
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
                className="w-full bg-green-500 hover:bg-green-600"
                size="lg"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Kişilere Ekle
              </Button>
              
              <Button 
                onClick={saveScreenshot}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Download className="mr-2 h-4 w-4" />
                Görüntü Kaydet
              </Button>
            </div>
            
            <p className="text-xs text-gray-400 text-center mt-6">
              🚀 Ravenkart ile oluşturuldu
            </p>
          </CardContent>
        </Card>

        {/* Join Ravenkart CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <h3 className="font-bold text-lg mb-2">
                Sen de Ravenkart Ailesine Katıl!
              </h3>
              <p className="text-blue-100 text-sm mb-4">
                Kendi dijital kartvizitini oluştur ve profesyonel kimliğini dijital dünyaya taşı.
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="secondary"
                size="sm"
              >
                Hemen Başla
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}