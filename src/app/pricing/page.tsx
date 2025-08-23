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

  const handleSubscribe = (plan: typeof plans[0]) => {
    if (!user) {
      router.push('/auth?mode=register')
      return
    }
    
    // Here you would integrate with a payment provider like Stripe
    alert(`${plan.name} planına abone olma işlevi yakında eklenecek!`)
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-white mb-6">
              Dijital Kartvizitinizin Gücünü
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
                Keşfedin
              </span>
            </h1>
            <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
              Profesyonel dijital kartvizitinizi oluşturun ve iş ağınızı genişletin. 
              Ücretsiz deneme ile başlayın, istediğiniz zaman iptal edin.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-3 rounded-xl transition-all duration-300 ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-gray-900 shadow-lg'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Aylık
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                      billingCycle === 'yearly'
                        ? 'bg-white text-gray-900 shadow-lg'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Yıllık
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      %17 İndirim
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 ${
                  plan.popular ? 'ring-2 ring-cyan-400/50 shadow-2xl shadow-cyan-400/25' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-cyan-400 to-orange-400 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      En Popüler
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${plan.color} mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/70 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold text-white">
                        ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                      <span className="text-white/70">
                        /{billingCycle === 'monthly' ? 'ay' : 'yıl'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-green-400 text-sm mt-2">
                        Yıllık ödemede ${(plan.monthlyPrice - plan.yearlyPrice) * 12} tasarruf!
                      </p>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full py-4 rounded-2xl font-semibold text-white transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-400 to-orange-400 hover:shadow-lg hover:shadow-cyan-400/25'
                      : 'bg-white/20 hover:bg-white/30 border border-white/30'
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
            className="mt-20 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Sıkça Sorulan Sorular</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Ücretsiz deneme süresi var mı?
                </h3>
                <p className="text-white/70">
                  Evet! 7 gün ücretsiz deneme ile tüm özellikleri test edebilirsiniz. 
                  Kredi kartı bilgisi gerekmez.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3">
                  İstediğim zaman iptal edebilir miyim?
                </h3>
                <p className="text-white/70">
                  Tabii ki! Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. 
                  Gizli ücret veya ceza yoktur.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3">
                  QR kodları gerçekten çalışıyor mu?
                </h3>
                <p className="text-white/70">
                  Evet! QR kodlarımız vCard formatında gerçek iletişim bilgileri içerir 
                  ve tüm modern cihazlarda çalışır.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Takım planında kaç kişi olabilir?
                </h3>
                <p className="text-white/70">
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
            className="mt-16 text-center"
          >
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/60">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>SSL Güvenlik</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>10,000+ Mutlu Kullanıcı</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}