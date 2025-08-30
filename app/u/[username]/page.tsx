'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Phone, Mail, Globe, MapPin, User, Linkedin, Twitter, Instagram, Youtube, Facebook, MessageCircle, Download, Share2, QrCode, CreditCard } from 'lucide-react'

interface BusinessCard {
  id: string
  name: string
  title: string
  company: string
  phone: string
  email: string
  website: string
  location: string
  iban?: string
  profilePhotos?: string[]
  logo_url?: string
  backgroundColor?: string
  ribbonPrimaryColor?: string
  ribbonSecondaryColor?: string
  textColor?: string
  socialMedia?: any
  projects?: any[]
  created_at: string
  user_id: string
}

export default function PublicProfilePage() {
  const params = useParams()
  const userId = params.username as string
  
  const [businessCard, setBusinessCard] = useState<BusinessCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [showLogo, setShowLogo] = useState(false)
  const [touchStartX, setTouchStartX] = useState(0)

  useEffect(() => {
    loadBusinessCard()
  }, [userId])

  useEffect(() => {
    if (businessCard) {
      generateQRCode()
    }
  }, [businessCard])

  const loadBusinessCard = async () => {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Fetch business card by username
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('username', userId)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        console.error('Card not found:', error)
        setBusinessCard(null)
        setLoading(false)
        return
      }

      // Convert Supabase format to component format (same as dashboard)
      const card = data
      const formattedCard = {
        id: card.id,
        name: card.name,
        title: card.title || '',
        company: card.company || '',
        phone: card.phone || '',
        email: card.email || '',
        website: card.website || '',
        location: card.location || '',
        iban: card.iban || '',
        profilePhotos: card.profile_photos || [],
        logo_url: card.logo_url || null,
        backgroundColor: card.background_color || '#ffffff',
        ribbonPrimaryColor: card.ribbon_primary_color || '#8b5cf6',
        ribbonSecondaryColor: card.ribbon_secondary_color || '#3b82f6',
        textColor: card.text_color || '#1f2937',
        socialMedia: card.social_media || {},
        projects: card.projects || [],
        created_at: card.created_at,
        user_id: card.user_id
      }

      setBusinessCard(formattedCard)
      trackVisit(formattedCard.id)
      
    } catch (error) {
      console.error('Error loading business card:', error)
      setBusinessCard(null)
    } finally {
      setLoading(false)
    }
  }

  const trackVisit = async (cardId: string) => {
    try {
      // Track the visit to analytics
      await fetch('/api/qr-analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: cardId,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || null
        })
      })
    } catch (error) {
      console.error('Analytics tracking failed:', error)
      // Fail silently, don't affect user experience
    }
  }

  const generateQRCode = async () => {
    try {
      if (!businessCard?.name) {
        setQrCodeUrl('')
        return
      }

      console.log('🔗 Visitor QR kod oluşturuluyor:', businessCard.id)

      // QR kod oluştur - DIREKT YÖNLENDİRME ZORLAMALI
      const currentUrl = window.location.href
      
      console.log('🔗 Visitor QR kod için URL:', currentUrl)

      const QRCode = (await import('qrcode')).default
      const qrDataUrl = await QRCode.toDataURL(currentUrl, {
        width: 300,     // Yüksek çözünürlük
        margin: 4,      // Daha fazla margin
        color: {
          dark: businessCard.textColor || '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'L', // Düşük hata düzeltme (daha hızlı tarama)
        type: 'image/png',
        quality: 1.0
      })

      setQrCodeUrl(qrDataUrl)
      console.log('✅ Visitor QR kod oluşturuldu:', currentUrl)

    } catch (error) {
      console.error('QR kod oluşturma hatası:', error)
    }
  }

  const exportVCF = () => {
    if (!businessCard?.name) {
      alert('Kartvizit bilgileri bulunamadı.')
      return
    }

    const vcf = `BEGIN:VCARD
VERSION:3.0
FN:${businessCard.name}
ORG:${businessCard.company}
TITLE:${businessCard.title}
TEL:${businessCard.phone}
EMAIL:${businessCard.email}
URL:${businessCard.website}
ADR:;;;${businessCard.location};;;
NOTE:RAVENKART ile oluşturuldu - https://ravenkart.com
END:VCARD`
    
    const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${businessCard.name.replace(/[^a-zA-Z0-9]/g, '_')}.vcf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareCard = async () => {
    if (!businessCard) return
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${businessCard.name} - Kartvizit`,
          text: `${businessCard.name}'in dijital kartvizitini görüntüleyin`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Paylaşım iptal edildi')
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Kartvizit bağlantısı panoya kopyalandı!')
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #111827 0%, #7c3aed 25%, #ec4899 50%, #3730a3 75%, #111827 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    )
  }

  if (!businessCard) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #111827 0%, #7c3aed 25%, #ec4899 50%, #3730a3 75%, #111827 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '2rem'
      }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Kartvizit Bulunamadı</h1>
          <p className="text-white/70 text-lg mb-8">Bu kullanıcıya ait bir kartvizit bulunamadı.</p>
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #7c3aed 25%, #ec4899 50%, #3730a3 75%, #111827 100%)',
      padding: '2rem 1rem'
    }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Dijital Kartvizit</h1>
          <p className="text-white/60 text-sm">RAVENKART ile oluşturuldu</p>
        </div>

        {/* Mobile Business Card Design - Exact copy from dashboard */}
        <div className="max-w-sm mx-auto">
          <motion.div
            id="business-card"
            className="rounded-3xl shadow-2xl relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: businessCard.backgroundColor || '#ffffff',
              color: businessCard.textColor || '#1f2937'
            }}
          >
            {/* Logo/Profile Photo Container with Animation */}
            <div 
              className="w-full aspect-square relative group cursor-pointer"
              onClick={() => setShowLogo(!showLogo)}
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
                businessCard.logo_url ? (
                  <div className="w-full h-full bg-white flex items-center justify-center p-8 cursor-pointer">
                    <img 
                      src={businessCard.logo_url} 
                      alt="Company Logo" 
                      className="max-w-full max-h-full object-contain cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center cursor-pointer">
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full"></div>
                  </div>
                )
              ) : (
                /* Profile photo in background when showLogo=false */
                (businessCard.profilePhotos && businessCard.profilePhotos.length > 0) || !businessCard.profilePhotos ? (
                  <>
                    <img 
                      src={businessCard.profilePhotos?.[currentPhotoIndex] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'} 
                      alt="Profile" 
                      className="w-full h-full object-cover cursor-pointer"
                    />
                    
                    {/* Navigation Dots - only show when profile is in background */}
                    {businessCard.profilePhotos && businessCard.profilePhotos.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {businessCard.profilePhotos.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentPhotoIndex 
                                ? 'bg-white scale-125' 
                                : 'bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Photo Counter - only show when profile is in background */}
                    {businessCard.profilePhotos && businessCard.profilePhotos.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        {currentPhotoIndex + 1}/{businessCard.profilePhotos.length}
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
                background: `linear-gradient(135deg, ${businessCard.ribbonPrimaryColor || '#8b5cf6'} 0%, ${businessCard.ribbonSecondaryColor || '#3b82f6'} 100%)`
              }}
            >
              {/* Circle overlay on ribbon - Only show if logo exists */}
              {businessCard.logo_url && (
                <div 
                  className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-white rounded-full border-4 border-white/30 flex items-center justify-center overflow-hidden z-10 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setShowLogo(!showLogo)}
                >
                {!showLogo ? (
                  /* Show logo in circle when profile is in background */
                  businessCard.logo_url ? (
                    <img 
                      src={businessCard.logo_url} 
                      alt="Company Logo" 
                      className="w-32 h-32 object-contain"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full"></div>
                  )
                ) : (
                  /* Show profile photo in circle when logo is in background */
                  businessCard.profilePhotos && businessCard.profilePhotos.length > 0 ? (
                    <img 
                      src={businessCard.profilePhotos[currentPhotoIndex]} 
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

            {/* Content Section with larger fonts - Adjusted spacing for logo circle */}
            <div className={`px-6 pb-6 space-y-4 ${businessCard.logo_url ? 'pt-24' : 'pt-8'}`}>
              {/* Name, Title, Company */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold" style={{ color: businessCard.textColor || '#1f2937' }}>{businessCard.name}</h2>
                <p className="font-medium text-lg opacity-90" style={{ color: businessCard.textColor || '#1f2937' }}>{businessCard.title}</p>
                <p className="text-base opacity-80" style={{ color: businessCard.textColor || '#1f2937' }}>{businessCard.company}</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                {businessCard.phone && (
                  <a 
                    href={`tel:${businessCard.phone}`}
                    className="flex items-center justify-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
                    style={{ color: businessCard.textColor || '#1f2937' }}
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{businessCard.phone}</span>
                  </a>
                )}
                {businessCard.email && (
                  <a 
                    href={`mailto:${businessCard.email}`}
                    className="flex items-center justify-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
                    style={{ color: businessCard.textColor || '#1f2937' }}
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{businessCard.email}</span>
                  </a>
                )}
                {businessCard.website && (
                  <a 
                    href={businessCard.website.startsWith('http') ? businessCard.website : `https://${businessCard.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
                    style={{ color: businessCard.textColor || '#1f2937' }}
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">{businessCard.website}</span>
                  </a>
                )}
                {businessCard.location && (
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(businessCard.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
                    style={{ color: businessCard.textColor || '#1f2937' }}
                  >
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{businessCard.location}</span>
                  </a>
                )}
                {businessCard.iban && (
                  <div className="flex items-center justify-center gap-2 opacity-80" style={{ color: businessCard.textColor || '#1f2937' }}>
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm font-mono">{businessCard.iban}</span>
                  </div>
                )}
              </div>

              {/* Social Media Icons - Only show if showInPublic is true */}
              {businessCard.socialMedia?.showInPublic === true && (
                <div className="flex justify-center gap-4 py-4">
                {businessCard.socialMedia?.linkedin && businessCard.socialMedia?.showLinkedin !== false && (
                  <a 
                    href={`https://linkedin.com/in/${businessCard.socialMedia.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${businessCard.ribbonPrimaryColor || '#8b5cf6'} 0%, ${businessCard.ribbonSecondaryColor || '#3b82f6'} 100%)`
                    }}
                  >
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                )}
                {businessCard.socialMedia?.twitter && businessCard.socialMedia?.showTwitter !== false && (
                  <a 
                    href={`https://twitter.com/${businessCard.socialMedia.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${businessCard.ribbonPrimaryColor || '#8b5cf6'} 0%, ${businessCard.ribbonSecondaryColor || '#3b82f6'} 100%)`
                    }}
                  >
                    <Twitter className="w-5 h-5 text-white" />
                  </a>
                )}
                {businessCard.socialMedia?.instagram && businessCard.socialMedia?.showInstagram !== false && (
                  <a 
                    href={`https://instagram.com/${businessCard.socialMedia.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${businessCard.ribbonPrimaryColor || '#8b5cf6'} 0%, ${businessCard.ribbonSecondaryColor || '#3b82f6'} 100%)`
                    }}
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                )}
                {businessCard.socialMedia?.youtube && businessCard.socialMedia?.showYoutube !== false && (
                  <a 
                    href={`https://youtube.com/${businessCard.socialMedia.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${businessCard.ribbonPrimaryColor || '#8b5cf6'} 0%, ${businessCard.ribbonSecondaryColor || '#3b82f6'} 100%)`
                    }}
                  >
                    <Youtube className="w-5 h-5 text-white" />
                  </a>
                )}
                {businessCard.socialMedia?.facebook && businessCard.socialMedia?.showFacebook !== false && (
                  <a 
                    href={`https://facebook.com/${businessCard.socialMedia.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${businessCard.ribbonPrimaryColor || '#8b5cf6'} 0%, ${businessCard.ribbonSecondaryColor || '#3b82f6'} 100%)`
                    }}
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                )}
                {businessCard.socialMedia?.whatsapp && businessCard.socialMedia?.showWhatsapp !== false && (
                  <a 
                    href={`https://wa.me/${businessCard.socialMedia.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${businessCard.ribbonPrimaryColor || '#8b5cf6'} 0%, ${businessCard.ribbonSecondaryColor || '#3b82f6'} 100%)`
                    }}
                  >
                    <MessageCircle className="w-5 h-5 text-white" />
                  </a>
                )}
                </div>
              )}

              {/* QR Code Section - Dashboard Style */}
              <div className="flex justify-center pt-4">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <QrCode className="w-16 h-16" style={{ color: businessCard.textColor || '#1f2937' }} />
                  )}
                </div>
              </div>
              
              <p className="text-center opacity-60 text-xs mt-2" style={{ color: businessCard.textColor || '#1f2937' }}>
                QR kodu tarayarak kartviziti görüntüleyin
              </p>

              {/* Projects/Products Section */}
              {businessCard.projects && businessCard.projects.length > 0 && (
                <div className="pt-6 border-t border-white/20">
                  <h3 className="text-white font-semibold mb-3 text-center">Projeler & Ürünler</h3>
                  <div className="space-y-3">
                    {businessCard.projects.map((project) => (
                      <div key={project.id} className="bg-white/10 rounded-lg p-3">
                        <h4 className="text-white font-medium text-sm">{project.title}</h4>
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
                target="_blank"
                className="text-white/60 text-xs hover:text-white/80 transition-colors"
              >
                Powered by RAVENKART
              </a>
            </div>
          </motion.div>
        </div>


        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportVCF}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Kişilere Ekle</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareCard}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Paylaş</span>
          </motion.button>
        </div>

        {/* Create Your Own */}
        <div className="text-center mt-6">
          <a 
            href="/"
            target="_blank"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform w-full sm:w-auto"
          >
            Sen de Kartvizitini Oluştur
          </a>
        </div>
      </div>
    </div>
  )
}