'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { motion } from 'framer-motion'
import { Button } from '../../../components/ui/button'
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  UserPlus, 
  Download, 
  Home,
  CreditCard,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  MessageCircle
} from 'lucide-react'
import QRCodeLib from 'qrcode'

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
  background_color?: string
  ribbon_primary_color?: string
  ribbon_secondary_color?: string
  text_color?: string
  profile_photos?: string[]
  logo_url?: string
  social_media?: {
    linkedin?: string
    twitter?: string
    instagram?: string
    youtube?: string
    facebook?: string
    whatsapp?: string
    showInPublic?: boolean
    showLinkedin?: boolean
    showTwitter?: boolean
    showInstagram?: boolean
    showYoutube?: boolean
    showFacebook?: boolean
    showWhatsapp?: boolean
  }
}

export default function ZiyaretciKartvizitSayfasi() {
  const params = useParams()
  const cardId = params.cardId as string
  const [card, setCard] = useState<BusinessCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [showLogo, setShowLogo] = useState(false) // false = profil fotoğraf arka planda, logo yuvarlakta
  const [touchStartX, setTouchStartX] = useState(0)

  useEffect(() => {
    if (cardId) {
      fetchCard()
      trackVisit()
    }
  }, [cardId])

  useEffect(() => {
    if (card) {
      generateQRCode()
    }
  }, [card])

  const generateQRCode = async () => {
    if (!card) return

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
      let visitorUrl = `${baseUrl}/ziyaretci/${card.id}`
      
      if (!visitorUrl.startsWith('http')) {
        visitorUrl = 'https://' + visitorUrl
      }
      
      const qrDataUrl = await QRCodeLib.toDataURL(visitorUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: card.text_color || '#1f2937',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      })
      
      setQrCodeUrl(qrDataUrl)
    } catch (error) {
      console.error('QR kod oluşturma hatası:', error)
    }
  }

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
          visitType: 'qr_scan'
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
    
    // Mobil haptic feedback (titreşim)
    if ('vibrate' in navigator) {
      navigator.vibrate(50) // 50ms titreşim
    }
    
    try {
      const html2canvas = (await import('html2canvas')).default
      const element = document.querySelector('#business-card')
      
      if (!element) {
        console.error('Business card element not found!')
        alert('Kartvizit elementi bulunamadı')
        return
      }
      
      console.log('Element bulundu:', element)
      const rect = element.getBoundingClientRect()
      console.log('Element dimensions:', rect)
      
      // Element'i kesinlikle viewport'a getir
      console.log('Element viewport dışında, manuel scroll yapılıyor...')
      const elementTop = element.offsetTop
      const elementHeight = element.offsetHeight
      
      // Sayfayı element'in başına scroll et
      window.scrollTo({
        top: elementTop - 50, // 50px margin
        behavior: 'instant'
      })
      
      // Scroll sonrası bekle
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newRect = element.getBoundingClientRect()
      console.log('Manuel scroll sonrası pozisyon:', newRect)
      
      // Yuvarlak elementi screenshot sırasında gizle
      const circularContainer = element.querySelector('#circular-logo-container')
      let originalVisibility = ''
      
      if (circularContainer) {
        const circularEl = circularContainer as HTMLElement
        originalVisibility = circularEl.style.visibility
        circularEl.style.visibility = 'hidden' // Gizle ama yer kaplamaya devam et
        console.log('Yuvarlak element gizlendi')
      }
      
      // html2canvas - yuvarlak element görünmez
      const canvas = await html2canvas(element as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight
      })
      
      // Yuvarlak elementi geri göster
      if (circularContainer) {
        const circularEl = circularContainer as HTMLElement
        circularEl.style.visibility = originalVisibility
        console.log('Yuvarlak element geri gösterildi')
      }
      
      console.log('Canvas oluşturuldu:', canvas.width, 'x', canvas.height)
      
      // Mobil cihaz kontrolü
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      if (isMobile) {
        // Mobil cihazlarda galeriye kaydet
        await saveToMobileGallery(canvas, card.name)
      } else {
        // Desktop'ta normal download
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
        }, 'image/png', 1.0)
      }
    } catch (error) {
      console.error('Screenshot alınamadı:', error)
      alert('Görüntü kaydedilemedi')
    }
  }
  
  const saveToMobileGallery = async (canvas: HTMLCanvasElement, cardName: string) => {
    try {
      // Canvas'ı blob'a çevir
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
        }, 'image/png', 1.0)
      })
      
      if (!blob) {
        throw new Error('Canvas blob oluşturulamadı')
      }
      
      const fileName = `${cardName.replace(/\s+/g, '-').toLowerCase()}-kartvizit.png`
      
      // Modern Web Share API ile paylaş (iOS Safari ve Chrome)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], fileName, { type: 'image/png' })
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${cardName} - Kartvizit`,
            text: 'Kartvizit resmi',
            files: [file]
          })
          return
        }
      }
      
      // File System Access API (Chrome Android)
      if ('showSaveFilePicker' in window) {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: fileName,
            types: [{
              description: 'PNG resmi',
              accept: { 'image/png': ['.png'] }
            }]
          })
          const writable = await fileHandle.createWritable()
          await writable.write(blob)
          await writable.close()
          alert('Kartvizit galeriye kaydedildi!')
          return
        } catch (err) {
          console.log('File System API failed:', err)
        }
      }
      
      // iOS Safari için özel çözüm
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      if (isIOS) {
        // iOS'ta yeni bir tab aç ve görüntüyü göster
        const dataUrl = canvas.toDataURL('image/png', 1.0)
        const newWindow = window.open()
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${cardName} - Kartvizit</title>
                <style>
                  body {
                    margin: 0;
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                    background: #f0f0f0;
                    text-align: center;
                  }
                  img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    background: white;
                  }
                  .instructions {
                    margin-top: 20px;
                    padding: 15px;
                    background: white;
                    border-radius: 10px;
                    text-align: left;
                  }
                </style>
              </head>
              <body>
                <h2>📱 ${cardName} - Kartvizit</h2>
                <img src="${dataUrl}" alt="Kartvizit" />
                <div class="instructions">
                  <h3>📥 Galeriye Kaydetmek İçin:</h3>
                  <p><strong>1.</strong> Resme uzun basın</p>
                  <p><strong>2.</strong> "Fotoğrafları Kaydet" seçin</p>
                  <p><strong>3.</strong> İzin istenirse "İzin Ver" deyin</p>
                </div>
              </body>
            </html>
          `)
          newWindow.document.close()
        }
        return
      }
      
      // Android ve diğer mobil cihazlar için fallback
      const dataUrl = canvas.toDataURL('image/png', 1.0)
      const link = document.createElement('a')
      link.download = fileName
      link.href = dataUrl
      
      // Android'de download attribute desteklenmiyorsa
      if (typeof link.download === 'undefined') {
        // Yeni tab'da aç, kullanıcı manuel kaydetsin
        window.open(dataUrl, '_blank')
        alert('Açılan sekmede resme uzun basıp "Resmi Kaydet" seçin')
      } else {
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        alert('Kartvizit indirildi!')
      }
      
    } catch (error) {
      console.error('Mobil galeriye kaydetme hatası:', error)
      
      // Son çare - data URL ile yeni sekme
      const dataUrl = canvas.toDataURL('image/png', 1.0)
      window.open(dataUrl, '_blank')
      alert('Açılan sekmede resme uzun basıp galeriye kaydedin')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Kartvizit yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error || !card) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-white text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Kartvizit Bulunamadı</h1>
          <p className="text-gray-200 mb-6">{error}</p>
          <Button 
            onClick={() => window.location.href = '/'} 
            className="bg-white text-gray-900 hover:bg-gray-100"
          >
            <Home className="mr-2 h-4 w-4" />
            Ana Sayfa
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-sm mx-auto px-4">
        {/* Business Card - EXACTLY Same as Dashboard Preview */}
        <motion.div
          id="business-card"
          className="rounded-3xl shadow-2xl relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: card.background_color || '#ffffff',
            color: card.text_color || '#1f2937'
          }}
        >
          {/* Logo/Profile Photo Container with Animation */}
          <div 
            className="w-full aspect-square relative group"
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const touchEndX = e.changedTouches[0].clientX
              const difference = touchStartX - touchEndX
              
              if (Math.abs(difference) > 80) { // 80px minimum swipe distance
                setShowLogo(!showLogo)
              }
            }}
          >
            {/* Background - Logo or Profile based on showLogo state */}
            {showLogo ? (
              /* Logo in background when showLogo=true */
              card.logo_url ? (
                <div className="w-full h-full bg-white flex items-center justify-center p-8">
                  <img 
                    src={card.logo_url} 
                    alt="Company Logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full"></div>
                </div>
              )
            ) : (
              /* Profile photo in background when showLogo=false */
              card.profile_photos && card.profile_photos.length > 0 ? (
                <>
                  <img 
                    src={card.profile_photos[currentPhotoIndex]} 
                    alt="Profile" 
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => {
                      if (card.profile_photos && card.profile_photos.length > 1) {
                        setCurrentPhotoIndex((prev) => 
                          prev === card.profile_photos!.length - 1 ? 0 : prev + 1
                        );
                      }
                    }}
                  />
                  
                  {/* Navigation Dots - only show when profile is in background */}
                  {card.profile_photos.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {card.profile_photos.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentPhotoIndex(index);
                          }}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentPhotoIndex 
                              ? 'bg-white scale-125' 
                              : 'bg-white/60 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Photo Counter - only show when profile is in background */}
                  {card.profile_photos.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {currentPhotoIndex + 1}/{card.profile_photos.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center">
                  <User className="w-24 h-24 text-white/60" />
                </div>
              )
            )}
            
          </div>

          {/* 30px Ribbon with Gradient */}
          <div 
            className="h-8 border-t border-white/20 relative"
            style={{
              background: `linear-gradient(90deg, ${card.ribbon_primary_color || '#8b5cf6'} 0%, ${card.ribbon_secondary_color || '#3b82f6'} 100%)`
            }}
          >
            {/* Circle overlay on ribbon - Only show if logo exists */}
            {card.logo_url && (
              <div 
                id="circular-logo-container"
                className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-white rounded-full border-4 border-white/30 flex items-center justify-center overflow-hidden z-10 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setShowLogo(!showLogo)}
              >
              {!showLogo ? (
                /* Show logo in circle when profile is in background */
                card.logo_url ? (
                  <img 
                    src={card.logo_url} 
                    alt="Company Logo" 
                    className="w-32 h-32 object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
                )
              ) : (
                /* Show profile photo in circle when logo is in background */
                card.profile_photos && card.profile_photos.length > 0 ? (
                  <img 
                    src={card.profile_photos[currentPhotoIndex]} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
                )
              )}
              </div>
            )}
          </div>

          {/* Card Info Section - Adjusted spacing for logo circle */}
          <div className={`px-6 pb-6 ${card.logo_url ? 'pt-24' : 'pt-8'}`}>
            {/* Name and Title */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold mb-1" style={{ color: card.text_color || '#1f2937' }}>
                {card.name}
              </h2>
              {card.title && (
                <p className="text-lg opacity-80 mb-2" style={{ color: card.text_color || '#1f2937' }}>
                  {card.title}
                </p>
              )}
              {card.company && (
                <p className="text-md opacity-70 mb-4" style={{ color: card.text_color || '#1f2937' }}>
                  {card.company}
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-3 mb-6">
              {card.email && (
                <a 
                  href={`mailto:${card.email}`}
                  className="flex items-center justify-center gap-3 opacity-80 hover:opacity-100 transition-opacity" 
                  style={{ color: card.text_color || '#1f2937' }}
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{card.email}</span>
                </a>
              )}
              {card.phone && (
                <a 
                  href={`tel:${card.phone}`}
                  className="flex items-center justify-center gap-3 opacity-80 hover:opacity-100 transition-opacity" 
                  style={{ color: card.text_color || '#1f2937' }}
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{card.phone}</span>
                </a>
              )}
              {card.website && (
                <a 
                  href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 opacity-80 hover:opacity-100 transition-opacity" 
                  style={{ color: card.text_color || '#1f2937' }}
                >
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{card.website}</span>
                </a>
              )}
              {card.location && (
                <div className="flex items-center justify-center gap-3 opacity-80" style={{ color: card.text_color || '#1f2937' }}>
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{card.location}</span>
                </div>
              )}
            </div>

            {/* Social Media Icons - Only show if showInPublic is explicitly true */}
            {card.social_media?.showInPublic === true && (
              <div className="flex justify-center gap-4 py-4">
                {card.social_media?.linkedin && card.social_media?.showLinkedin !== false && (
                <a 
                  href={`https://linkedin.com/in/${card.social_media.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${card.ribbon_primary_color || '#8b5cf6'} 0%, ${card.ribbon_secondary_color || '#3b82f6'} 100%)`
                  }}
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              )}
              {card.social_media?.twitter && card.social_media?.showTwitter !== false && (
                <a 
                  href={`https://twitter.com/${card.social_media.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${card.ribbon_primary_color || '#8b5cf6'} 0%, ${card.ribbon_secondary_color || '#3b82f6'} 100%)`
                  }}
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
              )}
              {card.social_media?.instagram && card.social_media?.showInstagram !== false && (
                <a 
                  href={`https://instagram.com/${card.social_media.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${card.ribbon_primary_color || '#8b5cf6'} 0%, ${card.ribbon_secondary_color || '#3b82f6'} 100%)`
                  }}
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
              )}
              {card.social_media?.youtube && card.social_media?.showYoutube !== false && (
                <a 
                  href={`https://youtube.com/${card.social_media.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${card.ribbon_primary_color || '#8b5cf6'} 0%, ${card.ribbon_secondary_color || '#3b82f6'} 100%)`
                  }}
                >
                  <Youtube className="w-5 h-5 text-white" />
                </a>
              )}
              {card.social_media?.facebook && card.social_media?.showFacebook !== false && (
                <a 
                  href={`https://facebook.com/${card.social_media.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${card.ribbon_primary_color || '#8b5cf6'} 0%, ${card.ribbon_secondary_color || '#3b82f6'} 100%)`
                  }}
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
              )}
              {card.social_media?.whatsapp && card.social_media?.showWhatsapp !== false && (
                <a 
                  href={`https://wa.me/${card.social_media.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${card.ribbon_primary_color || '#8b5cf6'} 0%, ${card.ribbon_secondary_color || '#3b82f6'} 100%)`
                  }}
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </a>
              )}
              </div>
            )}

            {/* QR Code Section - Same as Dashboard */}
            <div className="flex justify-center pt-4">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-xs text-center p-2" style={{ color: card.text_color || '#1f2937' }}>
                    <div className="mb-1">📱</div>
                    <div>QR ile paylaş</div>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-center opacity-60 text-xs mt-2" style={{ color: card.text_color || '#1f2937' }}>
              QR kodu tarayarak kartviziti görüntüleyin
            </p>

            {/* Projects/Products Section */}
            {card.projects && card.projects.length > 0 && (
              <div className="pt-6 border-t border-white/20">
                <h3 className="text-white font-semibold mb-3 text-center">Projeler & Ürünler</h3>
                <div className="space-y-3">
                  {card.projects.map((project, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-3">
                      <h4 className="text-white font-medium text-sm">{project.title || project.name}</h4>
                      <p className="text-white/80 text-xs mt-1">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Powered by RAVENKART */}
          <div className="bg-black/20 py-2 text-center">
            <a 
              href="/" 
              className="text-white/60 text-xs hover:text-white/80 transition-colors"
            >
              Powered by RAVENKART
            </a>
          </div>
        </motion.div>


        {/* Action Buttons - Same as Dashboard */}
        <div className="space-y-4 max-w-sm mx-auto px-4 mt-8">
          {/* Kişilere Ekle Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={addToContacts}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg flex items-center justify-center gap-3 relative overflow-hidden"
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
            <UserPlus className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Kişilere Ekle</span>
          </motion.button>

          {/* Görüntü Kaydet Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveScreenshot}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg flex items-center justify-center gap-3 relative overflow-hidden"
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
            <Download className="w-5 h-5 relative z-10" />
            <span className="relative z-10">
              {/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                ? 'Galeriye Kaydet' 
                : 'Görüntü Kaydet'
              }
            </span>
          </motion.button>

          {/* Ana Sayfaya Dön */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/'}
            className="w-full py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl shadow-lg flex items-center justify-center gap-3 border border-white/20 hover:bg-white/20 transition-colors"
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Home className="w-5 h-5" />
            <span>Ravenkart'a Katıl</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}