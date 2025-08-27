'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Phone, Mail, Globe, MapPin, User, Building, Download, Home, Instagram, Linkedin, Twitter, Youtube, Facebook, MessageCircle, UserPlus, Share2, ExternalLink } from 'lucide-react'

interface SocialMedia {
  linkedin?: string
  twitter?: string
  instagram?: string
  youtube?: string
  facebook?: string
  whatsapp?: string
  showInPublic?: boolean
}

interface BusinessCardData {
  id: string
  name: string
  title: string
  company: string
  companyLogo?: string
  phone: string
  email: string
  website: string
  location: string
  profilePhotos?: string[]
  backgroundColor?: string
  ribbonPrimaryColor?: string
  ribbonSecondaryColor?: string
  textColor?: string
  socialMedia?: SocialMedia
  qr_code_url?: string
  qr_code_data?: string
}

export default function VisitorCardPage() {
  const params = useParams()
  const cardId = params.cardId as string
  
  const [cardData, setCardData] = useState<BusinessCardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showAddToContactsSuccess, setShowAddToContactsSuccess] = useState(false)
  const [showAddToHomeScreenSuccess, setShowAddToHomeScreenSuccess] = useState(false)

  useEffect(() => {
    loadCardData()
  }, [cardId])

  const loadCardData = async () => {
    try {
      // For now, check localStorage (in real app, fetch from database via API)
      const savedCard = localStorage.getItem('business_card')
      if (savedCard) {
        const card = JSON.parse(savedCard)
        if (card.id === cardId) {
          setCardData(card)
        } else {
          // Card not found
          setCardData(null)
        }
      }
    } catch (error) {
      console.error('Error loading card:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToContacts = () => {
    if (!cardData) return

    const { downloadVCF } = require('@/lib/vcf-utils')
    
    downloadVCF({
      name: cardData.name,
      company: cardData.company,
      title: cardData.title,
      phone: cardData.phone,
      email: cardData.email,
      website: cardData.website,
      location: cardData.location
    })

    // Show success message
    setShowAddToContactsSuccess(true)
    setTimeout(() => setShowAddToContactsSuccess(false), 3000)
  }

  const addToHomeScreen = () => {
    if (!cardData) return

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)
    
    if (isIOS) {
      // iOS specific instructions
      alert('iOS: Safari menüsünden "Ana Ekrana Ekle" seçeneğini kullanabilirsiniz.')
    } else if (isAndroid) {
      // Android specific instructions
      alert('Android: Tarayıcı menüsünden "Ana ekrana ekle" seçeneğini kullanabilirsiniz.')
    } else {
      // Desktop - copy URL to clipboard
      const currentUrl = window.location.href
      navigator.clipboard.writeText(currentUrl).then(() => {
        setShowAddToHomeScreenSuccess(true)
        setTimeout(() => setShowAddToHomeScreenSuccess(false), 3000)
      }).catch(() => {
        alert('Bağlantı kopyalanamadı. Manuel olarak kopyalayabilirsiniz: ' + currentUrl)
      })
    }
  }

  const openSocialMedia = (platform: string, username: string) => {
    let url = ''
    
    switch (platform) {
      case 'linkedin':
        url = `https://linkedin.com/in/${username}`
        break
      case 'twitter':
        url = `https://twitter.com/${username.replace('@', '')}`
        break
      case 'instagram':
        url = `https://instagram.com/${username}`
        break
      case 'youtube':
        url = `https://youtube.com/@${username.replace('@', '')}`
        break
      case 'facebook':
        url = `https://facebook.com/${username}`
        break
      case 'whatsapp':
        url = `https://wa.me/${username.replace(/[^0-9]/g, '')}`
        break
      default:
        return
    }
    
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    )
  }

  if (!cardData) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Kartvizit Bulunamadı</h1>
          <p className="text-white/70 mb-8">Aradığınız kartvizit mevcut değil veya kaldırılmış.</p>
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Ana Sayfaya Dön
          </motion.a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Success Messages */}
      {showAddToContactsSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg"
        >
          ✅ Kişi bilgileri indirildi!
        </motion.div>
      )}

      {showAddToHomeScreenSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg"
        >
          ✅ Bağlantı panoya kopyalandı!
        </motion.div>
      )}

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Business Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl shadow-2xl relative overflow-hidden"
            style={{
              backgroundColor: cardData.backgroundColor || '#ffffff',
              color: cardData.textColor || '#1f2937'
            }}
          >
            {/* Full-width Profile Photo */}
            <div className="w-full aspect-square relative group">
              {cardData.profilePhotos && cardData.profilePhotos.length > 0 ? (
                <>
                  <img 
                    src={cardData.profilePhotos[currentPhotoIndex]} 
                    alt="Profile" 
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => {
                      if (cardData.profilePhotos && cardData.profilePhotos.length > 1) {
                        setCurrentPhotoIndex((prev) => 
                          prev === cardData.profilePhotos!.length - 1 ? 0 : prev + 1
                        )
                      }
                    }}
                  />
                  
                  {/* Navigation Dots */}
                  {cardData.profilePhotos.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {cardData.profilePhotos.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentPhotoIndex(index)
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
                  
                  {/* Photo Counter */}
                  {cardData.profilePhotos.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {currentPhotoIndex + 1}/{cardData.profilePhotos.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center">
                  <User className="w-24 h-24 text-white/60" />
                </div>
              )}
            </div>

            {/* Ribbon with Gradient */}
            <div 
              className="h-8 border-t border-white/20"
              style={{
                background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
              }}
            />

            {/* Content Section */}
            <div className="p-6 space-y-4">
              {/* Name, Title, Company */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold" style={{ color: cardData.textColor || '#1f2937' }}>
                  {cardData.name}
                </h1>
                <p className="font-medium text-lg opacity-90" style={{ color: cardData.textColor || '#1f2937' }}>
                  {cardData.title}
                </p>
                <p className="text-base opacity-80" style={{ color: cardData.textColor || '#1f2937' }}>
                  {cardData.company}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                {cardData.phone && (
                  <motion.a
                    href={`tel:${cardData.phone}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors"
                    style={{ color: cardData.textColor || '#1f2937' }}
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{cardData.phone}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </motion.a>
                )}
                {cardData.email && (
                  <motion.a
                    href={`mailto:${cardData.email}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors"
                    style={{ color: cardData.textColor || '#1f2937' }}
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{cardData.email}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </motion.a>
                )}
                {cardData.website && (
                  <motion.a
                    href={cardData.website.startsWith('http') ? cardData.website : `https://${cardData.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors"
                    style={{ color: cardData.textColor || '#1f2937' }}
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm">{cardData.website}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </motion.a>
                )}
                {cardData.location && (
                  <div className="flex items-center justify-center gap-3 p-3 rounded-xl opacity-80" style={{ color: cardData.textColor || '#1f2937' }}>
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{cardData.location}</span>
                  </div>
                )}
              </div>

              {/* Social Media Icons */}
              {cardData.socialMedia && (cardData.socialMedia.linkedin || cardData.socialMedia.twitter || cardData.socialMedia.instagram || cardData.socialMedia.youtube || cardData.socialMedia.facebook || cardData.socialMedia.whatsapp) && (
                <div className="pt-4">
                  <h3 className="text-center text-sm font-medium mb-3 opacity-70" style={{ color: cardData.textColor || '#1f2937' }}>
                    Sosyal Medya
                  </h3>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {cardData.socialMedia.linkedin && (
                      <motion.button
                        onClick={() => openSocialMedia('linkedin', cardData.socialMedia!.linkedin!)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                        style={{
                          background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                        }}
                      >
                        <Linkedin className="w-5 h-5 text-white" />
                      </motion.button>
                    )}
                    {cardData.socialMedia.twitter && (
                      <motion.button
                        onClick={() => openSocialMedia('twitter', cardData.socialMedia!.twitter!)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                        style={{
                          background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                        }}
                      >
                        <Twitter className="w-5 h-5 text-white" />
                      </motion.button>
                    )}
                    {cardData.socialMedia.instagram && (
                      <motion.button
                        onClick={() => openSocialMedia('instagram', cardData.socialMedia!.instagram!)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                        style={{
                          background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                        }}
                      >
                        <Instagram className="w-5 h-5 text-white" />
                      </motion.button>
                    )}
                    {cardData.socialMedia.youtube && (
                      <motion.button
                        onClick={() => openSocialMedia('youtube', cardData.socialMedia!.youtube!)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                        style={{
                          background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                        }}
                      >
                        <Youtube className="w-5 h-5 text-white" />
                      </motion.button>
                    )}
                    {cardData.socialMedia.facebook && (
                      <motion.button
                        onClick={() => openSocialMedia('facebook', cardData.socialMedia!.facebook!)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                        style={{
                          background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                        }}
                      >
                        <Facebook className="w-5 h-5 text-white" />
                      </motion.button>
                    )}
                    {cardData.socialMedia.whatsapp && (
                      <motion.button
                        onClick={() => openSocialMedia('whatsapp', cardData.socialMedia!.whatsapp!)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                        style={{
                          background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                        }}
                      >
                        <MessageCircle className="w-5 h-5 text-white" />
                      </motion.button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* iOS Style Action Buttons */}
          <div className="mt-6 space-y-3">
            {/* Add to Contacts Button - Green iOS Style */}
            <motion.button
              onClick={addToContacts}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-green-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-3"
            >
              <UserPlus className="w-5 h-5" />
              <span>Kişilere Ekle</span>
            </motion.button>

            {/* Add to Home Screen Button */}
            <motion.button
              onClick={addToHomeScreen}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-blue-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-3"
            >
              <Home className="w-5 h-5" />
              <span>Ana Ekrana Ekle</span>
            </motion.button>
          </div>

          {/* Join Ravenkart Family CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-2">
                Sen de Ravenkart Ailesine Katıl!
              </h3>
              <p className="text-white/70 text-sm mb-4">
                Kendi dijital kartvizitini oluştur ve profesyonel kimliğini dijital dünyaya taşı.
              </p>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Hemen Başla
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}