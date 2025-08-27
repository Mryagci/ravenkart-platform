'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Check, Crown, Users, Star, Zap, Shield } from 'lucide-react'
import Navbar from '@/components/layout/navbar'

export default function Pricing() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

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

  const plans = [
    {
      name: 'Kişisel',
      description: 'Bireysel kullanıcılar için ideal',
      icon: Crown,
      monthlyPrice: 3,
      yearlyPrice: 2.5,
      features: [
        'Tek dijital kartvizit',
        'QR kod oluşturma',
        'Sosyal medya entegrasyonu',
        'Fotoğraf galerisi',
        'Temel analitikler',
        '24/7 destek'
      ],
      popular: false,
      color: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Takım (5+ Kişi)',
      description: 'Ekipler ve küçük işletmeler için',
      icon: Users,
      monthlyPrice: 2.5,
      yearlyPrice: 2,
      features: [
        'Sınırsız dijital kartvizit',
        'QR kod oluşturma',
        'Sosyal medya entegrasyonu',
        'Fotoğraf galerisi',
        'Gelişmiş analitikler',
        'Takım yönetimi',
        'Özel tasarım seçenekleri',
        'Öncelikli destek'
      ],
      popular: true,
      color: 'from-teal-500 to-emerald-600'
    }
  ]

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!user) {
      router.push('/auth?mode=register')
      return
    }

    try {
      setLoading(true)

      // Map plan names to API format
      let planType = 'personal'
      if (plan.name === 'Kişisel') planType = 'personal'
      else if (plan.name === 'Takım (5+ Kişi)') planType = 'professional'
      else planType = 'enterprise'

      // Send payment initiation request
      const response = await fetch('/api/paytr/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.id
        },
        body: JSON.stringify({
          planType: planType,
          billingCycle: billingCycle,
          userEmail: user.email,
          userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Kullanıcı',
          userPhone: user.user_metadata?.phone || undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ödeme başlatılamadı')
      }

      // Redirect to PayTR payment page
      if (data.iframeUrl) {
        window.location.href = data.iframeUrl
      } else if (data.paymentToken) {
        window.location.href = `https://www.paytr.com/odeme/guvenli/${data.paymentToken}`
      } else {
        throw new Error('Ödeme URL\'si alınamadı')
      }

    } catch (error) {
      console.error('Payment error:', error)
      alert('Ödeme başlatılırken hata oluştu: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <div className="pt-16 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
              Dijital Kartvizitinizin Gücünü
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
                Keşfedin
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
              Profesyonel dijital kartvizitinizi oluşturun ve iş ağınızı genişletin. 
              Ücretsiz deneme ile başlayın, istediğiniz zaman iptal edin.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8 md:mb-12">
              <div className="glass-card p-1.5 md:p-2">
                <div className="flex items-center gap-2 md:gap-4">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 text-sm md:text-base ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-gray-900 shadow-lg'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Aylık
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-300 flex items-center gap-1 md:gap-2 text-sm md:text-base ${
                      billingCycle === 'yearly'
                        ? 'bg-white text-gray-900 shadow-lg'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Yıllık
                    <span className="bg-green-500 text-white text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                      %17 İndirim
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`glass-card p-4 md:p-8 ${
                  plan.popular ? 'ring-2 ring-cyan-400/50 shadow-2xl shadow-cyan-400/25' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-cyan-400 to-orange-400 text-white px-3 md:px-6 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold flex items-center gap-1 md:gap-2">
                      <Star className="w-3 md:w-4 h-3 md:h-4" />
                      En Popüler
                    </div>
                  </div>
                )}

                <div className="text-center mb-4 md:mb-8">
                  <div className={`inline-flex p-3 md:p-4 rounded-2xl bg-gradient-to-r ${plan.color} mb-3 md:mb-4`}>
                    <plan.icon className="w-6 md:w-8 h-6 md:h-8 text-white" />
                  </div>
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2">{plan.name}</h3>
                  <p className="text-white/70 mb-3 md:mb-6 text-sm md:text-base">{plan.description}</p>
                  
                  <div className="mb-4 md:mb-6">
                    <div className="flex items-baseline justify-center gap-1 md:gap-2">
                      <span className="text-3xl md:text-5xl font-bold text-white">
                        ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                      <span className="text-white/70 text-sm md:text-base">
                        /ay
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-green-400 text-xs md:text-sm mt-1 md:mt-2">
                        Yıllık ödemede ${(plan.monthlyPrice - plan.yearlyPrice) * 12} tasarruf!
                      </p>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 md:space-y-4 mb-4 md:mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 md:gap-3">
                      <div className="flex-shrink-0 w-5 md:w-6 h-5 md:h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Check className="w-3 md:w-4 h-3 md:h-4 text-green-400" />
                      </div>
                      <span className="text-white/90 text-sm md:text-base">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-semibold text-white transition-all duration-300 text-sm md:text-base ${
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {user ? 'Planı Seç' : 'Ücretsiz Başla'}
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 md:mt-20 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Sıkça Sorulan Sorular</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
              <div className="glass-card p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-3">
                  Ücretsiz deneme süresi var mı?
                </h3>
                <p className="text-white/70 text-sm md:text-base">
                  Evet! 7 gün ücretsiz deneme ile tüm özellikleri test edebilirsiniz. 
                  Kredi kartı bilgisi gerekmez.
                </p>
              </div>
              <div className="glass-card p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-3">
                  İstediğim zaman iptal edebilir miyim?
                </h3>
                <p className="text-white/70 text-sm md:text-base">
                  Tabii ki! Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. 
                  Gizli ücret veya ceza yoktur.
                </p>
              </div>
              <div className="glass-card p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-3">
                  QR kodları gerçekten çalışıyor mu?
                </h3>
                <p className="text-white/70 text-sm md:text-base">
                  Evet! QR kodlarımız vCard formatında gerçek iletişim bilgileri içerir 
                  ve tüm modern cihazlarda çalışır.
                </p>
              </div>
              <div className="glass-card p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-white mb-2 md:mb-3">
                  Takım planında kaç kişi olabilir?
                </h3>
                <p className="text-white/70 text-sm md:text-base">
                  Takım planı minimum 5 kişi içindir. Daha büyük ekipler için 
                  özel fiyatlandırma sunuyoruz.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 md:mt-16 text-center"
          >
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-white/60">
              <div className="flex items-center gap-2">
                <Shield className="w-4 md:w-5 h-4 md:h-5" />
                <span className="text-sm md:text-base">SSL Güvenlik</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 md:w-5 h-4 md:h-5" />
                <span className="text-sm md:text-base">99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 md:w-5 h-4 md:h-5" />
                <span className="text-sm md:text-base">10,000+ Mutlu Kullanıcı</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}