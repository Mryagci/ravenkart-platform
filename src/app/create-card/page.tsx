'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { QrCode, Phone, Mail, Globe, MapPin, User, Building, Save, ArrowLeft, Upload, Download, Home, Settings, Instagram, Linkedin, Twitter, Youtube, Facebook, MessageCircle, Send, Camera, Share2, Trash2, Plus, X, Edit, CreditCard } from 'lucide-react'
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
  fileName?: string
  fileType?: string
  fileSize?: number
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
  iban?: string
  profilePhotos?: string[]
  backgroundColor?: string
  ribbonPrimaryColor?: string
  ribbonSecondaryColor?: string
  textColor?: string
  socialMedia?: SocialMedia
  projects?: Project[]
  qrCodeType?: 'full' | 'limited'
  qrRedirectUrl?: string
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
    iban: '',
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

  const formatIBAN = (value: string): string => {
    // Remove all non-alphanumeric characters
    let cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Ensure it starts with TR
    if (cleaned.length > 0 && !cleaned.startsWith('TR')) {
      cleaned = 'TR' + cleaned.replace(/^TR/i, '');
    }
    
    // Limit to 26 characters (TR + 24 digits)
    cleaned = cleaned.substring(0, 26);
    
    // Format with spaces every 4 characters after TR
    if (cleaned.length <= 2) {
      return cleaned;
    }
    
    const tr = cleaned.substring(0, 2);
    const digits = cleaned.substring(2);
    const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
    
    return tr + (digits.length > 0 ? ' ' + formatted : '');
  };

  const handleInputChange = (field: keyof BusinessCardData, value: string) => {
    let processedValue = value;
    
    // Apply IBAN formatting for IBAN field
    if (field === 'iban') {
      processedValue = formatIBAN(value);
    }
    
    setCardData(prev => ({
      ...prev,
      [field]: processedValue
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
      if (!cardData.name) {
        setQrCodeUrl('');
        return;
      }

      // Preview QR code - will show visitor page URL format
      // When card is saved, it will use the actual card ID
      const previewUrl = cardData.qrRedirectUrl && cardData.qrRedirectUrl.trim() 
        ? cardData.qrRedirectUrl.trim()
        : `${window.location.origin}/v/preview-${Date.now()}`;

      const qrDataUrl = await QRCode.toDataURL(previewUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: cardData.textColor || '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M'
      });
      
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('QR kod oluşturma hatası:', error);
      setQrCodeUrl('');
    }
  }

  // Generate QR code when card data changes
  useEffect(() => {
    generateQRCode();
  }, [cardData.name, cardData.textColor, cardData.qrRedirectUrl]);

  const exportVCF = () => {
    if (!cardData.name) {
      alert('Lütfen önce ad soyad giriniz.');
      return;
    }

    const { downloadVCF } = require('@/lib/vcf-utils');
    
    downloadVCF({
      name: cardData.name,
      company: cardData.company,
      title: cardData.title,
      phone: cardData.phone,
      email: cardData.email,
      website: cardData.website,
      location: cardData.location,
      iban: cardData.iban
    });
    
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

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      description: ''
    };
    setCardData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), newProject]
    }));
  }

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setCardData(prev => ({
      ...prev,
      projects: prev.projects?.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      ) || []
    }));
  }

  const removeProject = (id: string) => {
    setCardData(prev => ({
      ...prev,
      projects: prev.projects?.filter(project => project.id !== id) || []
    }));
  }

  const handleProjectFileUpload = (projectId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (10MB limit for all file types)
    if (file.size > 10 * 1024 * 1024) {
      alert('Dosya boyutu 10MB\'dan küçük olmalıdır.');
      return;
    }

    // Support all file types
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      updateProject(projectId, 'image', base64);
      updateProject(projectId, 'fileName', file.name);
      updateProject(projectId, 'fileType', file.type);
      updateProject(projectId, 'fileSize', file.size);
    };
    reader.readAsDataURL(file);
  }

  const handleSave = async () => {
    try {
      console.log('🔄 Kartvizit kaydetme başladı...');
      setSaving(true);
      
      if (!cardData.name.trim()) {
        alert('Lütfen ad soyad giriniz.');
        return;
      }
      
      // Auth kontrolü
      if (!user) {
        alert('Lütfen önce giriş yapın.');
        router.push('/auth?mode=login');
        return;
      }

      console.log('✅ Kullanıcı doğrulandı:', user.id);

      // Import Supabase client
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Generate unique username with timestamp and random number
      const baseUsername = cardData.name.toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
        .replace(/\s+/g, '') // Remove spaces
        .substring(0, 10); // Limit length to make room for timestamp
      
      const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3-digit random number
      const username = `${baseUsername}${timestamp}${randomNum}`;

      console.log('📝 Oluşturulan username:', username);

      // Prepare card data for database
      const cardDataForDB = {
        user_id: user.id,
        username: username,
        name: cardData.name.trim(),
        title: cardData.title?.trim() || null,
        company: cardData.company?.trim() || null,
        company_logo: cardData.companyLogo || null,
        phone: cardData.phone?.trim() || null,
        email: cardData.email?.trim() || null,
        website: cardData.website?.trim() || null,
        location: cardData.location?.trim() || null,
        profile_photos: cardData.profilePhotos && cardData.profilePhotos.length > 0 ? cardData.profilePhotos : null,
        background_color: cardData.backgroundColor || '#ffffff',
        ribbon_primary_color: cardData.ribbonPrimaryColor || '#8b5cf6',
        ribbon_secondary_color: cardData.ribbonSecondaryColor || '#3b82f6',
        text_color: cardData.textColor || '#1f2937',
        social_media: cardData.socialMedia || {},
        projects: cardData.projects || [],
        qr_code_type: cardData.qrCodeType || 'full',
        qr_redirect_url: cardData.qrRedirectUrl?.trim() || null,
        is_active: true
      };

      // Insert card to database with retry for unique constraint
      let insertedCard = null;
      let retryCount = 0;
      const maxRetries = 3;

      while (!insertedCard && retryCount < maxRetries) {
        try {
          // If this is a retry, generate a new username
          if (retryCount > 0) {
            const newTimestamp = Date.now().toString().slice(-6);
            const newRandomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            cardDataForDB.username = `${baseUsername}${newTimestamp}${newRandomNum}`;
            console.log(`Username çakışması, yeni deneme: ${cardDataForDB.username}`);
          }

          const { data, error: insertError } = await supabase
            .from('cards')
            .insert(cardDataForDB)
            .select('id')
            .single();

          if (insertError) {
            // If it's a username conflict, retry
            if (insertError.code === '23505' && insertError.message.includes('cards_username_key')) {
              retryCount++;
              console.log(`Username çakışması (deneme ${retryCount}/${maxRetries})`);
              continue;
            }
            // Other errors, throw immediately
            throw new Error(`Veritabanı hatası: ${insertError.message}`);
          }

          insertedCard = data;
          break;

        } catch (error) {
          if (retryCount >= maxRetries - 1) {
            throw error;
          }
          retryCount++;
        }
      }

      if (!insertedCard) {
        throw new Error('Kartvizit kaydedilemedi');
      }

      console.log('✅ Kartvizit başarıyla kaydedildi:', insertedCard.id);
      console.log('📊 Kaydedilen veri:', insertedCard);
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        router.push('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving card:', error);
      alert('Kartvizit kaydedilirken bir hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
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
          className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg"
        >
          ✅ Kartvizit başarıyla kaydedildi!
        </motion.div>
      )}
      
      <div className="pt-16 pb-10 px-4">
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

              <div className="glass-card p-6 space-y-6">
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

                {/* IBAN */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    IBAN Numarası
                  </label>
                  <input
                    type="text"
                    value={cardData.iban}
                    onChange={(e) => handleInputChange('iban', e.target.value)}
                    placeholder="TR00 0000 0000 0000 0000 0000 00"
                    maxLength={32}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors font-mono"
                  />
                  <p className="text-white/50 text-xs mt-1">
                    Türkiye IBAN formatı: TR ile başlayan 26 haneli numara
                  </p>
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

                    {/* QR Redirect URL Management */}
                    <div className="space-y-3 mb-4 p-4 bg-white/5 rounded-lg border border-white/20">
                      <label className="text-white/80 text-sm font-medium block">
                        QR Kod Yönlendirme URL'i
                      </label>
                      <p className="text-white/50 text-xs">
                        QR kod tarandığında kullanıcıların yönlendirilmesini istediğiniz URL. 
                        Boş bırakırsanız kartvizit sayfanız gösterilir.
                      </p>
                      <div className="flex flex-col gap-2">
                        <input
                          type="url"
                          value={cardData.qrRedirectUrl || ''}
                          onChange={(e) => handleInputChange('qrRedirectUrl', e.target.value)}
                          placeholder="https://example.com veya boş bırakın"
                          className="px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white text-sm focus:outline-none focus:border-white/60 placeholder-white/40"
                        />
                        <div className="flex gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => handleInputChange('qrRedirectUrl', '')}
                            className="px-2 py-1 bg-white/10 text-white/70 rounded hover:bg-white/20 transition-colors"
                          >
                            Temizle
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInputChange('qrRedirectUrl', cardData.website || '')}
                            className="px-2 py-1 bg-white/10 text-white/70 rounded hover:bg-white/20 transition-colors"
                            disabled={!cardData.website}
                          >
                            Website Kullan
                          </button>
                        </div>
                      </div>
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

                {/* Projects Section */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-4">
                    <Building className="w-4 h-4 inline mr-2" />
                    Projeler & Ürünler
                  </label>
                  
                  <div className="space-y-4">
                    {/* Existing Projects */}
                    {cardData.projects && cardData.projects.length > 0 && (
                      <div className="space-y-3">
                        {cardData.projects.map((project, index) => (
                          <motion.div
                            key={project.id}
                            className="p-4 bg-white/5 rounded-lg border border-white/20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <span className="text-white/60 text-xs">Proje #{index + 1}</span>
                              <button
                                type="button"
                                onClick={() => removeProject(project.id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="space-y-3">
                              <input
                                type="text"
                                placeholder="Proje adı (örn: E-ticaret Web Sitesi)"
                                value={project.title}
                                onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60"
                              />
                              <textarea
                                placeholder="Proje açıklaması (örn: Modern, kullanıcı dostu e-ticaret platformu)"
                                value={project.description}
                                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 resize-none"
                              />
                              
                              {/* Project Image Upload */}
                              <div>
                                <label className="block text-white/60 text-xs mb-2">Proje Görseli</label>
                                <div className="flex items-center gap-3">
                                  {project.image && (
                                    <div className="w-16 h-16 rounded-lg border border-white/20 overflow-hidden bg-white/5">
                                      <img 
                                        src={project.image} 
                                        alt="Project" 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <input
                                      type="file"
                                      id={`project-file-${project.id}`}
                                      accept="*/*"
                                      onChange={(e) => handleProjectFileUpload(project.id, e)}
                                      className="hidden"
                                    />
                                    <label
                                      htmlFor={`project-file-${project.id}`}
                                      className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/30 text-white/70 rounded-lg hover:bg-white/20 transition-colors text-sm"
                                    >
                                      <Upload className="w-4 h-4" />
                                      {project.image ? 'Dosyayı Değiştir' : 'Dosya Yükle'}
                                    </label>
                                    {project.image && (
                                      <button
                                        type="button"
                                        onClick={() => updateProject(project.id, 'image', '')}
                                        className="ml-2 text-red-400 hover:text-red-300 text-sm"
                                      >
                                        Kaldır
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-white/40 text-xs mt-1">JPG, PNG - Max 5MB</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Add Project Button */}
                    <motion.button
                      type="button"
                      onClick={addProject}
                      className="w-full py-3 border-2 border-dashed border-white/30 rounded-lg text-white/60 hover:text-white hover:border-white/50 transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Proje Ekle</span>
                    </motion.button>

                    <p className="text-white/50 text-xs mt-2">
                      💡 Projelerinizi ve çalışmalarınızı kartvizitinizde sergileyerek profesyonel imajınızı güçlendirin
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-4 border-t border-white/20">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={saving || !cardData.name.trim()}
                    className="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-xl md:rounded-2xl shadow-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 hover:scale-105 w-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                    <span className="relative z-10 flex items-center justify-center gap-2 text-sm md:text-base">
                      <Save className="w-4 md:w-5 h-4 md:h-5" />
                      {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </span>
                  </motion.button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={exportVCF}
                      disabled={!cardData.name}
                      className="group relative px-4 md:px-6 py-3 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl md:rounded-2xl backdrop-blur-sm hover:border-white/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center justify-center gap-2 text-xs md:text-sm">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Kişilere Ekle</span>
                        <span className="sm:hidden">VCF</span>
                      </span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addToHomeScreen}
                      disabled={!cardData.name}
                      className="group relative px-4 md:px-6 py-3 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl md:rounded-2xl backdrop-blur-sm hover:border-white/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center justify-center gap-2 text-xs md:text-sm">
                        <Home className="w-4 h-4" />
                        <span className="hidden sm:inline">Ana Ekrana Ekle</span>
                        <span className="sm:hidden">Ekle</span>
                      </span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Ön İzleme</h2>
                <p className="text-white/70">Kartvizitinizin nasıl görüneceğini inceleyin</p>
              </div>

              <div className="sticky top-20">
                {/* Desktop Preview */}
                <div className="hidden md:block">
                  <motion.div
                    className="glass-card p-6"
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
                            {cardData.iban && (
                              <div className="flex items-center justify-center gap-2 opacity-80" style={{ color: cardData.textColor || '#1f2937' }}>
                                <CreditCard className="w-4 h-4" />
                                <span className="text-xs font-mono">{cardData.iban}</span>
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
                    className="glass-card p-4"
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