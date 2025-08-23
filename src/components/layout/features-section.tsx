'use client'

import { motion } from 'framer-motion'
import { QrCode, Smartphone, Users, TrendingUp, Share2, Zap, Shield, Globe } from 'lucide-react'

const features = [
  {
    icon: QrCode,
    title: "QR Kod & NFC",
    description: "Anında paylaşım için QR kod ve NFC desteği",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Smartphone,
    title: "Mobil Uyumlu",
    description: "Her cihazda mükemmel görünüm",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Users,
    title: "Takım Yönetimi",
    description: "Organizasyon için toplu yönetim",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: TrendingUp,
    title: "Detaylı Analitik",
    description: "Görüntülenme ve etkileşim istatistikleri",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: Share2,
    title: "Sosyal Entegrasyon",
    description: "Tüm sosyal medya platformları",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: Zap,
    title: "Hızlı Güncelleme",
    description: "Anında bilgi güncellemeleri",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: Shield,
    title: "Güvenlik",
    description: "Verileriniz güvende",
    gradient: "from-gray-600 to-gray-800"
  },
  {
    icon: Globe,
    title: "Global Erişim",
    description: "Dünyanın her yerinden erişim",
    gradient: "from-teal-500 to-cyan-500"
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Neden Ravenkart?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Modern dijital kartvizit çözümü ile işinizi bir üst seviyeye taşıyın
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 h-full">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}