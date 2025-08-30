'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, User, Building2, Mail, Phone, Globe, MapPin, Calendar, StickyNote, Trash2, Edit, Save, X, Crop, Check, UserPlus, Share2, Download, Copy } from 'lucide-react'
import Navbar from '@/components/layout/navbar'

interface SavedCard {
  id: string
  name: string
  title?: string
  company?: string
  email?: string
  phone?: string
  website?: string
  image_data?: string
  location?: string
  notes?: string
  scanned_at: string
  created_at: string
}

export default function SavedCardsPage() {
  const [savedCards, setSavedCards] = useState<SavedCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingCard, setEditingCard] = useState<SavedCard | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<SavedCard>>({})
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [cropMode, setCropMode] = useState(false)
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 })

  useEffect(() => {
    loadSavedCards()
  }, [])

  const loadSavedCards = async () => {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Test data when not authenticated
        const testCards: SavedCard[] = [
          {
            id: 'test-1',
            name: 'Ahmet Yılmaz',
            title: 'Yazılım Geliştirici',
            company: 'TechCorp',
            email: 'ahmet@techcorp.com',
            phone: '+90 555 123 4567',
            website: 'https://techcorp.com',
            image_data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxOCI+QWhtZXQgWcSxbG1hejwvdGV4dD48dGV4dCB4PSIxNTAiIHk9IjEyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTIiPlRlY2hDb3JwPC90ZXh0Pjwvc3ZnPg==',
            location: 'İstanbul, Türkiye',
            notes: 'Önemli müşteri',
            scanned_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          },
          {
            id: 'test-2',
            name: 'Fatma Özkan',
            title: 'Pazarlama Müdürü',
            company: 'Digital Agency',
            email: 'fatma@digital.com',
            phone: '+90 555 987 6543',
            website: 'https://digitalagency.com',
            image_data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzllNDNkYyIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxOCI+RmF0bWEgw5Z6a2FuPC90ZXh0Pjx0ZXh0IHg9IjE1MCIgeT0iMTIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMiI+RGlnaXRhbCBBZ2VuY3k8L3RleHQ+PC9zdmc+',
            location: 'Ankara, Türkiye',
            notes: 'Sosyal medya uzmanı',
            scanned_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          }
        ]
        setSavedCards(testCards)
        setLoading(false)
        return
      }
      
      const { data, error } = await supabase
        .from('scanned_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) {
        throw error
      }
      
      setSavedCards(data || [])
    } catch (err: any) {
      setError(err.message || 'Kartlar yüklenemedi')
      console.error('Load cards error:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteCard = async (cardId: string) => {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { error } = await supabase
        .from('scanned_cards')
        .delete()
        .eq('id', cardId)
      
      if (error) {
        throw error
      }
      
      setSavedCards(prev => prev.filter(card => card.id !== cardId))
    } catch (err: any) {
      setError('Silme hatası: ' + (err.message || 'Bilinmeyen hata'))
    }
  }

  const startEdit = (card: SavedCard) => {
    setEditingCard(card)
    setEditFormData({ ...card })
  }

  const cancelEdit = () => {
    setEditingCard(null)
    setEditFormData({})
    setCropMode(false)
    setCropArea({ x: 0, y: 0, width: 0, height: 0 })
  }

  const startCrop = () => {
    if (editingCard?.image_data) {
      setCropMode(true)
      // Set default crop area (60% of image)
      setTimeout(() => {
        const img = new Image()
        img.onload = () => {
          const defaultCrop = {
            x: img.width * 0.2,
            y: img.height * 0.2,
            width: img.width * 0.6,
            height: img.height * 0.6
          }
          setCropArea(defaultCrop)
        }
        img.src = editingCard.image_data!
      }, 100)
    }
  }

  const applyCrop = () => {
    if (!editingCard?.image_data || !cropArea.width || !cropArea.height) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = cropArea.width
      canvas.height = cropArea.height
      
      ctx.drawImage(
        img,
        cropArea.x, cropArea.y, cropArea.width, cropArea.height,
        0, 0, cropArea.width, cropArea.height
      )
      
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.8)
      setEditFormData(prev => ({ ...prev, image_data: croppedDataUrl }))
      setCropMode(false)
    }
    img.src = editingCard.image_data
  }

  const cancelCrop = () => {
    setCropMode(false)
    setCropArea({ x: 0, y: 0, width: 0, height: 0 })
  }

  const saveEdit = async () => {
    if (!editingCard || !editFormData) return

    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { error } = await supabase
        .from('scanned_cards')
        .update({
          name: editFormData.name,
          title: editFormData.title,
          company: editFormData.company,
          email: editFormData.email,
          phone: editFormData.phone,
          website: editFormData.website,
          location: editFormData.location,
          notes: editFormData.notes,
          image_data: editFormData.image_data,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingCard.id)
      
      if (error) {
        throw error
      }
      
      // Update local state
      setSavedCards(prev => 
        prev.map(card => 
          card.id === editingCard.id 
            ? { ...card, ...editFormData }
            : card
        )
      )
      
      cancelEdit()
    } catch (err: any) {
      setError('Güncelleme hatası: ' + (err.message || 'Bilinmeyen hata'))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const addToContacts = (card: SavedCard) => {
    try {
      // VCard format for contact
      const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${card.name}
${card.title ? `TITLE:${card.title}` : ''}
${card.company ? `ORG:${card.company}` : ''}
${card.email ? `EMAIL:${card.email}` : ''}
${card.phone ? `TEL:${card.phone}` : ''}
${card.website ? `URL:${card.website}` : ''}
${card.location ? `ADR:;;${card.location};;;;` : ''}
${card.notes ? `NOTE:${card.notes}` : ''}
END:VCARD`

      // Create downloadable .vcf file
      const blob = new Blob([vCardData], { type: 'text/vcard' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${card.name.replace(/\s+/g, '_')}.vcf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      // Show success message
      setError(null)
      alert('Kişi başarıyla indirildi! Telefon rehberinize aktarabilirsiniz.')
    } catch (err) {
      console.error('Add to contacts error:', err)
      setError('Kişi ekleme hatası. Lütfen tekrar deneyin.')
    }
  }

  const shareCard = async (card: SavedCard) => {
    try {
      const shareText = `${card.name}${card.title ? ` - ${card.title}` : ''}${card.company ? ` (${card.company})` : ''}
${card.email || ''}${card.phone ? ` • ${card.phone}` : ''}${card.website ? ` • ${card.website}` : ''}`

      if (navigator.share) {
        // Use native sharing API if available
        await navigator.share({
          title: `${card.name} - Kartvizit`,
          text: shareText,
          url: card.website || undefined
        })
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText)
        alert('Kartvizit bilgileri panoya kopyalandı!')
      }
    } catch (err) {
      console.error('Share error:', err)
      // Fallback: copy to clipboard manually
      try {
        const textArea = document.createElement('textarea')
        textArea.value = `${card.name}${card.title ? ` - ${card.title}` : ''}${card.company ? ` (${card.company})` : ''}
${card.email || ''}${card.phone ? ` • ${card.phone}` : ''}${card.website ? ` • ${card.website}` : ''}`
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('Kartvizit bilgileri panoya kopyalandı!')
      } catch (clipboardErr) {
        setError('Paylaşım hatası. Lütfen tekrar deneyin.')
      }
    }
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <Navbar />
      
      <div style={{ padding: '6rem 1rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '1rem'
            }}>
              Kayıtlı Kartvizitler
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255,255,255,0.8)'
            }}>
              Taradığınız kartvizitlerinizi buradan görüntüleyebilir, düzenleyebilir ve yönetebilirsiniz
            </p>
          </motion.div>

          {loading && (
            <div style={{
              textAlign: 'center',
              color: 'white',
              fontSize: '1.1rem',
              padding: '2rem'
            }}>
              Kartvizitler yükleniyor...
            </div>
          )}

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.2)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '0.75rem',
              padding: '1rem',
              color: '#f87171',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              {error}
            </div>
          )}

          {!loading && !error && savedCards.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.8)',
                padding: '3rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '1rem',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-white/60" />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>
                Henüz kartvizit taramadınız
              </h3>
              <p>İlk kartvizitinizi taramak için Card Scanner sayfasını ziyaret edin.</p>
            </motion.div>
          )}

          {/* Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {savedCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '1.5rem',
                  color: 'white'
                }}
              >
                {/* Card Image */}
                {card.image_data && (
                  <div style={{ marginBottom: '1rem' }}>
                    <img
                      src={card.image_data}
                      alt={card.name}
                      onClick={() => setZoomedImage(card.image_data!)}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(255,255,255,0.2)',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                )}

                {/* Card Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User className="w-4 h-4 text-blue-300" />
                    <span style={{ fontWeight: '600' }}>{card.name}</span>
                  </div>

                  {card.title && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="w-4 h-4" />
                      <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                        {card.title}
                      </span>
                    </div>
                  )}

                  {card.company && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Building2 className="w-4 h-4 text-green-300" />
                      <span style={{ fontSize: '0.9rem' }}>{card.company}</span>
                    </div>
                  )}

                  {card.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail className="w-4 h-4 text-yellow-300" />
                      <span style={{ fontSize: '0.9rem' }}>{card.email}</span>
                    </div>
                  )}

                  {card.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone className="w-4 h-4 text-purple-300" />
                      <span style={{ fontSize: '0.9rem' }}>{card.phone}</span>
                    </div>
                  )}

                  {card.website && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Globe className="w-4 h-4 text-pink-300" />
                      <span style={{ fontSize: '0.9rem' }}>{card.website}</span>
                    </div>
                  )}

                  {card.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin className="w-4 h-4 text-red-300" />
                      <span style={{ fontSize: '0.9rem' }}>{card.location}</span>
                    </div>
                  )}

                  {card.notes && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StickyNote className="w-4 h-4 text-orange-300" />
                      <span style={{ fontSize: '0.9rem' }}>{card.notes}</span>
                    </div>
                  )}

                  <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                        {formatDate(card.created_at)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                      {/* Primary Actions */}
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToContacts(card)}
                          style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            border: '1px solid #34d399',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 3px 8px rgba(16,185,129,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontWeight: '500',
                            fontSize: '0.7rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16,185,129,0.4)'
                            e.currentTarget.style.background = 'linear-gradient(135deg, #059669, #047857)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 3px 8px rgba(16,185,129,0.3)'
                            e.currentTarget.style.background = 'linear-gradient(135deg, #10b981, #059669)'
                          }}
                        >
                          <UserPlus className="w-3 h-3" />
                          Kişilere Ekle
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => shareCard(card)}
                          style={{
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            border: '1px solid #fbbf24',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 3px 8px rgba(245,158,11,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontWeight: '500',
                            fontSize: '0.7rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(245,158,11,0.4)'
                            e.currentTarget.style.background = 'linear-gradient(135deg, #d97706, #b45309)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 3px 8px rgba(245,158,11,0.3)'
                            e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)'
                          }}
                        >
                          <Share2 className="w-3 h-3" />
                          Paylaş
                        </motion.button>
                      </div>

                      {/* Secondary Actions */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => startEdit(card)}
                          style={{
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            border: '1px solid #60a5fa',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 0.6rem',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 3px 8px rgba(59,130,246,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontWeight: '500',
                            fontSize: '0.7rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59,130,246,0.4)'
                            e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb, #1e40af)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 3px 8px rgba(59,130,246,0.3)'
                            e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                          }}
                        >
                          <Edit className="w-3 h-3" />
                          Düzenle
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => deleteCard(card.id)}
                          style={{
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            border: '1px solid #f87171',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 0.6rem',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 3px 8px rgba(239,68,68,0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontWeight: '500',
                            fontSize: '0.7rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.4)'
                            e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 3px 8px rgba(239,68,68,0.3)'
                            e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)'
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                          Sil
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingCard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={cropMode ? cancelCrop : cancelEdit}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'rgba(17,24,39,0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1rem',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white' }}>
                {cropMode ? 'Resim Kırpma' : 'Kartvizit Düzenle'}
              </h3>
              <button
                onClick={cropMode ? cancelCrop : cancelEdit}
                style={{
                  color: 'rgba(255,255,255,0.6)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {cropMode && editingCard?.image_data ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ position: 'relative', background: 'rgba(0,0,0,0.5)', borderRadius: '0.5rem', padding: '1rem' }}>
                  <img
                    src={editFormData.image_data || editingCard.image_data}
                    alt="Crop"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      borderRadius: '0.5rem'
                    }}
                    onLoad={(e) => {
                      const img = e.target as HTMLImageElement
                      if (cropArea.width === 0) {
                        const defaultCrop = {
                          x: img.offsetWidth * 0.2,
                          y: img.offsetHeight * 0.2,
                          width: img.offsetWidth * 0.6,
                          height: img.offsetHeight * 0.6
                        }
                        setCropArea(defaultCrop)
                      }
                    }}
                  />
                  
                  {/* Crop overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      border: '2px dashed #60a5fa',
                      background: 'rgba(96,165,250,0.1)',
                      left: `${cropArea.x}px`,
                      top: `${cropArea.y + 16}px`,
                      width: `${cropArea.width}px`,
                      height: `${cropArea.height}px`,
                      cursor: 'move',
                      minWidth: '50px',
                      minHeight: '50px'
                    }}
                    onMouseDown={(e) => {
                      const startX = e.clientX - cropArea.x
                      const startY = e.clientY - cropArea.y
                      
                      const handleMouseMove = (e: MouseEvent) => {
                        const newX = Math.max(0, e.clientX - startX)
                        const newY = Math.max(16, e.clientY - startY)
                        setCropArea(prev => ({ ...prev, x: newX, y: newY - 16 }))
                      }
                      
                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove)
                        document.removeEventListener('mouseup', handleMouseUp)
                      }
                      
                      document.addEventListener('mousemove', handleMouseMove)
                      document.addEventListener('mouseup', handleMouseUp)
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      right: '-8px',
                      bottom: '-8px',
                      width: '16px',
                      height: '16px',
                      background: '#60a5fa',
                      cursor: 'se-resize',
                      borderRadius: '2px'
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      const startX = e.clientX
                      const startY = e.clientY
                      const startWidth = cropArea.width
                      const startHeight = cropArea.height
                      
                      const handleMouseMove = (e: MouseEvent) => {
                        const newWidth = Math.max(50, startWidth + (e.clientX - startX))
                        const newHeight = Math.max(50, startHeight + (e.clientY - startY))
                        setCropArea(prev => ({ ...prev, width: newWidth, height: newHeight }))
                      }
                      
                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove)
                        document.removeEventListener('mouseup', handleMouseUp)
                      }
                      
                      document.addEventListener('mousemove', handleMouseMove)
                      document.addEventListener('mouseup', handleMouseUp)
                    }}
                    />
                  </div>
                </div>
                
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', textAlign: 'center' }}>
                  Kırpmak istediğiniz alanı seçin. Mavi kutucuğu sürükleyerek konumunu, sağ alt köşesinden boyutunu ayarlayın.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Image section */}
                {editingCard?.image_data && (
                  <div>
                    <label style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                      Kartvizit Resmi
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={editFormData.image_data || editingCard.image_data}
                        alt="Kartvizit"
                        style={{
                          width: '80px',
                          height: '50px',
                          objectFit: 'cover',
                          borderRadius: '0.25rem',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={startCrop}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontWeight: '500',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <Crop className="w-4 h-4" />
                        Kırp
                      </motion.button>
                    </div>
                  </div>
                )}
                
                <div>
                  <label style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                    İsim *
                  </label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    placeholder="İsim giriniz"
                  />
                </div>

                <div>
                  <label style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                    Unvan
                  </label>
                  <input
                    type="text"
                    value={editFormData.title || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    placeholder="Unvan giriniz"
                  />
                </div>

                <div>
                  <label style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                    Şirket
                  </label>
                  <input
                    type="text"
                    value={editFormData.company || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, company: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    placeholder="Şirket giriniz"
                  />
                </div>

                <div>
                  <label style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    placeholder="E-posta giriniz"
                  />
                </div>

                <div>
                  <label style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    placeholder="Telefon giriniz"
                  />
                </div>

                <div>
                  <label style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                    Website
                  </label>
                  <input
                    type="url"
                    value={editFormData.website || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, website: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    placeholder="Website giriniz"
                  />
                </div>

                <div>
                  <label style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                    Adres
                  </label>
                  <input
                    type="text"
                    value={editFormData.location || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '0.9rem'
                    }}
                    placeholder="Adres giriniz"
                  />
                </div>

                <div>
                  <label style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                    Notlar
                  </label>
                  <textarea
                    value={editFormData.notes || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontSize: '0.9rem',
                      resize: 'vertical'
                    }}
                    placeholder="Notlar giriniz"
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              {cropMode ? (
                <>
                  <button
                    onClick={applyCrop}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Check className="w-4 h-4" />
                    Kırpmayı Uygula
                  </button>
                  
                  <button
                    onClick={cancelCrop}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'rgba(107,114,128,0.2)',
                      color: '#9ca3af',
                      border: '1px solid rgba(107,114,128,0.3)',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    İptal
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={saveEdit}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'linear-gradient(to right, #22c55e, #16a34a)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Save className="w-4 h-4" />
                    Kaydet
                  </button>
                  
                  <button
                    onClick={cancelEdit}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'rgba(107,114,128,0.2)',
                      color: '#9ca3af',
                      border: '1px solid rgba(107,114,128,0.3)',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    İptal
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomedImage(null)}
              style={{
                position: 'absolute',
                top: '-3rem',
                right: '0',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '2.5rem',
                height: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              <X className="w-5 h-5" />
            </button>
            
            <img
              src={zoomedImage}
              alt="Kartvizit"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                borderRadius: '0.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}