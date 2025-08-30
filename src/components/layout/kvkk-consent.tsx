'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cookie, ChevronUp, Shield } from 'lucide-react'

export default function KVKKConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('kvkk-consent')
    if (!hasConsent) {
      // Small delay to ensure page is loaded
      setTimeout(() => {
        setShowConsent(true)
        setIsLoading(false)
      }, 2000)
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
  }

  if (isLoading || !showConsent) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-black/20 to-black/10 backdrop-blur-sm">
              {/* Compact View */}
              <div className="px-6 py-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    <div className="p-3 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-white/20">
                      <Cookie className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-semibold text-base md:text-lg mb-1">
                        Gizlilik ve Çerez Politikası
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        Deneyiminizi geliştirmek için çerezler ve KVKK kapsamında kişisel veriler kullanırız.{' '}
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="text-white/90 hover:text-white underline decoration-white/40 hover:decoration-white transition-colors inline-flex items-center gap-1 font-medium"
                        >
                          Detayları görüntüle
                          <ChevronUp 
                            className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                          />
                        </button>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={handleDecline}
                      className="px-5 py-2.5 text-sm font-medium text-white/80 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                    >
                      Reddet
                    </button>
                    <button
                      onClick={handleAccept}
                      className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-500 hover:via-purple-500 hover:to-pink-500 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Kabul Ediyorum
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 border-t border-white/20 mt-5">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-xl">
                                <Shield className="w-4 h-4 text-white" />
                              </div>
                              <h4 className="font-semibold text-white">KVKK Bilgilendirmesi</h4>
                            </div>
                            <div className="space-y-3 text-sm text-white/80">
                              <p>
                                6698 sayılı KVKK kapsamında işlenen verileriniz:
                              </p>
                              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <ul className="space-y-2 text-xs">
                                  <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-violet-400 rounded-full"></div>
                                    İsim, e-posta, telefon bilgileri
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                    Kartvizit görselleri ve içerikleri
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
                                    IP adresi ve tarayıcı verileri
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                                    Site kullanım analitikleri
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-green-600/20 rounded-xl">
                                <Shield className="w-4 h-4 text-white" />
                              </div>
                              <h4 className="font-semibold text-white">Haklarınız</h4>
                            </div>
                            <div className="space-y-3 text-sm text-white/80">
                              <p>
                                KVKK kapsamında sahip olduğunuz haklar:
                              </p>
                              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <p className="text-xs leading-relaxed mb-3">
                                  Verilerinize erişim, düzeltme, silme, işlemeye itiraz etme, 
                                  veri taşınabilirliği ve şikayette bulunma haklarınız mevcuttur.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  <a 
                                    href="/privacy" 
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/90 hover:text-white text-xs rounded-lg transition-colors border border-white/20"
                                  >
                                    Gizlilik Politikası
                                  </a>
                                  <a 
                                    href="mailto:info@ravenkart.com" 
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/90 hover:text-white text-xs rounded-lg transition-colors border border-white/20"
                                  >
                                    İletişim
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}