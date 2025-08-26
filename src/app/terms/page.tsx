'use client'

import { motion } from 'framer-motion'
import { FileText, Calendar, CheckCircle, AlertCircle } from 'lucide-react'

export default function TermsPage() {
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
            <FileText className="w-12 h-12 text-ravenkart-primary" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              <span className="bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary bg-clip-text text-transparent">
                Hizmet Şartları
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
              <p className="text-gray-300 leading-relaxed">
                Bu web sitesi Ravenkart tarafından işletilmektedir. Dijital kartvizit platformumuzu kullanarak, 
                aşağıda belirtilen tüm şartları kabul etmiş sayılırsınız. Lütfen bu şartları dikkatlice okuyunuz.
              </p>
            </section>

            {/* Products and Services */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-ravenkart-primary" />
                Ürünler ve Hizmetler
              </h2>
              <div className="bg-white/5 rounded-lg p-6 space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Ravenkart, kişiye özel tasarlanmış NFC özellikli dijital kartvizitler ve ilgili hizmetler sunar. 
                  Her ürün, müşterinin verdiği bilgiler doğrultusunda özel olarak üretilir.
                </p>
                
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-yellow-200 text-sm">
                      <strong>Önemli:</strong> Sipariş onaylandıktan sonra ürün üzerinde değişiklik yapılamaz. 
                      Dijital kartvizitler kişiselleştirilmiş ürünler olduğu için özellikle dikkatli olunmalıdır.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Dijital Kartvizit Özellikleri</h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• NFC teknolojisi ile paylaşım</li>
                      <li>• QR kod ile hızlı erişim</li>
                      <li>• Sosyal medya entegrasyonu</li>
                      <li>• İletişim bilgisi otomatik kayıt</li>
                      <li>• Analitik ve istatistik takibi</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Abonelik Planları</h3>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• Temel Plan: Standart özellikler</li>
                      <li>• Profesyonel Plan: Gelişmiş analitik</li>
                      <li>• Kurumsal Plan: Özel çözümler</li>
                      <li>• Aylık veya yıllık ödeme seçenekleri</li>
                      <li>• İstediğiniz zaman plan değişikliği</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Order Process */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Sipariş Süreci</h2>
              <div className="bg-white/5 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-ravenkart-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Bilgi Girişi</h3>
                    <p className="text-gray-300 text-sm">
                      Kartvizitinizde yer alacak tüm bilgileri doğru bir şekilde girin
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-ravenkart-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Ödeme</h3>
                    <p className="text-gray-300 text-sm">
                      Güvenli ödeme sistemi ile ödemenizi gerçekleştirin
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-ravenkart-primary rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Aktivasyon</h3>
                    <p className="text-gray-300 text-sm">
                      Dijital kartvizitiniz otomatik olarak aktif hale gelir
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-200 text-sm">
                    <strong>Dikkat:</strong> Sipariş sırasında verilen bilgilerin doğruluğundan alıcı sorumludur. 
                    Yanlış ya da eksik bilgi verilmesi durumunda Ravenkart sorumluluk kabul etmez.
                  </p>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Kullanıcı Sorumlulukları</h2>
              <div className="bg-white/5 rounded-lg p-6">
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    Paylaştığınız tüm bilgilerin doğru ve güncel olmasını sağlamak
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    Hesap güvenliğinizi korumak ve şifrenizi güvende tutmak
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    Telif hakkı ihlali olmayan içerik ve görseller kullanmak
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    Platformu yasal olmayan amaçlar için kullanmamak
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    Diğer kullanıcıların haklarına saygı göstermek
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    Abonelik ödemelerini zamanında yapmak
                  </li>
                </ul>
              </div>
            </section>

            {/* Service Delivery */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Hizmet Sunumu</h2>
              <div className="bg-white/5 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Aktivasyon Süresi</h3>
                  <p className="text-gray-300">
                    Dijital kartvizitler, ödeme onaylandıktan sonra 24 saat içerisinde aktif hale getirilir. 
                    Özel durumlar için müşteri hizmetlerimizle iletişime geçebilirsiniz.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Hizmet Sürekliliği</h3>
                  <p className="text-gray-300">
                    %99.9 uptime hedefiyle hizmet veriyoruz. Planlı bakım çalışmaları önceden duyurulur. 
                    Beklenmeyen kesintiler durumunda en kısa sürede bilgilendirme yapılır.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Teknik Destek</h3>
                  <p className="text-gray-300">
                    Hafta içi 09:00-18:00 saatleri arasında e-posta ve telefon ile teknik destek sağlanır. 
                    Acil durumlar için 7/24 e-posta desteği mevcuttur.
                  </p>
                </div>
              </div>
            </section>

            {/* Cancellation and Refunds */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">İptal ve İade</h2>
              <div className="bg-white/5 rounded-lg p-6 space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-orange-200 font-semibold mb-2">Önemli İade Politikası</h3>
                      <p className="text-orange-200 text-sm">
                        Dijital kartvizitler kişiye özel ürünlerdir ve aktivasyon sonrası iade edilemez. 
                        Abonelik hizmetleri için ayrı iade politikası geçerlidir.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Abonelik İptali</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• İstediğiniz zaman aboneliğinizi iptal edebilirsiniz</li>
                    <li>• İptal işlemi bir sonraki faturalandırma döneminden itibaren geçerlidir</li>
                    <li>• Mevcut dönem sonuna kadar hizmetlere erişim devam eder</li>
                    <li>• İptal edilen hizmetler için kısmi iade yapılmaz</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Özel Durumlar</h3>
                  <p className="text-gray-300">
                    Teknik hatalar veya hizmet sağlayıcı kaynaklı sorunlar durumunda iade değerlendirilebilir. 
                    Bu durumlar için müşteri hizmetleriyle iletişime geçmeniz gerekmektedir.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Sorumluluk Sınırları</h2>
              <div className="bg-white/5 rounded-lg p-6 space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Ravenkart, hizmet kalitesini korumak için gerekli tüm önlemleri alır ancak aşağıdaki durumlardan 
                  sorumlu tutulamaz:
                </p>
                
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    Kullanıcı hatası sonucu oluşan veri kayıpları
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    Üçüncü taraf hizmetlerden kaynaklanan kesintiler
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    Force majeure (doğal afet, savaş vb.) durumları
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    Kullanıcının telif hakkı ihlali yapan içerikleri
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 mt-1">•</span>
                    Yanlış veya eksik bilgi verilerek oluşturulan problemler
                  </li>
                </ul>
              </div>
            </section>

            {/* Legal Framework */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Hukuki Çerçeve</h2>
              <div className="bg-white/5 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Uygulanacak Hukuk</h3>
                  <p className="text-gray-300">
                    Bu hizmet şartları Türkiye Cumhuriyeti yasalarına tabidir. Tüm ticari işlemler 
                    Türk Ticaret Kanunu kapsamında gerçekleştirilir.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Uyuşmazlık Çözümü</h3>
                  <p className="text-gray-300">
                    Olası uyuşmazlıkların çözümünde öncelikle müzakere yolu denenir. 
                    Anlaşma sağlanamadığı durumda Ankara Tüketici Hakem Heyetleri ve Mahkemeleri yetkilidir.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Değişiklikler</h3>
                  <p className="text-gray-300">
                    Ravenkart, bu şartları değiştirme hakkını saklı tutar. Önemli değişiklikler 
                    e-posta ile bildirilir ve 30 gün sonra yürürlüğe girer.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">İletişim</h2>
              <div className="bg-white/5 rounded-lg p-6">
                <p className="text-gray-300 mb-4">
                  Bu hizmet şartları hakkında sorularınız için bizimle iletişime geçebilirsiniz:
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-ravenkart-primary">E-posta:</span>
                    <span>ravenkart.tr@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="text-ravenkart-primary">Çalışma Saatleri:</span>
                    <span>Hafta içi 09:00-18:00</span>
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