'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, User, Building2, Mail, Phone, Globe, MapPin, Calendar, StickyNote, Trash2 } from 'lucide-react'
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
        throw new Error('Kullanıcı oturumu bulunamadı')
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
              Taradığınız kartvizitlerinizi buradan görüntüleyebilir ve yönetebilirsiniz
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
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
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
                    borderTop: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                        {formatDate(card.created_at)}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => deleteCard(card.id)}
                      style={{
                        background: 'rgba(239,68,68,0.2)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        color: '#f87171',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.3)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}