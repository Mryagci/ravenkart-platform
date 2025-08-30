'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { BarChart3, Eye, Users, Calendar, Clock, Smartphone, Monitor, Tablet, ArrowLeft, TrendingUp, Activity, MapPin, Globe } from 'lucide-react'
import Navbar from '@/components/layout/navbar'

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
  scans: Array<{
    id: string
    scanned_at: string
    ip_address: string
    user_agent: string
    referrer: string | null
  }>
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [cardId, setCardId] = useState<string | null>(null)

  useEffect(() => {
    loadUser()
  }, [])

  useEffect(() => {
    if (user && cardId) {
      loadAnalytics()
    }
  }, [user, cardId])

  const loadUser = async () => {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }

      setUser(user)
      
      // Get user's card ID
      const { data: cards } = await supabase
        .from('cards')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)

      if (cards && cards.length > 0) {
        setCardId(cards[0].id)
      }

    } catch (error) {
      console.error('User load error:', error)
      router.push('/auth')
    }
  }

  const loadAnalytics = async () => {
    if (!cardId) return

    try {
      const response = await fetch(`/api/qr-analytics?cardId=${cardId}`)
      const data = await response.json()
      
      if (response.ok) {
        setAnalyticsData(data)
      } else {
        console.error('Analytics load error:', data.error)
      }
    } catch (error) {
      console.error('Analytics fetch error:', error)
    } finally {
      setLoading(false)
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

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'Mobil': return <Smartphone className="w-5 h-5" />
      case 'Tablet': return <Tablet className="w-5 h-5" />
      case 'Masaüstü': return <Monitor className="w-5 h-5" />
      default: return <Globe className="w-5 h-5" />
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
        <div className="text-white text-xl">Analitikler yükleniyor...</div>
      </div>
    )
  }

  if (!analyticsData) {
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
          <Activity className="w-16 h-16 text-white/60 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Henüz analitik verisi yok</h1>
          <p className="text-white/70 mb-6">QR kodunuz tarandığında veriler burada görünecek</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
          >
            Dashboard'a Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #111827 0%, #7c3aed 25%, #ec4899 50%, #3730a3 75%, #111827 100%)'
    }}>
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="p-2 bg-white/10 backdrop-blur-sm rounded-xl text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Analitik Dashboard</h1>
            <p className="text-white/70">QR kod tarama istatistikleriniz</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-8 h-8 text-blue-400" />
              <h3 className="font-semibold text-white">Toplam Tarama</h3>
            </div>
            <p className="text-3xl font-bold text-white">{analyticsData.totalScans}</p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-green-400" />
              <h3 className="font-semibold text-white">Bugün</h3>
            </div>
            <p className="text-3xl font-bold text-white">{analyticsData.todayScans}</p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <h3 className="font-semibold text-white">Bu Ay</h3>
            </div>
            <p className="text-3xl font-bold text-white">{analyticsData.monthlyScans}</p>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-pink-400" />
              <h3 className="font-semibold text-white">Eşsiz Ziyaretçi</h3>
            </div>
            <p className="text-3xl font-bold text-white">{analyticsData.uniqueVisitors}</p>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Device Stats */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Cihaz Dağılımı
            </h3>
            <div className="space-y-3">
              {Object.entries(analyticsData.deviceStats).map(([device, count]) => (
                <div key={device} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/80">
                    {getDeviceIcon(device)}
                    <span>{device}</span>
                  </div>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Stats */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Haftalık Dağılım
            </h3>
            <div className="space-y-3">
              {Object.entries(analyticsData.weeklyStats).map(([day, count]) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-white/80">{day}</span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Scans */}
        <motion.div
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6" />
            Son Taramalar
          </h3>
          
          {analyticsData.scans.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {analyticsData.scans.slice(0, 20).map((scan, index) => (
                <div key={scan.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div>
                      <p className="text-white font-medium">{formatDate(scan.scanned_at)}</p>
                      <p className="text-white/60 text-sm">IP: {scan.ip_address}</p>
                    </div>
                  </div>
                  <MapPin className="w-4 h-4 text-white/40" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/60 text-center py-8">Henüz tarama yapılmamış</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}