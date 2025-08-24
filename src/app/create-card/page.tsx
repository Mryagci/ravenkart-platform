'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { QrCode, Phone, Mail, Globe, MapPin, User, Building, Save, ArrowLeft, Upload, Download, Home, Settings, Instagram, Linkedin, Twitter, Youtube, Facebook, MessageCircle, Send, Camera, Share2, Trash2, Plus, X, Edit } from 'lucide-react'
import Navbar from '@/components/layout/navbar'

interface SocialMedia {
  linkedin?: string
  twitter?: string
  instagram?: string
  tiktok?: string
  youtube?: string
  facebook?: string
  snapchat?: string
  telegram?: string
  pinterest?: string
  whatsapp?: string
  showInPublic?: boolean
}

interface Project {
  id: string
  title: string
  description: string
  image?: string
}

interface BusinessCardData {
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
  projects?: Project[]
  qrCodeType?: 'full' | 'limited'
}

export default function CreateCard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  
  const [cardData, setCardData] = useState<BusinessCardData>({
    name: '',
    title: '',
    company: '',
    companyLogo: '',
    phone: '',
    email: '',
    website: '',
    location: '',
    profilePhotos: [],
    backgroundColor: '#ffffff',
    ribbonPrimaryColor: '#8b5cf6',
    ribbonSecondaryColor: '#3b82f6',
    textColor: '#1f2937',
    socialMedia: {
      showInPublic: true
    },
    projects: [],
    qrCodeType: 'full'
  })
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth?mode=login');
        return;
      }
      setUser(user);
      
      // Pre-fill email from user account
      setCardData(prev => ({
        ...prev,
        email: user.email || ''
      }));

      // Load existing business card data if available
      const savedCard = localStorage.getItem('business_card');
      if (savedCard) {
        const cardData = JSON.parse(savedCard);
        if (cardData.user_id === user.id) {
          setCardData(cardData);
          // If there are multiple photos, set the first one as current
          if (cardData.profilePhotos && cardData.profilePhotos.length > 0) {
            setCurrentPhotoIndex(0);
          }
        }
      }
      
    } catch (error) {
      console.error('Error:', error);
      router.push('/auth?mode=login');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (field: keyof BusinessCardData, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'logo') => {
    const files = event.target.files;
    if (!files) return;

    if (type === 'profile') {
      const currentPhotos = cardData.profilePhotos || [];
      const remainingSlots = 4 - currentPhotos.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      
      if (filesToProcess.length === 0) {
        alert('Maksimum 4 fotoğraf yükleyebilirsiniz.');
        return;
      }

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          setCardData(prev => ({
            ...prev,
            profilePhotos: [...(prev.profilePhotos || []), base64]
          }));
        };
        reader.readAsDataURL(file);
      });
    } else {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setCardData(prev => ({
          ...prev,
          companyLogo: base64
        }));
      };
      reader.readAsDataURL(file);
    }
  }

  const removePhoto = (index: number) => {
    setCardData(prev => ({
      ...prev,
      profilePhotos: prev.profilePhotos?.filter((_, i) => i !== index) || []
    }));
    // Reset current photo index if needed
    if (currentPhotoIndex >= (cardData.profilePhotos?.length || 1) - 1) {
      setCurrentPhotoIndex(0);
    }
  }

  const replacePhoto = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setCardData(prev => ({
        ...prev,
        profilePhotos: prev.profilePhotos?.map((photo, i) => i === index ? base64 : photo) || []
      }));
    };
    reader.readAsDataURL(file);
  }

  const generateQRCode = async () => {
    try {
      if (!cardData.name || !user?.id) {
        setQrCodeUrl('');
        return;
      }

      // Create URL for visitor mode
      const visitorUrl = `${window.location.origin}/u/${user.id}`;

      const qrDataUrl = await QRCode.toDataURL(visitorUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: cardData.textColor || '#000000',
          light: '#FFFFFF',
        },
      });
      
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('QR kod oluşturma hatası:', error);
    }
  }

  // Generate QR code when card data changes
  useEffect(() => {
    generateQRCode();
  }, [cardData.name, cardData.textColor, user?.id]);

  const exportVCF = () => {
    if (!cardData.name) {
      alert('Lütfen önce ad soyad giriniz.');
      return;
    }

    const vcf = `BEGIN:VCARD
VERSION:3.0
FN:${cardData.name}
ORG:${cardData.company}
TITLE:${cardData.title}
TEL:${cardData.phone}
EMAIL:${cardData.email}
URL:${cardData.website}
ADR:;;;${cardData.location};;;
NOTE:RAVENKART ile oluşturuldu - https://ravenkart.com
END:VCARD`;
    
    const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cardData.name.replace(/[^a-zA-Z0-9]/g, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    alert('VCF dosyası başarıyla indirildi!');
  }

  const addToHomeScreen = async () => {
    if (!cardData.name) {
      alert('Lütfen önce ad soyad giriniz.');
      return;
    }

    // Check if the browser supports PWA installation
    if ('serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window) {
      try {
        // For now, create a simple bookmark instruction
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        if (isIOS) {
          alert('iOS: Safari menüsünden "Ana Ekrana Ekle" seçeneğini kullanabilirsiniz.');
        } else if (isAndroid) {
          alert('Android: Tarayıcı menüsünden "Ana ekrana ekle" seçeneğini kullanabilirsiniz.');
        } else {
          // Desktop - create a shortcut URL
          const shortcutUrl = `${window.location.origin}/card/${user?.id}`;
          navigator.clipboard.writeText(shortcutUrl);
          alert('Kartvizit bağlantısı panoya kopyalandı! Tarayıcınızın yer imlerine ekleyebilirsiniz.');
        }
      } catch (error) {
        console.error('Add to home screen error:', error);
        alert('Ana ekrana ekleme şu anda desteklenmiyor.');
      }
    } else {
      // Fallback for browsers that don't support PWA
      const shortcutUrl = `${window.location.origin}/card/${user?.id}`;
      navigator.clipboard.writeText(shortcutUrl);
      alert('Kartvizit bağlantısı panoya kopyalandı! Tarayıcınızın yer imlerine ekleyebilirsiniz.');
    }
  }

  const handleSocialMediaChange = (platform: keyof SocialMedia, value: string) => {
    setCardData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  }

  const handleSave = async () => {
    console.log('handleSave called');
    console.log('Current cardData:', cardData);
    console.log('User:', user);
    console.log('Is localStorage available:', typeof Storage !== 'undefined');
    try {
      setSaving(true);
      
      // Save to localStorage for demo (in real app, save to database)
      const businessCardData = {
        ...cardData,
        id: Date.now().toString(),
        user_id: user?.id,
        created_at: new Date().toISOString()
      };
      
      console.log('Saving businessCardData:', businessCardData);
      localStorage.setItem('business_card', JSON.stringify(businessCardData));
      console.log('Saved to localStorage successfully');
      
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      console.log('Setting save success to true');
      setSaveSuccess(true);
      setTimeout(() => {
        console.log('Hiding success message and redirecting');
        setSaveSuccess(false);
        router.push('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving card:', error);
    } finally {
      setSaving(false);
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
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      {/* Success Message */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg"
        >
          ✅ Kartvizit başarıyla kaydedildi!
        </motion.div>
      )}
      
      <div className="pt-20 pb-10 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Form Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Kartvizit Bilgileri</h1>
                <p className="text-white/70">Kartvizitinizde görünecek bilgileri girin</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 space-y-6">
                {/* Profile Photos Management */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-4">
                    <Camera className="w-4 h-4 inline mr-2" />
                    Profil Fotoğrafları
                    <span className="text-white/60 text-xs ml-2">(Maksimum 4 fotoğraf)</span>
                  </label>
                  
                  {/* Photo Grid */}
                  <div className="grid grid-cols-4 gap-3">
                    {Array.from({ length: 4 }).map((_, index) => {
                      const hasPhoto = cardData.profilePhotos && cardData.profilePhotos[index];
                      return (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-xl overflow-hidden border-2 border-white/20 bg-white/10 hover:border-white/40 transition-all duration-300">
                            {hasPhoto ? (
                              <>
                                {/* Photo */}
                                <img
                                  src={cardData.profilePhotos![index]}
                                  alt={`Profile ${index + 1}`}
                                  className="w-full h-full object-cover cursor-pointer"
                                  onClick={() => setCurrentPhotoIndex(index)}
                                />
                                
                                {/* Photo Actions Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  {/* Replace Photo Button */}
                                  <label className="cursor-pointer">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => replacePhoto(index, e)}
                                      className="hidden"
                                    />
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                                    >
                                      <Edit className="w-4 h-4 text-white" />
                                    </motion.div>
                                  </label>
                                  
                                  {/* Delete Photo Button */}
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => removePhoto(index)}
                                    className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 text-white" />
                                  </motion.button>
                                </div>
                                
                                {/* Active Photo Indicator */}
                                {currentPhotoIndex === index && (
                                  <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                                )}
                              </>
                            ) : (
                              /* Add Photo Slot */
                              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-colors group">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handlePhotoUpload(e, 'profile')}
                                  className="hidden"
                                />
                                <Plus className="w-6 h-6 text-white/60 group-hover:text-white transition-colors mb-1" />
                                <span className="text-xs text-white/60 group-hover:text-white transition-colors text-center">
                                  Fotoğraf<br />Ekle
                                </span>
                              </label>
                            )}
                          </div>
                          
                          {/* Photo Number */}
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                            <span className="text-xs text-white/60 bg-black/50 px-1.5 py-0.5 rounded-full">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Current Photo Info */}
                  {cardData.profilePhotos && cardData.profilePhotos.length > 0 && (
                    <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <img 
                          src={cardData.profilePhotos[currentPhotoIndex]} 
                          alt="Selected" 
                          className="w-12 h-12 rounded-lg object-cover border border-white/20"
                        />
                        <div>
                          <p className="text-white text-sm font-medium">
                            Aktif Fotoğraf: {currentPhotoIndex + 1}/{cardData.profilePhotos.length}
                          </p>
                          <p className="text-white/60 text-xs">
                            Bu fotoğraf kartvizitinizde ana fotoğraf olarak görünecek
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Upload Tips */}
                  <div className="mt-3 text-xs text-white/60">
                    <p>💡 <strong>İpuçları:</strong></p>
                    <ul className="ml-4 mt-1 space-y-0.5">
                      <li>• En iyi sonuç için kare (1:1) oranında fotoğraflar kullanın</li>
                      <li>• Fotoğrafa tıklayarak aktif fotoğrafı değiştirebilirsiniz</li>
                      <li>• Hover ile fotoğrafları düzenle/sil seçenekleri görünür</li>
                    </ul>
                  </div>
                </div>

                {/* Company Logo */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    Şirket Logosu
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white/20 rounded-lg border border-white/30 flex items-center justify-center overflow-hidden">
                      {cardData.companyLogo ? (
                        <img 
                          src={cardData.companyLogo} 
                          alt="Logo" 
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <Building className="w-8 h-8 text-white/60" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, 'logo')}
                        className="hidden"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="px-4 py-2 bg-white/20 border border-white/30 text-white rounded-lg hover:bg-white/30 transition-colors cursor-pointer inline-block"
                      >
                        Logo Yükle
                      </label>
                      <p className="text-white/60 text-xs mt-1">JPG, PNG, SVG</p>
                    </div>
                  </div>
                </div>

                {/* Color Customization */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-4">
                    🎨 Kartvizit Renkleri
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 text-xs mb-2">Arka Plan Rengi</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={cardData.backgroundColor}
                          onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                          className="w-10 h-10 rounded-lg border border-white/30 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={cardData.backgroundColor}
                          onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-xs focus:outline-none focus:border-white/60"
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/60 text-xs mb-2">Metin Rengi</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={cardData.textColor}
                          onChange={(e) => handleInputChange('textColor', e.target.value)}
                          className="w-10 h-10 rounded-lg border border-white/30 bg-transparent cursor-pointer"
                        />
                        <input
                          type="text"
                          value={cardData.textColor}
                          onChange={(e) => handleInputChange('textColor', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-xs focus:outline-none focus:border-white/60"
                          placeholder="#1f2937"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Gradient Colors for Ribbon */}
                  <div className="mt-4">
                    <label className="block text-white/60 text-xs mb-3">🌈 Profil Resmi Altı Gradient Renkleri</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/50 text-xs mb-2">Gradient Ana Renk</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={cardData.ribbonPrimaryColor}
                            onChange={(e) => handleInputChange('ribbonPrimaryColor', e.target.value)}
                            className="w-10 h-10 rounded-lg border border-white/30 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={cardData.ribbonPrimaryColor}
                            onChange={(e) => handleInputChange('ribbonPrimaryColor', e.target.value)}
                            className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-xs focus:outline-none focus:border-white/60"
                            placeholder="#8b5cf6"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white/50 text-xs mb-2">Gradient İkinci Renk</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={cardData.ribbonSecondaryColor}
                            onChange={(e) => handleInputChange('ribbonSecondaryColor', e.target.value)}
                            className="w-10 h-10 rounded-lg border border-white/30 bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={cardData.ribbonSecondaryColor}
                            onChange={(e) => handleInputChange('ribbonSecondaryColor', e.target.value)}
                            className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-xs focus:outline-none focus:border-white/60"
                            placeholder="#3b82f6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    value={cardData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ahmet Yılmaz"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    Ünvan
                  </label>
                  <input
                    type="text"
                    value={cardData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Yazılım Geliştirici"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <Building className="w-4 h-4 inline mr-2" />
                    Şirket
                  </label>
                  <input
                    type="text"
                    value={cardData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Teknoloji A.Ş."
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={cardData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+90 555 123 45 67"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={cardData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="ahmet@example.com"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={cardData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="www.example.com"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Konum
                  </label>
                  <input
                    type="text"
                    value={cardData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="İstanbul, Türkiye"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors"
                  />
                </div>

                {/* Social Media Section */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-4">
                    <Share2 className="w-4 h-4 inline mr-2" />
                    Sosyal Medya Hesapları
                  </label>
                  
                  <div className="space-y-4">
                    {/* QR Code Type Selection */}
                    <div className="flex items-center gap-4 mb-4">
                      <label className="text-white/60 text-sm">QR Kod Türü:</label>
                      <select
                        value={cardData.qrCodeType}
                        onChange={(e) => handleInputChange('qrCodeType', e.target.value)}
                        className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-sm focus:outline-none focus:border-white/60"
                      >
                        <option value="full">Tüm Bilgiler</option>
                        <option value="limited">Sınırlı Bilgiler</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* LinkedIn */}
                      <div className="flex items-center gap-2">
                        <Linkedin className="w-5 h-5 text-blue-400" />
                        <input
                          type="text"
                          placeholder="kullaniciadi"
                          value={cardData.socialMedia?.linkedin || ''}
                          onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                        />
                      </div>

                      {/* Twitter */}
                      <div className="flex items-center gap-2">
                        <Twitter className="w-5 h-5 text-sky-400" />
                        <input
                          type="text"
                          placeholder="@kullaniciadi"
                          value={cardData.socialMedia?.twitter || ''}
                          onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                        />
                      </div>

                      {/* Instagram */}
                      <div className="flex items-center gap-2">
                        <Instagram className="w-5 h-5 text-pink-400" />
                        <input
                          type="text"
                          placeholder="kullaniciadi"
                          value={cardData.socialMedia?.instagram || ''}
                          onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                        />
                      </div>

                      {/* YouTube */}
                      <div className="flex items-center gap-2">
                        <Youtube className="w-5 h-5 text-red-500" />
                        <input
                          type="text"
                          placeholder="@kanal"
                          value={cardData.socialMedia?.youtube || ''}
                          onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                        />
                      </div>

                      {/* Facebook */}
                      <div className="flex items-center gap-2">
                        <Facebook className="w-5 h-5 text-blue-500" />
                        <input
                          type="text"
                          placeholder="kullaniciadi"
                          value={cardData.socialMedia?.facebook || ''}
                          onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                        />
                      </div>

                      {/* WhatsApp */}
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-green-500" />
                        <input
                          type="text"
                          placeholder="+90 555 123 45 67"
                          value={cardData.socialMedia?.whatsapp || ''}
                          onChange={(e) => handleSocialMediaChange('whatsapp', e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-sm placeholder-white/50 focus:outline-none focus:border-white/60"
                        />
                      </div>
                    </div>

                    {/* Toggle for public display */}
                    <div className="flex items-center gap-2 mt-4">
                      <input
                        type="checkbox"
                        id="social-public"
                        checked={cardData.socialMedia?.showInPublic ?? true}
                        onChange={(e) => handleSocialMediaChange('showInPublic', e.target.checked.toString())}
                        className="w-4 h-4 rounded"
                      />
                      <label htmlFor="social-public" className="text-white/80 text-sm">
                        Sosyal medya hesaplarını herkese göster
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-white/20">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={saving || !cardData.name.trim()}
                    className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-2xl shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                    <span className="relative z-10 flex items-center gap-2">
                      <Save className="w-5 h-5" />
                      {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportVCF}
                    disabled={!cardData.name}
                    className="group relative px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-2xl backdrop-blur-sm hover:border-white/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Kişilere Ekle (.vcf)
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addToHomeScreen}
                    disabled={!cardData.name}
                    className="group relative px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-2xl backdrop-blur-sm hover:border-white/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      Ana Ekrana Ekle
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Ön İzleme</h2>
                <p className="text-white/70">Kartvizitinizin nasıl görüneceğini inceleyin</p>
              </div>

              <div className="sticky top-24">
                {/* Desktop Preview */}
                <div className="hidden md:block">
                  <motion.div
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Mobile Business Card Design - Same as Dashboard */}
                    <div className="max-w-sm mx-auto">
                      <motion.div
                        className="rounded-3xl shadow-2xl relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          backgroundColor: cardData.backgroundColor || '#ffffff',
                          color: cardData.textColor || '#1f2937'
                        }}
                      >
                        {/* Full-width Profile Photo - Square with Carousel */}
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
                                    );
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

                        {/* 30px Ribbon with Gradient */}
                        <div 
                          className="h-8 border-t border-white/20"
                          style={{
                            background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                          }}
                        />

                        {/* Content Section with larger fonts */}
                        <div className="p-6 space-y-4">
                          {/* Name, Title, Company */}
                          <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold" style={{ color: cardData.textColor || '#1f2937' }}>{cardData.name || 'Ad Soyad'}</h2>
                            <p className="font-medium text-lg opacity-90" style={{ color: cardData.textColor || '#1f2937' }}>{cardData.title || 'Ünvan'}</p>
                            <p className="text-base opacity-80" style={{ color: cardData.textColor || '#1f2937' }}>{cardData.company || 'Şirket'}</p>
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-2">
                            {cardData.phone && (
                              <div className="flex items-center justify-center gap-2 opacity-80" style={{ color: cardData.textColor || '#1f2937' }}>
                                <Phone className="w-4 h-4" />
                                <span className="text-sm">{cardData.phone}</span>
                              </div>
                            )}
                            {cardData.email && (
                              <div className="flex items-center justify-center gap-2 opacity-80" style={{ color: cardData.textColor || '#1f2937' }}>
                                <Mail className="w-4 h-4" />
                                <span className="text-sm">{cardData.email}</span>
                              </div>
                            )}
                            {cardData.website && (
                              <div className="flex items-center justify-center gap-2 opacity-80" style={{ color: cardData.textColor || '#1f2937' }}>
                                <Globe className="w-4 h-4" />
                                <span className="text-sm">{cardData.website}</span>
                              </div>
                            )}
                            {cardData.location && (
                              <div className="flex items-center justify-center gap-2 opacity-80" style={{ color: cardData.textColor || '#1f2937' }}>
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{cardData.location}</span>
                              </div>
                            )}
                          </div>

                          {/* Social Media Icons */}
                          <div className="flex justify-center gap-3 py-4 flex-wrap">
                            {cardData.socialMedia?.linkedin && (
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                                }}
                              >
                                <Linkedin className="w-5 h-5 text-white" />
                              </div>
                            )}
                            {cardData.socialMedia?.twitter && (
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                                }}
                              >
                                <Twitter className="w-5 h-5 text-white" />
                              </div>
                            )}
                            {cardData.socialMedia?.instagram && (
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                                }}
                              >
                                <Instagram className="w-5 h-5 text-white" />
                              </div>
                            )}
                            {cardData.socialMedia?.youtube && (
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                                }}
                              >
                                <Youtube className="w-5 h-5 text-white" />
                              </div>
                            )}
                            {cardData.socialMedia?.facebook && (
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                                }}
                              >
                                <Facebook className="w-5 h-5 text-white" />
                              </div>
                            )}
                            {cardData.socialMedia?.whatsapp && (
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                                }}
                              >
                                <MessageCircle className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>

                          {/* QR Code Section */}
                          <div className="flex justify-center pt-4">
                            <div 
                              className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg border overflow-hidden"
                              style={{
                                backgroundColor: cardData.backgroundColor === '#ffffff' ? '#f8f9fa' : '#ffffff',
                                borderColor: cardData.textColor ? `${cardData.textColor}20` : '#e5e7eb'
                              }}
                            >
                              {qrCodeUrl ? (
                                <img 
                                  src={qrCodeUrl} 
                                  alt="QR Code" 
                                  className="w-full h-full object-contain p-1"
                                />
                              ) : (
                                <QrCode className="w-16 h-16" style={{ color: cardData.textColor || '#1f2937' }} />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-center opacity-60 text-xs mt-2" style={{ color: cardData.textColor || '#1f2937' }}>
                            QR kodu tarayarak kartviziti görüntüleyin
                          </p>

                          {/* Projects/Products Section */}
                          {cardData.projects && cardData.projects.length > 0 && (
                            <div className="pt-6" style={{ borderTop: `1px solid ${cardData.textColor}20` }}>
                              <h3 className="font-semibold mb-3 text-center" style={{ color: cardData.textColor || '#1f2937' }}>Projeler & Ürünler</h3>
                              <div className="space-y-3">
                                {cardData.projects.map((project) => (
                                  <div 
                                    key={project.id} 
                                    className="rounded-lg p-3"
                                    style={{ 
                                      backgroundColor: `${cardData.textColor || '#1f2937'}10`,
                                      border: `1px solid ${cardData.textColor || '#1f2937'}20`
                                    }}
                                  >
                                    <h4 className="font-medium text-sm" style={{ color: cardData.textColor || '#1f2937' }}>{project.title}</h4>
                                    <p className="text-xs mt-1 opacity-80" style={{ color: cardData.textColor || '#1f2937' }}>{project.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Powered by RAVENKART */}
                        <div 
                          className="py-2 text-center"
                          style={{ 
                            backgroundColor: `${cardData.textColor || '#1f2937'}10`,
                            borderTop: `1px solid ${cardData.textColor || '#1f2937'}20`
                          }}
                        >
                          <span className="text-xs opacity-60" style={{ color: cardData.textColor || '#1f2937' }}>Powered by RAVENKART</span>
                        </div>
                      </motion.div>
                    </div>

                    <p className="text-center text-white/60 text-sm mt-4">
                      Desktop Önizleme - Form doldurdukça güncellenecek
                    </p>
                  </motion.div>
                </div>

                {/* Mobile Preview */}
                <div className="md:hidden">
                  <motion.div
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Compact Mobile Card */}
                    <div 
                      className="rounded-2xl shadow-xl overflow-hidden mx-auto max-w-xs"
                      style={{
                        backgroundColor: cardData.backgroundColor || '#ffffff'
                      }}
                    >
                      
                      {/* Header with photo and QR - Gradient Background */}
                      <div 
                        className="p-4 flex items-center justify-between"
                        style={{
                          background: `linear-gradient(45deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                        }}
                      >
                        <div className="w-16 h-16 relative group">
                          {cardData.profilePhotos && cardData.profilePhotos.length > 0 ? (
                            <>
                              <img 
                                src={cardData.profilePhotos[currentPhotoIndex]} 
                                alt="Profile" 
                                className="w-full h-full rounded-full object-cover border-2 border-white cursor-pointer"
                                onClick={() => {
                                  if (cardData.profilePhotos && cardData.profilePhotos.length > 1) {
                                    setCurrentPhotoIndex((prev) => 
                                      prev === cardData.profilePhotos!.length - 1 ? 0 : prev + 1
                                    );
                                  }
                                }}
                              />
                              {/* Photo indicator for mobile */}
                              {cardData.profilePhotos.length > 1 && (
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-white text-xs">
                                  {currentPhotoIndex + 1}/{cardData.profilePhotos.length}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="w-full h-full bg-white/20 rounded-full border-2 border-white/30 flex items-center justify-center">
                              <User className="w-8 h-8 text-white/60" />
                            </div>
                          )}
                        </div>
                        <div className="w-12 h-12 bg-white/90 rounded-lg flex items-center justify-center overflow-hidden">
                          {qrCodeUrl ? (
                            <img 
                              src={qrCodeUrl} 
                              alt="QR Code" 
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <QrCode className="w-8 h-8" style={{ color: cardData.textColor || '#1f2937' }} />
                          )}
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="px-4 pb-4 text-center">
                        <h3 className="text-lg font-bold mb-1" style={{ color: cardData.textColor || '#1f2937' }}>
                          {cardData.name || 'Ad Soyad'}
                        </h3>
                        <p className="font-medium text-sm mb-1 opacity-90" style={{ color: cardData.textColor || '#1f2937' }}>
                          {cardData.title || 'Ünvan'}
                        </p>
                        <p className="text-xs mb-3 opacity-80" style={{ color: cardData.textColor || '#1f2937' }}>
                          {cardData.company || 'Şirket'}
                        </p>

                        {/* Contact & Social Media */}
                        <div className="space-y-2">
                          {/* Quick Contact Row */}
                          <div className="flex justify-center gap-2">
                            {cardData.phone && (
                              <div 
                                className="w-7 h-7 rounded-full flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                                }}
                              >
                                <Phone className="w-3 h-3 text-white" />
                              </div>
                            )}
                            {cardData.email && (
                              <div 
                                className="w-7 h-7 rounded-full flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                                }}
                              >
                                <Mail className="w-3 h-3 text-white" />
                              </div>
                            )}
                            {cardData.website && (
                              <div 
                                className="w-7 h-7 rounded-full flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                                }}
                              >
                                <Globe className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          
                          {/* Social Media Row */}
                          <div className="flex justify-center gap-1.5 flex-wrap">
                            {cardData.socialMedia?.linkedin && (
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                                }}
                              >
                                <Linkedin className="w-3 h-3 text-white" />
                              </div>
                            )}
                            {cardData.socialMedia?.twitter && (
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                                }}
                              >
                                <Twitter className="w-3 h-3 text-white" />
                              </div>
                            )}
                            {cardData.socialMedia?.instagram && (
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                                }}
                              >
                                <Instagram className="w-3 h-3 text-white" />
                              </div>
                            )}
                            {cardData.socialMedia?.youtube && (
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                                }}
                              >
                                <Youtube className="w-3 h-3 text-white" />
                              </div>
                            )}
                            {cardData.socialMedia?.facebook && (
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                                }}
                              >
                                <Facebook className="w-3 h-3 text-white" />
                              </div>
                            )}
                            {cardData.socialMedia?.whatsapp && (
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center"
                                style={{
                                  background: `linear-gradient(135deg, ${cardData.ribbonPrimaryColor || '#8b5cf6'} 0%, ${cardData.ribbonSecondaryColor || '#3b82f6'} 100%)`
                                }}
                              >
                                <MessageCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-center text-white/60 text-sm mt-3">
                      Mobil Önizleme
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}