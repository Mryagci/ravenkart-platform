'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { QrCode, Plus, Phone, Mail, Globe, MapPin, Edit3, User, Linkedin, Twitter, Instagram, Youtube, Facebook, MessageCircle, BarChart3, Download, Share2, Camera, UserPlus, Home, Smartphone, Scan, Grid, ChevronDown, CreditCard } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  iban?: string
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
  
  // VCF Export Function
  const generateVCF = () => {
    if (!businessCard) return

    const vcfData = `BEGIN:VCARD
VERSION:3.0
FN:${businessCard.name}
ORG:${businessCard.company}
TITLE:${businessCard.title}
TEL:${businessCard.phone}
EMAIL:${businessCard.email}
URL:${businessCard.website}
ADR:;;${businessCard.location};;;;
${businessCard.iban ? `NOTE:IBAN: ${businessCard.iban}` : ''}
END:VCARD`

    const blob = new Blob([vcfData], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${businessCard.name.replace(/\s+/g, '_')}.vcf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Add to Home Screen Function  
  const addToHomeScreen = async () => {
    if (!businessCard) return

    try {
      // Create a simple HTML page for the shortcut
      const shortcutData = {
        name: businessCard.name,
        short_name: businessCard.name,
        start_url: `${window.location.origin}/u/${user?.id}`,
        display: 'standalone',
        background_color: businessCard.backgroundColor || '#ffffff',
        theme_color: businessCard.ribbonPrimaryColor || '#8b5cf6',
        icons: [
          {
            src: businessCard.profilePhotos?.[0] || '/favicon.ico',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }

      // Create and download manifest file
      const manifestBlob = new Blob([JSON.stringify(shortcutData, null, 2)], { 
        type: 'application/json' 
      })
      const manifestUrl = window.URL.createObjectURL(manifestBlob)
      
      // For iOS Safari, show instructions
      if (/iPhone|iPad|iPod|Safari/i.test(navigator.userAgent)) {
        alert(`${businessCard.name} kişisini ana ekranınıza eklemek için:\n\n1. Bu sayfayı Safari'de açın\n2. Paylaş düğmesine basın\n3. "Ana Ekrana Ekle" seçin`)
      } else {
        // For other browsers, try PWA install
        const link = document.createElement('a')
        link.href = `${window.location.origin}/u/${user?.id}`
        link.target = '_blank'
        link.click()
      }

    } catch (error) {
      console.error('Ana ekrana ekleme hatası:', error)
      alert('Ana ekrana eklenirken bir hata oluştu')
    }
  }

  // Save as Image Function
  const saveAsImage = async () => {
    if (!businessCard) return

    try {
      // Find the business card element (only the visible card, not buttons)
      const cardElement = document.getElementById('business-card')
      if (!cardElement) {
        alert('Kartvizit elementi bulunamadı')
        return
      }

      // Use html2canvas library
      const html2canvas = (await import('html2canvas')).default
      
      console.log('Kartvizit fotoğrafı çekiliyor...')
      
      const canvas = await html2canvas(cardElement, {
        backgroundColor: businessCard.backgroundColor || '#ffffff',
        scale: 2, // High resolution
        useCORS: true,
        allowTaint: false,
        height: cardElement.offsetHeight,
        width: cardElement.offsetWidth,
        scrollX: 0,
        scrollY: 0
      })

      console.log('Canvas oluşturuldu, resim kaydediliyor...')

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `${businessCard.name.replace(/\s+/g, '_')}_kartvizit.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
          
          console.log('Kartvizit resmi başarıyla kaydedildi!')
        } else {
          throw new Error('Blob oluşturulamadı')
        }
      }, 'image/png', 0.95)

    } catch (error) {
      console.error('Resim kaydetme hatası:', error)
      alert('Resim kaydedilirken bir hata oluştu: ' + (error as Error).message)
    }
  }

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

      console.log('🔗 Dashboard QR kod oluşturuluyor:', businessCard.id);

      // Önce localStorage'dan QR kodunu kontrol et
      const savedQR = localStorage.getItem(`qr_code_${businessCard.id}`);
      if (savedQR) {
        const qrData = JSON.parse(savedQR);
        setQrCodeUrl(qrData.qrCodeDataUrl);
        console.log('✅ QR kod localStorage\'dan yüklendi');
        return;
      }

      // QR kod oluştur - Ravenkart domain'inde visitor sayfasına yönlendiren
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const visitorUrl = `${baseUrl}/v/${businessCard.id}`;

      const qrDataUrl = await QRCode.toDataURL(visitorUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: businessCard.textColor || '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M'
      });

      setQrCodeUrl(qrDataUrl);
      console.log('✅ QR kod oluşturuldu:', visitorUrl);

      // QR kodunu localStorage'a kaydet
      localStorage.setItem(`qr_code_${businessCard.id}`, JSON.stringify({
        cardId: businessCard.id,
        qrCodeDataUrl: qrDataUrl,
        visitorUrl: visitorUrl,
        createdAt: new Date().toISOString()
      }));
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

      // Check if user has a business card in Supabase
      await fetchUserCard(user.id);
      
    } catch (error) {
      console.error('Error:', error);
      router.push('/auth?mode=login');
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserCard(userId: string) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      console.log('🔍 Kullanıcının kartlarını arıyorum:', userId);

      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Kart getirme hatası:', error);
        return;
      }

      if (data && data.length > 0) {
        const card = data[0];
        console.log('✅ Kullanıcının kartı bulundu:', card.name);
        
        // Convert Supabase format to dashboard format
        const dashboardCard = {
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
          backgroundColor: card.background_color || '#ffffff',
          ribbonPrimaryColor: card.ribbon_primary_color || '#8b5cf6',
          ribbonSecondaryColor: card.ribbon_secondary_color || '#3b82f6',
          textColor: card.text_color || '#1f2937',
          socialMedia: card.social_media || {},
          projects: card.projects || [],
          created_at: card.created_at
        };
        
        setBusinessCard(dashboardCard);
      } else {
        console.log('❌ Kullanıcının kartı bulunamadı');
      }
    } catch (error) {
      console.error('Kart yükleme hatası:', error);
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
              {/* Mobile Apps Dropdown - Only on mobile */}
              <div className="md:hidden mb-6 flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      className="glass-effect px-6 py-3 rounded-2xl text-white font-medium flex items-center gap-2 shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Grid className="w-5 h-5" />
                      <span>Uygulamalar</span>
                      <ChevronDown className="w-4 h-4" />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 glass-effect border-white/20 bg-black/80 backdrop-blur-xl">
                    <DropdownMenuItem 
                      onClick={() => router.push('/create-card')}
                      className="text-white hover:bg-white/20 focus:bg-white/20"
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      <span>Kartvizit Düzenle</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => router.push('/apps/card-scanner')}
                      className="text-white hover:bg-white/20 focus:bg-white/20"
                    >
                      <Scan className="mr-2 h-4 w-4" />
                      <span>Kart Tarayıcı</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => router.push('/dashboard/analytics')}
                      className="text-white hover:bg-white/20 focus:bg-white/20"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <span>Detaylı Analitik</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem 
                      onClick={() => router.push('/account')}
                      className="text-white hover:bg-white/20 focus:bg-white/20"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil Ayarları</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: businessCard?.name,
                            text: `${businessCard?.name} - ${businessCard?.title}`,
                            url: `${window.location.origin}/u/${user?.id}`
                          });
                        } else {
                          navigator.clipboard.writeText(`${window.location.origin}/u/${user?.id}`);
                          alert('Link panoya kopyalandı!');
                        }
                      }}
                      className="text-white hover:bg-white/20 focus:bg-white/20"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      <span>Kartviziti Paylaş</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Business Card Design */}
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
                      {businessCard.iban && (
                        <div className="flex items-center justify-center gap-2 opacity-80" style={{ color: businessCard.textColor || '#1f2937' }}>
                          <CreditCard className="w-4 h-4" />
                          <span className="text-sm font-mono">{businessCard.iban}</span>
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
              <div className="space-y-4 max-w-sm mx-auto px-4">
                {/* Kişilere Ekle Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateVCF}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-lg flex items-center justify-center gap-3 relative overflow-hidden"
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  <UserPlus className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Kişilere Ekle</span>
                </motion.button>

                {/* Ana Ekrana Ekle Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addToHomeScreen}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg flex items-center justify-center gap-3 relative overflow-hidden"
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  <Smartphone className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Ana Ekrana Ekle</span>
                </motion.button>

                {/* Resim Olarak Kaydet Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveAsImage}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-2xl shadow-lg flex items-center justify-center gap-3 relative overflow-hidden"
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  <Download className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Resim Olarak Kaydet</span>
                </motion.button>
              </div>

              {/* QR Analytics Dashboard */}
              <motion.div
                id="analytics"
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
                    className="glass-card p-6 text-center"
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