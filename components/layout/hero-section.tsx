'use client'

import { motion } from 'framer-motion'
import { QrCode, Smartphone, Users, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const HeroSection = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
      setUser(user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateCard = () => {
    if (user) {
      router.push('/create-card');
    } else {
      router.push('/auth?mode=register');
    }
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #111827 0%, #7c3aed 25%, #ec4899 50%, #3730a3 75%, #111827 100%)'
      }}
    >
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Floating elements */}
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
        </div>

        <div className="container mx-auto px-4 text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Main heading */}
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              RAVENKART
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Dijital Kimlik Platformu
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Geleneksel kartvizitleri geride bırakın. QR kod ve NFC ile paylaşılabilen, 
              her zaman güncel dijital kartvizitinizi yaratın.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {/* Modern animated buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-2xl">
                <motion.button
                  onClick={handleCreateCard}
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  <span className="relative z-10 flex items-center justify-center gap-2 text-base sm:text-lg">
                    <QrCode className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span className="text-center">Dijital Kartvizitini Oluştur</span>
                  </span>
                </motion.button>
                
                <motion.button
                  onClick={() => router.push('/dashboard')}
                  className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  <span className="relative z-10 flex items-center justify-center gap-2 text-base sm:text-lg">
                    <Users className="w-4 sm:w-5 h-4 sm:h-5" />
                    Kartvizitim
                  </span>
                </motion.button>
              </div>
            </motion.div>

            {/* Feature cards */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {[
                { icon: QrCode, title: "QR & NFC", desc: "Anında paylaşım", color: "text-cyan-300" },
                { icon: Smartphone, title: "Mobil Uyumlu", desc: "Her cihazda mükemmel", color: "text-blue-300" },
                { icon: Users, title: "Takım Yönetimi", desc: "Organizasyon desteği", color: "text-purple-300" },
                { icon: TrendingUp, title: "Analitik", desc: "Detaylı istatistikler", color: "text-pink-300" }
              ].map((feature, index) => {
                return (
                <motion.div
                  key={feature.title}
                  className="glass-card rounded-lg md:rounded-xl p-4 md:p-6 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.8 + index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className={`w-6 md:w-8 h-6 md:h-8 mx-auto mb-2 md:mb-3 ${feature.color} group-hover:text-white transition-colors duration-300`} />
                    </motion.div>
                    <h3 className="font-semibold mb-1 md:mb-2 text-white group-hover:text-cyan-100 transition-colors duration-300 text-sm md:text-base">{feature.title}</h3>
                    <p className="text-xs md:text-sm text-gray-300 group-hover:text-gray-100 transition-colors duration-300">{feature.desc}</p>
                  </div>
                </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
            <div className="w-1 h-3 bg-white/50 rounded-full mx-auto animate-pulse" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HeroSection