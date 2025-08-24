'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
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
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      paddingTop: '4rem'
    }}>
      {/* Animated gradient background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, #334155 0%, #7c3aed 15%, #ec4899 35%, #3730a3 55%, #be185d 75%, #1e293b 100%)',
        opacity: 0.9
      }} />
      
      {/* Floating elements */}
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'}}>
        <motion.div
          style={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '8rem',
            height: '8rem',
            background: 'rgba(20,184,166,0.25)',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }}
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
          className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-rose-600/18 rounded-full blur-2xl"
          animate={{
            x: [0, 40, -25, 0],
            y: [0, -20, 35, 0],
            opacity: [0.15, 0.45, 0.3, 0.15],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-28 h-28 bg-orange-600/22 rounded-full blur-lg"
          animate={{
            x: [0, -35, 20, 0],
            y: [0, 40, -30, 0],
            opacity: [0.25, 0.7, 0.4, 0.25],
            scale: [0.8, 1.3, 0.9, 0.8],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4.2
          }}
        />
      </div>

      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        textAlign: 'center',
        color: 'white'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{maxWidth: '64rem', margin: '0 auto'}}
        >
          {/* Main heading */}
          <motion.h1 
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              background: 'linear-gradient(to right, white, #d1d5db)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1.1'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            RAVENKART
            <br />
            <span style={{
              background: 'linear-gradient(to right, #67e8f9, #fde047, #fdba74)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Dijital Kimlik Platformu
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            style={{
              fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
              marginBottom: '2rem',
              color: '#e5e7eb',
              maxWidth: '42rem',
              margin: '0 auto 2rem',
              lineHeight: '1.6'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Geleneksel kartvizitleri geride bırakın. QR kod ve NFC ile paylaşılabilen, 
            her zaman güncel dijital kartvizitinizi yaratın.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '4rem'
            }}
            className="sm:flex-row"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Modern animated buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.button
                onClick={handleCreateCard}
                className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-2xl shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                <span className="relative z-10 flex items-center gap-2 text-lg">
                  <QrCode className="w-5 h-5" />
                  Dijital Kartvizitini Oluştur
                </span>
              </motion.button>
              
              <motion.button
                onClick={() => router.push('/dashboard')}
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                <span className="relative z-10 flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5" />
                  Kartvizitim
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Feature cards */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              { icon: QrCode, title: "QR & NFC", desc: "Anında paylaşım" },
              { icon: Smartphone, title: "Mobil Uyumlu", desc: "Her cihazda mükemmel" },
              { icon: Users, title: "Takım Yönetimi", desc: "Organizasyon desteği" },
              { icon: TrendingUp, title: "Analitik", desc: "Detaylı istatistikler" }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass-effect rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <feature.icon className="w-8 h-8 mx-auto mb-3 text-blue-300" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
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
    </section>
  )
}

export default HeroSection