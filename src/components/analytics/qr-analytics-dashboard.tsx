'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Calendar, 
  MapPin, 
  Smartphone, 
  Clock, 
  RefreshCw, 
  Download,
  ExternalLink
} from 'lucide-react'

interface QRAnalyticsData {
  totalScans: number
  todayScans: number
  recentScans: number
  scans: Array<{
    id: string
    scanned_at: string
    ip_address: string
    user_agent: string
    referrer?: string
  }>
}

interface QRAnalyticsDashboardProps {
  cardId: string
  className?: string
}

export default function QRAnalyticsDashboard({ cardId, className = '' }: QRAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<QRAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/qr-analytics?cardId=${cardId}`)
      
      if (!response.ok) {
        throw new Error('Analytics verileri yüklenemedi')
      }

      const data = await response.json()
      setAnalytics(data)
      setError('')
    } catch (err) {
      console.error('Analytics fetch error:', err)
      setError('Analytics verileri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (cardId) {
      fetchAnalytics()
    }
  }, [cardId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDeviceType = (userAgent: string) => {
    if (/mobile/i.test(userAgent)) return 'Mobil'
    if (/tablet/i.test(userAgent)) return 'Tablet'
    return 'Masaüstü'
  }

  const getBrowser = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Diğer'
  }

  if (loading) {
    return (
      <div className={`bg-white/10 backdrop-blur-md rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="w-6 h-6 animate-spin text-white/60" />
          <span className="ml-2 text-white/80">Analytics yükleniyor...</span>
        </div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className={`bg-white/10 backdrop-blur-md rounded-xl p-6 ${className}`}>
        <div className="text-center text-white/60">
          <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>{error || 'Analytics verileri bulunamadı'}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-2 px-3 py-1 bg-white/20 text-white/80 rounded text-sm hover:bg-white/30 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Ana İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Toplam Tarama</p>
              <p className="text-2xl font-bold text-white">{analytics.totalScans}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-md rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Bugün</p>
              <p className="text-2xl font-bold text-white">{analytics.todayScans}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-md rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Son 7 Gün</p>
              <p className="text-2xl font-bold text-white">{analytics.recentScans}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-400" />
          </div>
        </motion.div>
      </div>

      {/* Son Taramalar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20"
      >
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Son Taramalar
            </h3>
            <button
              onClick={fetchAnalytics}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 text-white/80 rounded-lg hover:bg-white/30 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Yenile
            </button>
          </div>
        </div>

        <div className="p-6">
          {analytics.scans.length === 0 ? (
            <div className="text-center text-white/60 py-8">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Henüz QR kod taraması yapılmamış</p>
              <p className="text-sm mt-1">QR kodunuzu paylaşmaya başlayın!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {analytics.scans.slice(0, 10).map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-white/70" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {formatDate(scan.scanned_at)}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {scan.ip_address}
                        </span>
                        <span className="flex items-center gap-1">
                          <Smartphone className="w-3 h-3" />
                          {getDeviceType(scan.user_agent)}
                        </span>
                        <span>{getBrowser(scan.user_agent)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {scan.referrer && (
                    <div className="text-right">
                      <a
                        href={scan.referrer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white text-sm flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Kaynak
                      </a>
                    </div>
                  )}
                </div>
              ))}

              {analytics.scans.length > 10 && (
                <div className="text-center pt-4">
                  <p className="text-white/60 text-sm">
                    ve {analytics.scans.length - 10} tarama daha...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Export Button */}
      {analytics.scans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <button
            onClick={() => {
              const csv = [
                'Tarih,IP Adres,Cihaz,Tarayıcı,Referrer',
                ...analytics.scans.map(scan => [
                  formatDate(scan.scanned_at),
                  scan.ip_address,
                  getDeviceType(scan.user_agent),
                  getBrowser(scan.user_agent),
                  scan.referrer || '-'
                ].join(','))
              ].join('\\n')
              
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `qr-analytics-${cardId}.csv`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white hover:bg-white/30 rounded-xl transition-colors"
          >
            <Download className="w-5 h-5" />
            CSV Olarak İndir
          </button>
        </motion.div>
      )}
    </div>
  )
}