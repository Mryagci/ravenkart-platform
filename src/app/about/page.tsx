'use client'

import { motion } from 'framer-motion'
import { Heart, Users, Target, Lightbulb, Rocket, Star, Award, Calendar, Mail } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary bg-clip-text text-transparent">
              Hakkımızda
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Dijital dünyada kartvizit devrimini başlatan baba-oğul girişimi
          </p>
        </motion.div>

        {/* Our Story */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Heart className="w-8 h-8 text-ravenkart-primary" />
              <h2 className="text-3xl font-bold text-white">Hikayemiz</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-ravenkart-primary/10 to-ravenkart-secondary/10 border border-ravenkart-primary/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-ravenkart-primary" />
                    <h3 className="text-xl font-semibold text-white">2025: Başlangıç</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Ravenkart, 2025 yılında bir baba-oğul girişimi olarak hayata geçti. Geleneksel kartvizitlerin 
                    sınırlarını aştığımız bu yolculukta, iki neslin deneyimi ve vizyonu birleşti.
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-semibold text-white">Baba-Oğul Gücü</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Tecrübe ile inovasyonun buluştuğu noktada, farklı kuşakların güçlü yanlarını birleştirerek 
                    dijital kartvizit dünyasında yeni bir sayfa açtık.
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Rocket className="w-6 h-6 text-green-400" />
                    <h3 className="text-xl font-semibold text-white">Start-up Ruhu</h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Küçük bir start-up olarak başladığımız bu yolculukta, her müşterimizin memnuniyeti bizim için 
                    en büyük başarı kriteri. Büyük hayalleri gerçeğe dönüştürmek için buradayız.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-8 text-center">
                  <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">Misyonumuz</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Her profesyonelin dijital dünyada güçlü bir kimlik oluşturmasına yardımcı olmak. 
                    Geleneksel kartvizitlerin ötesinde, etkileşimli ve akıllı networking çözümleri sunmak.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-8 text-center">
                  <Target className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">Vizyonumuz</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Türkiye'nin lider dijital kartvizit platformu olarak, dünya genelinde tanınan bir marka haline gelmek. 
                    İnovatif teknolojilerle networking deneyimini kökten değiştirmek.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Our Values */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Award className="w-8 h-8 text-ravenkart-primary" />
              Değerlerimiz
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Bizi biz yapan temel değerler ve ilkeler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Müşteri Odaklılık</h3>
              <p className="text-gray-300 text-sm">
                Her karar verirken müşterilerimizin ihtiyaçlarını ve memnuniyetini öncelikle düşünürüz.
              </p>
            </motion.div>

            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">İnovasyon</h3>
              <p className="text-gray-300 text-sm">
                Teknolojinin gücüyle sürekli yenilik yaparak sektöre öncülük ediyoruz.
              </p>
            </motion.div>

            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Aile Ruhu</h3>
              <p className="text-gray-300 text-sm">
                Baba-oğul girişimimizin temelindeki aile sıcaklığını tüm süreçlerimize yansıtırız.
              </p>
            </motion.div>

            <motion.div
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Kalite</h3>
              <p className="text-gray-300 text-sm">
                Sunduğumuz her hizmette mükemmelliği hedefleyen titiz bir yaklaşım benimseriz.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Why Digital Business Cards */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <Rocket className="w-8 h-8 text-ravenkart-primary" />
                Neden Dijital Kartvizit?
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Geleceğin networking çözümü bugünden size sunuyoruz
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">🌱</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Çevre Dostu</h3>
                <p className="text-gray-300 text-sm">
                  Kağıt tasarrufu yaparak çevreyi koruyun. Binlerce kartvizit yerine tek bir dijital çözüm.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Anında Paylaşım</h3>
                <p className="text-gray-300 text-sm">
                  QR kod ile saniyeler içinde bilgilerinizi paylaşın. Mesafe tanımayan networking.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Analitik Veriler</h3>
                <p className="text-gray-300 text-sm">
                  Kartvizitinizin ne kadar görüntülendiğini ve etkileşim aldığını takip edin.
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">🔄</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Güncel Bilgiler</h3>
                <p className="text-gray-300 text-sm">
                  İletişim bilgileriniz değiştiğinde anında güncelleyin. Eski kartvizitler tarih oluyor.
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">💰</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Maliyet Tasarrufu</h3>
                <p className="text-gray-300 text-sm">
                  Sürekli kartvizit bastırma maliyetinden kurtulun. Tek seferlik yatırım, uzun vadeli çözüm.
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white font-bold">🎨</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">Kişiselleştirme</h3>
                <p className="text-gray-300 text-sm">
                  Markanızı yansıtan, tamamen size özel tasarımlar. Sınırsız özelleştirme imkanı.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Our Journey */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <Calendar className="w-8 h-8 text-ravenkart-primary" />
                Yolculuğumuz
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Küçük bir fikirden başlayan büyük hayallerimiz
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-ravenkart-primary to-ravenkart-secondary rounded-full"></div>
              
              <div className="space-y-12">
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex-1 text-right pr-8">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-2">2025 Q1 - Başlangıç</h3>
                      <p className="text-gray-300 text-sm">
                        Baba-oğul girişimi olarak Ravenkart'ı kurduk. İlk dijital kartvizit prototiplerimizi geliştirdik.
                      </p>
                    </div>
                  </div>
                  <div className="relative z-10 w-4 h-4 bg-ravenkart-primary rounded-full border-4 border-gray-900"></div>
                  <div className="flex-1 pl-8"></div>
                </motion.div>

                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex-1 pr-8"></div>
                  <div className="relative z-10 w-4 h-4 bg-ravenkart-secondary rounded-full border-4 border-gray-900"></div>
                  <div className="flex-1 text-left pl-8">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-2">2025 Q2 - Platform Lansmanı</h3>
                      <p className="text-gray-300 text-sm">
                        Beta versiyonumuzu yayınladık ve ilk kullanıcılarımızdan değerli geri bildirimler aldık.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex-1 text-right pr-8">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-2">2025 Q3 - Büyüme</h3>
                      <p className="text-gray-300 text-sm">
                        Kullanıcı tabanımızı genişlettik ve yeni özellikler ekledik. Analitik sistem devreye girdi.
                      </p>
                    </div>
                  </div>
                  <div className="relative z-10 w-4 h-4 bg-green-500 rounded-full border-4 border-gray-900"></div>
                  <div className="flex-1 pl-8"></div>
                </motion.div>

                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="flex-1 pr-8"></div>
                  <div className="relative z-10 w-4 h-4 bg-yellow-500 rounded-full border-4 border-gray-900"></div>
                  <div className="flex-1 text-left pl-8">
                    <div className="bg-gradient-to-r from-ravenkart-primary/10 to-ravenkart-secondary/10 border border-ravenkart-primary/20 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Gelecek - Büyük Hedefler</h3>
                      <p className="text-gray-300 text-sm">
                        Türkiye'nin en büyük dijital kartvizit platformu olmak ve uluslararası pazara açılmak.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="bg-gradient-to-r from-ravenkart-primary/10 to-ravenkart-secondary/10 border border-ravenkart-primary/20 rounded-2xl p-8 text-center">
            <Mail className="w-16 h-16 text-ravenkart-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Bizimle İletişime Geçin</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Sorularınız, önerileriniz veya iş birliği teklifleriniz için bize ulaşın. 
              Ravenkart ailesinin bir parçası olmak ister misiniz?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href="mailto:ravenkart.tr@gmail.com?subject=Hakkımızda%20Sayfasından%20İletişim"
                className="bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5" />
                E-posta Gönder
              </motion.a>
              
              <motion.a
                href="/contact"
                className="bg-white/10 hover:bg-white/15 text-white px-8 py-4 rounded-lg font-semibold border border-white/20 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                İletişim Sayfası
              </motion.a>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                ravenkart.tr@gmail.com • Ankara, Türkiye
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}