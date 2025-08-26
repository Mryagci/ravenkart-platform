'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { QrCode, Plus, Phone, Mail, Globe, MapPin, Edit3, User, Linkedin, Twitter, Instagram, Youtube, Facebook, MessageCircle, BarChart3 } from 'lucide-react'
import Navbar from '@/components/layout/navbar'
import QRCode from 'qrcode'
import QRAnalyticsDashboard from '@/components/analytics/qr-analytics-dashboard'

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
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [businessCard, setBusinessCard] = useState<BusinessCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  useEffect(() => {
    checkUserAndCard()
  }, [])

  useEffect(() => {
    if (businessCard) {
      generateQRCode()
    }
  }, [businessCard])

  const generateQRCode = async () => {
    try {
      if (!businessCard?.name || !user?.id) {
        setQrCodeUrl('');
        return;
      }

      // Create URL for visitor mode
      const visitorUrl = `${window.location.origin}/u/${user.id}`;

      const qrDataUrl = await QRCode.toDataURL(visitorUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: businessCard.textColor || '#000000',
          light: '#FFFFFF',
        },
      });

      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('QR kod oluşturma hatası:', error);
    }
  }

  async function checkUserAndCard() {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Check user authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth?mode=login');
        return;
      }
      setUser(user);

      // Check if user has a business card in localStorage
      const savedCard = localStorage.getItem('business_card');
      if (savedCard) {
        const cardData = JSON.parse(savedCard);
        if (cardData.user_id === user.id) {
          setBusinessCard(cardData);
        }
      }
      
    } catch (error) {
      console.error('Error:', error);
      router.push('/auth?mode=login');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #7c3aed 25%, #ec4899 50%, #3730a3 75%, #111827 100%)'
    }}>
      <Navbar />
      
      <div style={{paddingTop: '5rem', paddingBottom: '2.5rem', padding: '5rem 1rem 2.5rem'}}>
        <div style={{maxWidth: '64rem', margin: '0 auto'}}>
          {businessCard ? (
            // Show existing business card
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Kartvizitim</h1>
                <p className="text-white/70">Dijital kartvizitinizi görüntüleyin ve düzenleyin</p>
              </div>

              {/* Mobile Business Card Design */}
              <div className="max-w-sm mx-auto">
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

                  {/* Content Section with larger fonts */}
                  <div className="p-6 space-y-4">
                    {/* Name, Title, Company */}
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold" style={{ color: businessCard.textColor || '#1f2937' }}>{businessCard.name}</h2>
                      <p className="font-medium text-lg opacity-90" style={{ color: businessCard.textColor || '#1f2937' }}>{businessCard.title}</p>
                      <p className="text-base opacity-80" style={{ color: businessCard.textColor || '#1f2937' }}>{businessCard.company}</p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      {businessCard.phone && (
                        <div className="flex items-center justify-center gap-2 opacity-80" style={{ color: businessCard.textColor || '#1f2937' }}>
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{businessCard.phone}</span>
                        </div>
                      )}
                      {businessCard.email && (
                        <div className="flex items-center justify-center gap-2 opacity-80" style={{ color: businessCard.textColor || '#1f2937' }}>
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{businessCard.email}</span>
                        </div>
                      )}
                      {businessCard.website && (
                        <div className="flex items-center justify-center gap-2 opacity-80" style={{ color: businessCard.textColor || '#1f2937' }}>
                          <Globe className="w-4 h-4" />
                          <span className="text-sm">{businessCard.website}</span>
                        </div>
                      )}
                      {businessCard.location && (
                        <div className="flex items-center justify-center gap-2 opacity-80" style={{ color: businessCard.textColor || '#1f2937' }}>
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{businessCard.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex justify-center gap-4 py-4">
                      {businessCard.socialMedia?.linkedin && (
                        <a 
                          href={`https://linkedin.com/in/${businessCard.socialMedia.linkedin}`}
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
                          className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                          style={{
                            background: `linear-gradient(135deg, ${businessCard.ribbonPrimaryColor || '#8b5cf6'} 0%, ${businessCard.ribbonSecondaryColor || '#3b82f6'} 100%)`
                          }}
                        >
                          <MessageCircle className="w-5 h-5 text-white" />
                        </a>
                      )}
                    </div>

                    {/* QR Code Section */}
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
                      className="text-white/60 text-xs hover:text-white/80 transition-colors"
                    >
                      Powered by RAVENKART
                    </a>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center px-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/create-card')}
                  className="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-xl md:rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  <span className="relative z-10 flex items-center justify-center gap-2 text-base md:text-lg">
                    <Edit3 className="w-4 md:w-5 h-4 md:h-5" />
                    Kartviziti Düzenle
                  </span>
                </motion.button>
              </div>

              {/* QR Analytics Dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-8 px-4"
              >
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-semibold text-white flex items-center justify-center gap-2 mb-2">
                    <BarChart3 className="w-6 h-6" />
                    QR Kod Analitik
                  </h2>
                  <p className="text-white/60 text-sm">
                    QR kodunuzun tarama istatistiklerini takip edin
                  </p>
                </div>
                <QRAnalyticsDashboard cardId={businessCard.id} />
              </motion.div>
            </motion.div>
          ) : (
            // No business card exists
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8"
            >
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">Kartvizitim</h1>
                <p className="text-white/70 text-lg">Henüz bir kartvizitiniz bulunmuyor</p>
              </div>

              {/* Empty State Illustration */}
              <div className="flex justify-center">
                <motion.div
                  className="w-80 h-48 border-2 border-dashed border-white/30 rounded-2xl flex flex-col items-center justify-center space-y-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-white/60" />
                  </div>
                  <p className="text-white/60 text-center px-4">
                    Dijital kartvizitiniz burada görünecek
                  </p>
                </motion.div>
              </div>

              {/* Create Card Prompt */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white">
                  Hemen bir tane oluşturmak ister misin?
                </h2>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    onClick={() => router.push('/create-card')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-2xl shadow-2xl overflow-hidden"
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                    <span className="relative z-10 flex items-center gap-2 text-lg">
                      <Plus className="w-5 h-5" />
                      Kartvizit Oluştur
                    </span>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => router.push('/')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-2xl backdrop-blur-sm hover:border-white/60 transition-all duration-300"
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    Daha Sonra
                  </motion.button>
                </div>
              </div>

              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {[
                  { icon: QrCode, title: "QR Kod", desc: "Anında paylaşım" },
                  { icon: Phone, title: "İletişim", desc: "Tüm bilgiler tek yerde" },
                  { icon: Globe, title: "Online", desc: "Her yerden erişilebilir" }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <feature.icon className="w-8 h-8 mx-auto mb-3 text-white/80" />
                    <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/60">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}