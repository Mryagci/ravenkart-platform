'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@supabase/supabase-js'
import { BarChart3, Eye, Users, Smartphone, Clock, Calendar, TrendingUp, ArrowLeft } from 'lucide-react'

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
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-${color}-50 to-${color}-100 p-6 rounded-xl border border-${color}-200`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`bg-${color}-500 p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )

  const BarChart = ({ data, title }: { data: { [key: string]: number }, title: string }) => {
    const maxValue = Math.max(...Object.values(data))
    
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-20 text-right">{key}:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full flex items-center justify-end pr-2"
                >
                  <span className="text-white text-xs font-medium">{value}</span>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    )
  }

  if (!cards.length) {
    return (
      <div className="min-h-screen gradient-bg p-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 text-center"
          >
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Henüz Kartvizit Yok
            </h1>
            <p className="text-gray-600 mb-6">
              Analitik verilerini görüntülemek için önce bir kartvizit oluşturmanız gerekiyor.
            </p>
            <button
              onClick={() => router.push('/create-card')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold"
            >
              İlk Kartvizitin Oluştur
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg p-4">
      <div className="container mx-auto max-w-6xl">
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
          className="bg-white rounded-xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold mb-4">Kartvizit Seç</h2>
          <select
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Kartvizit seçiniz...</option>
            {cards.map(card => (
              <option key={card.id} value={card.id}>
                {card.name} {card.title ? `- ${card.title}` : ''} {card.company ? `(${card.company})` : ''}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Analytics İçeriği */}
        {selectedCard && (
          <div className="space-y-8">
            {fetchingAnalytics ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Analitik verileri yükleniyor...</p>
              </div>
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
                  className="bg-white rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">📋 Son Taramalar</h3>
                  <div className="space-y-3">
                    {analytics.scans.slice(0, 10).map((scan, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">
                            {new Date(scan.scanned_at).toLocaleDateString('tr-TR')} - {' '}
                            {new Date(scan.scanned_at).toLocaleTimeString('tr-TR')}
                          </p>
                          <p className="text-xs text-gray-500">
                            IP: {scan.ip_address || 'Bilinmeyen'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {scan.user_agent?.includes('Mobile') ? '📱 Mobil' : 
                             scan.user_agent?.includes('Tablet') ? '📱 Tablet' : '💻 Masaüstü'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {analytics.scans.length === 0 && (
                      <p className="text-gray-500 text-center py-8">
                        Henüz tarama yapılmamış
                      </p>
                    )}
                  </div>
                </motion.div>
              </>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-gray-600">Analitik verileri yüklenemedi</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}