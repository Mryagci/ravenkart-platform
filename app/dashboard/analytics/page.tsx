'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'
import { BarChart3, Eye, Users, Smartphone, Clock, Calendar, TrendingUp, ArrowLeft, CreditCard } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface AnalyticsData {
  totalScans: number
  todayScans: number
  recentScans: number
  monthlyScans: number
  uniqueVisitors: number
  dailyStats: { [key: string]: number }
  deviceStats: { [key: string]: number }
  hourlyStats: { [key: string]: number }
  weeklyStats: { [key: string]: number }
  scans: any[]
}

interface Card {
  id: string
  name: string
  title?: string
  company?: string
  is_active: boolean
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchingAnalytics, setFetchingAnalytics] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (selectedCard) {
      fetchAnalytics(selectedCard)
    }
  }, [selectedCard])

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth?mode=login')
        return
      }
      setUser(user)
      await fetchUserCards(user.id)
    } catch (error) {
      console.error('Auth kontrol hatası:', error)
      router.push('/auth?mode=login')
    } finally {
      setLoading(false)
    }
  }

  async function fetchUserCards(userId: string) {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('id, name, title, company, is_active')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Kartlar alınamadı:', error)
        return
      }

      setCards(data || [])
      if (data && data.length > 0) {
        setSelectedCard(data[0].id)
      }
    } catch (error) {
      console.error('Kartlar yüklenirken hata:', error)
    }
  }

  async function fetchAnalytics(cardId: string) {
    if (!cardId) return
    
    setFetchingAnalytics(true)
    try {
      const response = await fetch(`/api/qr-analytics?cardId=${cardId}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        console.error('Analytics alınamadı')
      }
    } catch (error) {
      console.error('Analytics fetch hatası:', error)
    } finally {
      setFetchingAnalytics(false)
    }
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = "blue",
    subtitle 
  }: {
    title: string
    value: number | string
    icon: any
    color?: string
    subtitle?: string
  }) => {
    const gradientMap = {
      blue: 'from-blue-500 to-cyan-400',
      green: 'from-green-500 to-emerald-400', 
      purple: 'from-purple-500 to-pink-400',
      orange: 'from-orange-500 to-yellow-400'
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.2 }}
        className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:border-white/30 cursor-pointer relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium mb-2">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {subtitle && (
              <p className="text-white/50 text-xs mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`bg-gradient-to-r ${gradientMap[color as keyof typeof gradientMap]} p-3 rounded-lg shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </motion.div>
    )
  }

  const BarChart = ({ data, title }: { data: { [key: string]: number }, title: string }) => {
    const maxValue = Math.max(...Object.values(data))
    
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20"
      >
        <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
          {title}
        </h3>
        <div className="space-y-4">
          {Object.entries(data).map(([key, value], index) => (
            <div key={key} className="flex items-center gap-4">
              <span className="text-sm text-white/70 w-24 text-right font-medium">{key}:</span>
              <div className="flex-1 bg-white/10 rounded-full h-8 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 h-full rounded-full flex items-center justify-end pr-3 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                  <span className="text-white text-xs font-bold relative z-10">{value}</span>
                </motion.div>
              </div>
            </div>
          ))}
          {Object.keys(data).length === 0 && (
            <div className="text-center py-8">
              <div className="text-white/50 text-sm">Veri bulunmuyor</div>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #111827 0%, #7c3aed 25%, #ec4899 50%, #3730a3 75%, #111827 100%)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full"
            />
          </div>
          <div className="text-white text-xl font-medium">Analytics Yükleniyor...</div>
          <div className="text-white/60 text-sm mt-2">Veriler hazırlanıyor</div>
        </motion.div>
      </div>
    )
  }

  if (!cards.length) {
    return (
      <div 
        className="min-h-screen p-4"
        style={{
          background: 'linear-gradient(135deg, #111827 0%, #7c3aed 25%, #ec4899 50%, #3730a3 75%, #111827 100%)'
        }}
      >
        <div className="container mx-auto max-w-4xl flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <BarChart3 className="w-20 h-20 text-white/60 mx-auto mb-6" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-4">
              📊 Henüz Kartvizit Yok
            </h1>
            <p className="text-white/70 mb-8 text-lg">
              Analitik verilerini görüntülemek için önce bir kartvizit oluşturmanız gerekiyor.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/create-card')}
              className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-violet-500/25 transition-all duration-300"
            >
              🚀 İlk Kartvizitin Oluştur
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen p-4"
      style={{
        background: 'linear-gradient(135deg, #111827 0%, #7c3aed 25%, #ec4899 50%, #3730a3 75%, #111827 100%)'
      }}
    >
      {/* Floating animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-teal-400/20 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 15, 0],
            x: [0, 20, -10, 0],
            opacity: [0.3, 0.8, 0.5, 0.3],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-48 h-48 bg-violet-700/20 rounded-full blur-xl"
          animate={{
            y: [0, 25, -15, 0],
            x: [0, -20, 30, 0],
            opacity: [0.2, 0.6, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        />
        <motion.div
          className="absolute top-1/2 left-3/4 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl"
          animate={{
            y: [0, 20, -10, 0],
            x: [0, -15, 25, 0],
            opacity: [0.2, 0.7, 0.3, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
      </div>
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Dashboard'a Dön
          </button>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            📊 Kartvizit Analitiği
          </h1>
          <p className="text-white/70">
            Kartvizitinizin performansını detaylı şekilde inceleyin
          </p>
        </motion.div>

        {/* Kartvizit Seçici */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20"
        >
          <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            📋 Kartvizit Seç
          </h2>
          <select
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
            className="w-full p-4 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white backdrop-blur-sm"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white'
            }}
          >
            <option value="" style={{ background: '#1f2937', color: 'white' }}>📊 Kartvizit seçiniz...</option>
            {cards.map(card => (
              <option key={card.id} value={card.id} style={{ background: '#1f2937', color: 'white' }}>
                👤 {card.name} {card.title ? `- ${card.title}` : ''} {card.company ? `(${card.company})` : ''}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Analytics İçeriği */}
        {selectedCard && (
          <div className="space-y-8">
            {fetchingAnalytics ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-12 text-center border border-white/20"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-flex items-center justify-center w-12 h-12 border-3 border-white/30 border-t-white rounded-full mx-auto mb-6"
                />
                <p className="text-white text-lg font-medium mb-2">📊 Analitik Verileri Yükleniyor...</p>
                <p className="text-white/60 text-sm">Lütfen bekleyin</p>
              </motion.div>
            ) : analytics ? (
              <>
                {/* Ana İstatistikler */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    title="Toplam Görüntülenme"
                    value={analytics.totalScans}
                    icon={Eye}
                    color="blue"
                    subtitle="Tüm zamanlar"
                  />
                  <StatCard
                    title="Bugünkü Görüntülenmeler"
                    value={analytics.todayScans}
                    icon={TrendingUp}
                    color="green"
                    subtitle="Son 24 saat"
                  />
                  <StatCard
                    title="Eşsiz Ziyaretçi"
                    value={analytics.uniqueVisitors}
                    icon={Users}
                    color="purple"
                    subtitle="IP tabanlı"
                  />
                  <StatCard
                    title="Aylık Görüntülenme"
                    value={analytics.monthlyScans}
                    icon={Calendar}
                    color="orange"
                    subtitle="Son 30 gün"
                  />
                </div>

                {/* Grafikler */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <BarChart 
                    data={analytics.deviceStats} 
                    title="📱 Cihaz Türleri"
                  />
                  <BarChart 
                    data={analytics.weeklyStats} 
                    title="📅 Haftalık Dağılım"
                  />
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <BarChart 
                    data={analytics.hourlyStats} 
                    title="🕐 Saatlik Dağılım (0-23)"
                  />
                </div>

                {/* Son Taramalar */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
                >
                  <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    📋 Son Taramalar
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {analytics.scans.slice(0, 10).map((scan, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium mb-1">
                            📅 {new Date(scan.scanned_at).toLocaleDateString('tr-TR')} - {' '}
                            🕐 {new Date(scan.scanned_at).toLocaleTimeString('tr-TR')}
                          </p>
                          <p className="text-xs text-white/60">
                            🌐 IP: {scan.ip_address || 'Bilinmeyen'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-violet-500/20 to-pink-500/20 rounded-full border border-white/20">
                            <span className="text-xs text-white font-medium">
                              {scan.user_agent?.includes('Mobile') ? '📱 Mobil' : 
                               scan.user_agent?.includes('Tablet') ? '📱 Tablet' : '💻 Masaüstü'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {analytics.scans.length === 0 && (
                      <div className="text-center py-12">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Eye className="w-12 h-12 text-white/30 mx-auto mb-3" />
                        </motion.div>
                        <p className="text-white/50 text-sm">
                          Henüz tarama yapılmamış
                        </p>
                        <p className="text-white/30 text-xs mt-1">
                          QR kodunuz tarandığında burada görünecek
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-12 text-center border border-white/20"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <BarChart3 className="w-16 h-16 text-white/40 mx-auto mb-6" />
                </motion.div>
                <p className="text-white text-lg font-medium mb-2">❌ Analitik Verileri Yüklenemedi</p>
                <p className="text-white/60 text-sm mb-6">Bağlantıda bir sorun var</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectedCard && fetchAnalytics(selectedCard)}
                  className="px-6 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                >
                  🔄 Tekrar Dene
                </motion.button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}