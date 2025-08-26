'use client'

import { motion } from 'framer-motion'
import { RefreshCw, Shield, AlertCircle, CheckCircle, Mail, Calendar } from 'lucide-react'

export default function RefundPage() {
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
            <RefreshCw className="w-12 h-12 text-ravenkart-primary" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              <span className="bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary bg-clip-text text-transparent">
                Para İade Politikası
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
            
            {/* Main Policy Notice */}
            <section>
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-8">
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">🛡️ Para ve İade Politikası</h2>
                    <p className="text-gray-300 leading-relaxed text-lg mb-4">
                      Her bir Ravenkart dijital kartviziti, size özel olarak tasarlanır ve kişisel bilgilerinizle üretilir. 
                      Bu nedenle, <strong className="text-orange-300">sipariş onaylandıktan sonra iade veya değişim yapılmamaktadır.</strong>
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      Ancak biz buradayız! Ürünle ilgili herhangi bir sorun, şikayet ya da geri bildiriminiz olursa 
                      bizimle iletişime geçmekten lütfen çekinmeyin. Amacımız her zaman sizin memnuniyetinizdir.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Why No Refunds */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-ravenkart-primary" />
                Neden İade Yapılmıyor?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-blue-400 font-bold">1</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Kişiselleştirme</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Her dijital kartvizit, adınız, iletişim bilgileriniz ve tercihlerinizle özel olarak oluşturulur. 
                    Bu kişisel bilgiler başka kimse tarafından kullanılamaz.
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-purple-400 font-bold">2</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Dijital Ürün</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Dijital kartvizitler fiziksel bir ürün değildir. Hesabınıza tanımlandıktan sonra 
                    hemen kullanıma hazır hale gelir ve geri alınamaz.
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-green-400 font-bold">3</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Anında Aktivasyon</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Ödemeniz onaylandığı anda kartvizitiniz aktif hale gelir ve QR kodunuz oluşturulur. 
                    Bu işlem geri alınamaz.
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-red-400 font-bold">4</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Hizmet Maliyeti</h3>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Sistem altyapısı, hosting, güvenlik ve teknik destek maliyetleri 
                    hizmeti kullanmaya başladığınız anda devreye girer.
                  </p>
                </div>
              </div>
            </section>

            {/* Exceptional Cases */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">İstisna Durumlar</h2>
              
              <div className="bg-white/5 rounded-xl p-6 space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  Aşağıdaki özel durumlarda iade değerlendirilebilir:
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-green-300 font-semibold mb-1">Teknik Ariza</h3>
                      <p className="text-gray-300 text-sm">
                        Sistemimizden kaynaklanan teknik bir problem nedeniyle hizmetinizi kullanamıyorsanız, 
                        tam iade yapılabilir.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-blue-300 font-semibold mb-1">Ödeme Hatası</h3>
                      <p className="text-gray-300 text-sm">
                        Kredi kartınızdan yanlışlıkla birden fazla tahsilat yapılmışsa, 
                        fazla ödenen tutar derhal iade edilir.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-purple-300 font-semibold mb-1">Hizmet Kesintisi</h3>
                      <p className="text-gray-300 text-sm">
                        7 günden uzun süren hizmet kesintisi durumunda, 
                        abonelik süresi uzatılır veya kısmi iade yapılabilir.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-yellow-200 text-sm">
                      <strong>Not:</strong> İstisna durumlar için müşteri hizmetlerimizle iletişime geçmeniz 
                      ve durumunuzu detaylı olarak açıklamanız gerekmektedir.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Subscription Refunds */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Abonelik İadeleri</h2>
              
              <div className="bg-white/5 rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-ravenkart-primary rounded-full"></span>
                      Aylık Abonelik
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Aylık aboneliklerde 7 gün deneme süresi</li>
                      <li>• İlk 24 saat içinde tam iade mümkün</li>
                      <li>• Sonrasında bir sonraki döneme kadar hizmet devam eder</li>
                      <li>• Otomatik yenileme istediğiniz zaman iptal edilebilir</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-ravenkart-secondary rounded-full"></span>
                      Yıllık Abonelik
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• İlk 30 gün içinde kısmi iade değerlendirilebilir</li>
                      <li>• Kullanılmayan aylar için hesaplama yapılır</li>
                      <li>• Minimum 3 aylık kullanım bedeli kesilir</li>
                      <li>• İdari işlem bedeli (%10) düşülebilir</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="text-blue-300 font-semibold mb-2">İade Süreci</h4>
                  <p className="text-gray-300 text-sm">
                    Abonelik iade talepleri için müşteri hizmetleriyle iletişime geçin. 
                    İade onaylandıktan sonra 5-10 iş günü içinde hesabınıza geçer.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Bize Ulaşın</h2>
              
              <div className="bg-gradient-to-r from-ravenkart-primary/10 to-ravenkart-secondary/10 border border-ravenkart-primary/20 rounded-xl p-8">
                <div className="text-center">
                  <Mail className="w-12 h-12 text-ravenkart-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">Sorularınız mı var?</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Ürünle ilgili herhangi bir sorun, şikayet ya da geri bildiriminiz olursa 
                    bizimle iletişime geçmekten lütfen çekinmeyin.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3 text-gray-300">
                      <Mail className="w-5 h-5 text-ravenkart-primary" />
                      <span className="text-lg">ravenkart.tr@gmail.com</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                      <motion.a
                        href="mailto:ravenkart.tr@gmail.com"
                        className="bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        E-posta Gönder
                      </motion.a>
                      
                      <motion.a
                        href="/contact"
                        className="bg-white/10 hover:bg-white/15 text-white px-8 py-3 rounded-lg font-semibold border border-white/20 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        İletişim Sayfası
                      </motion.a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Thank You Note */}
            <section>
              <div className="text-center py-8">
                <p className="text-gray-400 leading-relaxed">
                  Anlayışınız ve güveniniz için teşekkür ederiz.
                </p>
                <p className="text-ravenkart-primary font-semibold mt-2">
                  – Ravenkart Ekibi
                </p>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  )
}