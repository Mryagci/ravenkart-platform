'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, Cookie, Lock } from 'lucide-react'

export default function KVKKConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('kvkk-consent')
    if (!hasConsent) {
      // Small delay to ensure page is loaded
      setTimeout(() => {
        setShowConsent(true)
        setIsLoading(false)
      }, 1000)
    } else {
      setIsLoading(false)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('kvkk-consent', 'true')
    localStorage.setItem('kvkk-consent-date', new Date().toISOString())
    setShowConsent(false)
  }

  const handleDecline = () => {
    localStorage.setItem('kvkk-consent', 'false')
    localStorage.setItem('kvkk-consent-date', new Date().toISOString())
    setShowConsent(false)
    // Optionally redirect to another page or show limited functionality
  }

  if (isLoading || !showConsent) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="relative max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Gizlilik ve Çerezler</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
              <p className="font-semibold text-gray-800">
                Kişisel Verilerin Korunması Kanunu (KVKK) Bilgilendirmesi
              </p>
              
              <p>
                Ravenkart olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında 
                kişisel verilerinizi işlediğimizi bildiririz.
              </p>

              <div className="bg-blue-50 rounded-lg p-4 space-y-2 mb-3">
                <p className="font-semibold text-blue-800 text-sm">İşlenen Kişisel Veriler:</p>
                <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                  <li>Ad, soyad, e-posta, telefon numarası</li>
                  <li>Kartvizit bilgileri ve görselleri</li>
                  <li>IP adresi, tarayıcı bilgileri</li>
                  <li>Site kullanım verileri ve analitikler</li>
                </ul>
                
                <p className="font-semibold text-blue-800 text-sm mt-3">İşleme Amaçları:</p>
                <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                  <li>Dijital kartvizit hizmeti sunma</li>
                  <li>Kullanıcı deneyimi iyileştirme</li>
                  <li>Güvenlik ve teknik destek</li>
                  <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Cookie className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-800">Çerezler</p>
                    <p className="text-sm">
                      Daha iyi hizmet verebilmek için çerezler kullanıyoruz. 
                      Site deneyiminizi iyileştirmek ve analitik veriler toplamak amacıyla.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-800">Veri Güvenliği</p>
                    <p className="text-sm">
                      Kişisel verileriniz güvenli sunucularda saklanır ve 
                      üçüncü kişilerle paylaşılmaz.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-3 mb-3">
                <p className="font-semibold text-green-800 text-sm">KVKK Haklarınız:</p>
                <p className="text-xs text-green-700 mt-1">
                  Bilgi talep etme, düzeltme, silme, işleme itiraz etme, 
                  veri taşınabilirliği ve şikayette bulunma haklarınız bulunmaktadır.
                </p>
              </div>

              <p className="text-xs text-gray-600">
                Detaylı bilgi için{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Gizlilik Politikamızı
                </a>{' '}
                inceleyebilir, sorularınız için{' '}
                <a href="mailto:info@ravenkart.com" className="text-blue-600 hover:underline">
                  info@ravenkart.com
                </a>{' '}
                adresinden iletişime geçebilirsiniz.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDecline}
                className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Reddet
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity font-medium shadow-lg"
              >
                Kabul Ediyorum
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}