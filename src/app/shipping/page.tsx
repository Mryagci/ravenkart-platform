'use client'

import { motion } from 'framer-motion'
import { Truck, Clock, Package, MapPin, Calendar, AlertTriangle, CheckCircle, Globe } from 'lucide-react'

export default function ShippingPage() {
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
          <div className="flex justify-center items-center gap-3 mb-6">
            <Truck className="w-12 h-12 text-ravenkart-primary" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              <span className="bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary bg-clip-text text-transparent">
                Kargo Politikası
              </span>
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <p>Son güncelleme: 26 Ağustos 2025</p>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 space-y-8">
            
            {/* Introduction */}
            <section>
              <div className="bg-gradient-to-r from-ravenkart-primary/10 to-ravenkart-secondary/10 border border-ravenkart-primary/20 rounded-xl p-8 text-center">
                <Truck className="w-16 h-16 text-ravenkart-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-4">🚚 Kargo Politikası</h2>
                <p className="text-gray-300 leading-relaxed">
                  Ravenkart olarak her bir siparişi özenle, sizin için özel olarak üretiyoruz. 
                  Aşağıda kargo süreciyle ilgili temel bilgileri bulabilirsiniz.
                </p>
              </div>
            </section>

            {/* Important Notice */}
            <section>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Package className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">Dijital Ürün Bildirimi</h3>
                    <p className="text-gray-300 text-sm">
                      <strong>Not:</strong> Ravenkart dijital kartvizitler fiziksel teslimat gerektirmeyen dijital ürünlerdir. 
                      Bu sayfa gelecekteki fiziksel ürünlerimiz (NFC kartlar, aksesuarlar) için hazırlanmıştır.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Delivery Time */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-ravenkart-primary" />
                ⏳ Kargo Süresi
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Dijital Ürünler</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Anında teslimat (ödeme onayı sonrası)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>E-posta ile erişim bilgileri gönderimi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>24/7 hesabınızdan erişim</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Truck className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Fiziksel Ürünler</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>5 iş günü içerisinde kargoya verme</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>Özel üretim süreci (kişiselleştirme)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Nadiren yaşanabilecek gecikmelerde anlayışınıza sığınıyoruz</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Shipping Info */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-ravenkart-primary" />
                📦 Kargo Bilgisi
              </h2>
              
              <div className="bg-white/5 rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Kargo Hazırlama</h3>
                    <p className="text-gray-300 text-sm">
                      Siparişiniz kargoya verildiğinde size takip numarası e-posta ile iletilir
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">2</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Takip</h3>
                    <p className="text-gray-300 text-sm">
                      Kargo firmasının sisteminden paketinizi takip edebilirsiniz
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">3</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Teslimat</h3>
                    <p className="text-gray-300 text-sm">
                      Teslim süresi adresinize ve kargo firmasının yoğunluğuna bağlıdır
                    </p>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-6">
                  <p className="text-blue-200 text-sm">
                    <strong>Bilgi:</strong> Kargo takip numaranızı e-posta ve SMS ile alacaksınız. 
                    Spam klasörünüzü kontrol etmeyi unutmayın!
                  </p>
                </div>
              </div>
            </section>

            {/* Delivery Area */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-ravenkart-primary" />
                📍 Teslimat Alanı
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-300">Mevcut Teslimat</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    Şu anda yalnızca <strong>Türkiye içi teslimat</strong> yapılmaktadır.
                  </p>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Tüm il ve ilçelere teslimat</li>
                    <li>• Kargo bedeli sipariş tutarına dahil</li>
                    <li>• Ücretsiz kargo (99₺ üzeri siparişler)</li>
                    <li>• Aynı gün kargo (İstanbul için)</li>
                  </ul>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Globe className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-300">Gelecek Planlar</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    <strong>Yakında yurt dışı gönderim</strong> seçeneğimiz de aktif hale gelecektir.
                  </p>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Avrupa ülkeleri (2025 sonu)</li>
                    <li>• Kuzey Amerika (2026 başı)</li>
                    <li>• Diğer kıtalar (2026 ortası)</li>
                    <li>• Express teslimat seçenekleri</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Shipping Damage */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                🛡️ Kargo Hasarları
              </h2>
              
              <div className="bg-white/5 rounded-xl p-6 space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  Paketinizin güvenliği bizim için çok önemlidir. Kargo hasarları konusunda aşağıdaki adımları izleyin:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Teslimat Anında</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">1.</span>
                        <span>Paketi kargo görevlisi önünde kontrol edin</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">2.</span>
                        <span>Hasar tespit ederseniz teslim almayın</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">3.</span>
                        <span>Kargo görevlisiyle birlikte tutanak tuttururun</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">4.</span>
                        <span>Hasarlı paketin fotoğrafını çekin</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Sonraki Adımlar</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>24 saat içinde bizimle iletişime geçin</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Hasar fotoğraflarını e-posta ile gönderin</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Tutanak varsa taratıp gönderin</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Yeni ürün ücretsiz olarak gönderilir</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-red-300 font-semibold mb-2">Önemli Uyarı</h4>
                      <p className="text-red-200 text-sm">
                        Hasarlı paketi teslim aldıktan sonra hasar bildiriminiz kargo firması 
                        tarafından kabul edilmeyebilir. Mutlaka teslimat anında kontrol edin!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Customer Service */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Müşteri Hizmetleri</h2>
              
              <div className="bg-gradient-to-r from-ravenkart-primary/10 to-ravenkart-secondary/10 border border-ravenkart-primary/20 rounded-xl p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Sizlere En Hızlı ve Güvenli Şekilde Hizmet</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Ürünlerinizi size ulaştırmak için çalışıyoruz. Sorularınız için bizimle her zaman iletişime geçebilirsiniz.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <motion.a
                      href="mailto:ravenkart.tr@gmail.com?subject=Kargo%20Sorusu"
                      className="bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Package className="w-5 h-5" />
                      Kargo Desteği
                    </motion.a>
                    
                    <motion.a
                      href="/contact"
                      className="bg-white/10 hover:bg-white/15 text-white px-8 py-3 rounded-lg font-semibold border border-white/20 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Genel İletişim
                    </motion.a>
                  </div>

                  <div className="mt-6 text-sm text-gray-400">
                    <p>💌 E-posta: ravenkart.tr@gmail.com</p>
                    <p>⏰ Yanıt süresi: 2-6 saat (çalışma saatleri içinde)</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  )
}