'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Phone, Mail, Globe, MapPin, User, Linkedin, Twitter, Instagram, Youtube, Facebook, MessageCircle, Download, Share2 } from 'lucide-react'

interface BusinessCard {
  id: string
  name: string
  title: string
  company: string
  phone: string
  email: string
  website: string
  location: string
  profilePhotos?: string[]
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

  useEffect(() => {
    loadBusinessCard()
  }, [userId])

  const loadBusinessCard = () => {
    try {
      // In a real app, you'd fetch from database by user ID
      // For now, check localStorage for cards that match the user ID
      const savedCard = localStorage.getItem('business_card')
      if (savedCard) {
        const cardData = JSON.parse(savedCard)
        if (cardData.user_id === userId) {
          setBusinessCard(cardData)
        }
      }
    } catch (error) {
      console.error('Error loading business card:', error)
    } finally {
      setLoading(false)
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

        {/* Business Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="rounded-3xl shadow-2xl relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: businessCard.backgroundColor || '#ffffff',
              color: businessCard.textColor || '#1f2937'
            }}
          >
            {/* Full-width Profile Photo - Square with Carousel */}
            <div className="w-full aspect-square relative group">
              {businessCard.profilePhotos && businessCard.profilePhotos.length > 0 ? (
                <>
                  <img 
                    src={businessCard.profilePhotos[currentPhotoIndex]} 
                    alt="Profile" 
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => {
                      if (businessCard.profilePhotos && businessCard.profilePhotos.length > 1) {
                        setCurrentPhotoIndex((prev) => 
                          prev === businessCard.profilePhotos!.length - 1 ? 0 : prev + 1
                        );
                      }
                    }}
                  />
                  
                  {/* Navigation Dots */}
                  {businessCard.profilePhotos.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {businessCard.profilePhotos.map((_, index) => (
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
                  
                  {/* Photo Counter */}
                  {businessCard.profilePhotos.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      {currentPhotoIndex + 1}/{businessCard.profilePhotos.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center">
                  <User className="w-24 h-24 text-white/60" />
                </div>
              )}
            </div>

            {/* 30px Ribbon with Gradient */}
            <div 
              className="h-8 border-t border-white/20"
              style={{
                background: `linear-gradient(135deg, ${businessCard.ribbonPrimaryColor || '#8b5cf6'} 0%, ${businessCard.ribbonSecondaryColor || '#3b82f6'} 100%)`
              }}
            />

            {/* Content Section */}
            <div className="p-6 space-y-4">
              {/* Name, Title, Company */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold" style={{ color: businessCard.textColor || '#1f2937' }}>{businessCard.name}</h2>
                <p className="font-medium text-lg opacity-90" style={{ color: businessCard.textColor || '#1f2937' }}>{businessCard.title}</p>
                <p className="text-base opacity-80" style={{ color: businessCard.textColor || '#1f2937' }}>{businessCard.company}</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
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
              </div>

              {/* Social Media Icons */}
              <div className="flex justify-center gap-4 py-4">
                {businessCard.socialMedia?.linkedin && (
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
                {businessCard.socialMedia?.twitter && (
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
                {businessCard.socialMedia?.instagram && (
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
                {businessCard.socialMedia?.youtube && (
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
                {businessCard.socialMedia?.facebook && (
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
                {businessCard.socialMedia?.whatsapp && (
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
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
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
        <div className="text-center mt-8">
          <a 
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
          >
            Sen de Kartvizitini Oluştur
          </a>
        </div>
      </div>
    </div>
  )
}