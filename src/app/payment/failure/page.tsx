'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react'
import Navbar from '@/components/layout/navbar'

export default function PaymentFailure() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/pricing')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const failureReasons = [
    'Kartınızda yeterli bakiye bulunmuyor olabilir',
    'Kart bilgileri hatalı girilmiş olabilir',
    'Bankanız işlemi güvenlik nedeniyle reddetmiş olabilir',
    'İnternet bağlantınızda kesinti yaşanmış olabilir',
    'İşlem zaman aşımına uğramış olabilir'
  ]

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-screen pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8 max-w-2xl mx-auto px-4"
        >
          {/* Failure Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.2, 
              type: "spring", 
              stiffness: 200 
            }}
            className="relative"
          >
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-2xl">
              <XCircle className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          {/* Failure Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Ödeme Başarısız 😔
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Üzgünüz, ödemeniz tamamlanamadı.
              <br />
              Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın.
            </p>
          </motion.div>

          {/* Possible Reasons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6" />
              Olası Nedenler
            </h2>
            <div className="space-y-3 text-left">
              {failureReasons.map((reason, index) => (
                <motion.div
                  key={reason}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                  className="flex items-start space-x-3 text-white/90"
                >
                  <span className="text-red-400 mt-1">•</span>
                  <span>{reason}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Support Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-blue-500/20 backdrop-blur-md rounded-2xl p-6 border border-blue-400/30"
          >
            <h3 className="text-xl font-semibold text-white mb-3">
              💡 Yardım Gerekiyor mu?
            </h3>
            <p className="text-white/80 mb-4">
              Sorun devam ederse bizimle iletişime geçin. 
              7/24 destek ekibimiz size yardımcı olmaya hazır!
            </p>
            <div className="text-white/70 space-y-1">
              <p>📧 Email: destek@ravenkart.com</p>
              <p>💬 WhatsApp: +90 555 123 45 67</p>
            </div>
          </motion.div>

          {/* Countdown and Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="text-white/70">
              <p className="mb-2">Fiyatlandırma sayfasına yönlendiriliyorsunuz...</p>
              <div className="text-2xl font-bold text-white">
                {countdown}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => router.push('/pricing')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Tekrar Dene
                </span>
              </motion.button>

              <motion.button
                onClick={() => router.push('/')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-2xl hover:border-white/60 transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  Ana Sayfa
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}