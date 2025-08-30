'use client'

import { motion } from 'framer-motion'
import { Cookie, Settings, Eye, Shield, Calendar, BarChart } from 'lucide-react'

export default function CookiesPage() {
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
            <Cookie className="w-12 h-12 text-ravenkart-primary" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              <span className="bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary bg-clip-text text-transparent">
                Çerez Politikası
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
              <p className="text-gray-300 leading-relaxed text-lg">
                Bu Çerez Politikası, Ravenkart dijital kartvizit platformu olarak web sitemizde hangi çerezleri kullandığımızı, 
                bunları neden kullandığımızı ve çerez tercihlerinizi nasıl yönetebileceğinizi açıklamaktadır.
              </p>
            </section>

            {/* What are Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Cookie className="w-6 h-6 text-ravenkart-primary" />
                Çerezler Nedir?
              </h2>
              
              <div className="bg-white/5 rounded-xl p-6 space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınızda saklanan küçük metin dosyalarıdır. 
                  Bu dosyalar, web sitesinin size daha iyi bir kullanıcı deneyimi sunmasına yardımcı olur.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h3 className="text-blue-300 font-semibold mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Güvenli
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Çerezler zararlı değildir ve kişisel bilgilerinizi içermez. Sadece site kullanımını kolaylaştırır.
                    </p>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h3 className="text-green-300 font-semibold mb-2 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Kontrol Edilebilir
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Tarayıcınızdan istediğiniz zaman çerezleri silebilir veya engelleyebilirsiniz.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookie Types */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Kullandığımız Çerez Türleri</h2>
              
              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Zorunlu Çerezler</h3>
                      <p className="text-gray-300 mb-3">
                        Web sitesinin temel işlevlerini yerine getirmesi için gerekli çerezler. 
                        Bu çerezler devre dışı bırakılamaz.
                      </p>
                      <div className="bg-red-500/10 rounded-lg p-3">
                        <h4 className="text-red-300 font-semibold text-sm mb-1">Kullanım Alanları:</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Oturum yönetimi ve güvenlik</li>
                          <li>• Form gönderimi ve veri korunması</li>
                          <li>• Temel site işlevselliği</li>
                          <li>• Kullanıcı tercihlerini hatırlama</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Analitik Çerezler</h3>
                      <p className="text-gray-300 mb-3">
                        Web sitesi kullanımını anlamamıza ve geliştirebilmemize yardımcı olan çerezler. 
                        Kişisel bilgilerinizi içermez.
                      </p>
                      <div className="bg-blue-500/10 rounded-lg p-3">
                        <h4 className="text-blue-300 font-semibold text-sm mb-1">Kullanım Alanları:</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Sayfa görüntüleme istatistikleri</li>
                          <li>• Kullanıcı davranış analizi</li>
                          <li>• Site performans ölçümü</li>
                          <li>• Popüler içerik belirleme</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Functionality Cookies */}
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Settings className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">İşlevsel Çerezler</h3>
                      <p className="text-gray-300 mb-3">
                        Size kişiselleştirilmiş bir deneyim sunmak için kullanılan çerezler. 
                        Bu çerezler isteğe bağlıdır.
                      </p>
                      <div className="bg-green-500/10 rounded-lg p-3">
                        <h4 className="text-green-300 font-semibold text-sm mb-1">Kullanım Alanları:</h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          <li>• Dil ve bölge tercihleri</li>
                          <li>• Tema ve görünüm ayarları</li>
                          <li>• Özelleştirme seçenekleri</li>
                          <li>• Gelişmiş kullanıcı deneyimi</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Third Party Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Üçüncü Taraf Çerezleri</h2>
              
              <div className="bg-white/5 rounded-xl p-6 space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  Web sitemizde bazı özellikler için güvenilir üçüncü taraf hizmetlerini kullanıyoruz. 
                  Bu hizmetler kendi çerezlerini ayarlayabilir:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <h3 className="text-purple-300 font-semibold mb-2">PayTR (Ödeme)</h3>
                    <p className="text-gray-300 text-sm mb-2">
                      Güvenli ödeme işlemleri için kullanılır.
                    </p>
                    <ul className="text-gray-400 text-xs space-y-1">
                      <li>• Ödeme güvenliği</li>
                      <li>• Dolandırıcılık korunması</li>
                      <li>• İşlem geçmişi</li>
                    </ul>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <h3 className="text-orange-300 font-semibold mb-2">Vercel Analytics</h3>
                    <p className="text-gray-300 text-sm mb-2">
                      Site performansı ve kullanım analizi.
                    </p>
                    <ul className="text-gray-400 text-xs space-y-1">
                      <li>• Sayfa yükleme süreleri</li>
                      <li>• Hata izleme</li>
                      <li>• Performans optimizasyonu</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Cookie className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-yellow-200 text-sm">
                      <strong>Not:</strong> Üçüncü taraf çerezler için ilgili şirketlerin kendi gizlilik politikaları geçerlidir. 
                      Bu çerezleri web sitemizden kontrol edemeyiz.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookie Management */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Settings className="w-6 h-6 text-ravenkart-primary" />
                Çerez Yönetimi
              </h2>
              
              <div className="bg-white/5 rounded-xl p-6 space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  Çerez tercihlerinizi aşağıdaki yöntemlerle yönetebilirsiniz:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Tarayıcı Ayarları</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <h4 className="text-blue-300 font-semibold text-sm mb-1">Chrome</h4>
                        <p className="text-gray-300 text-xs">
                          Ayarlar → Gizlilik ve güvenlik → Çerezler ve diğer site verileri
                        </p>
                      </div>
                      
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                        <h4 className="text-orange-300 font-semibold text-sm mb-1">Firefox</h4>
                        <p className="text-gray-300 text-xs">
                          Tercihler → Gizlilik ve Güvenlik → Çerezler ve Site Verileri
                        </p>
                      </div>
                      
                      <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-3">
                        <h4 className="text-gray-300 font-semibold text-sm mb-1">Safari</h4>
                        <p className="text-gray-300 text-xs">
                          Tercihler → Gizlilik → Çerezleri ve web site verileri yönet
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Çerez Seçenekleri</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="w-4 h-4 bg-green-400 rounded-full flex-shrink-0"></div>
                        <div>
                          <p className="text-green-300 font-semibold text-sm">Tümünü Kabul Et</p>
                          <p className="text-gray-300 text-xs">Tüm çerezlere izin ver</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="w-4 h-4 bg-yellow-400 rounded-full flex-shrink-0"></div>
                        <div>
                          <p className="text-yellow-300 font-semibold text-sm">Sadece Zorunlu</p>
                          <p className="text-gray-300 text-xs">Yalnızca gerekli çerezler</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="w-4 h-4 bg-red-400 rounded-full flex-shrink-0"></div>
                        <div>
                          <p className="text-red-300 font-semibold text-sm">Tümünü Reddet</p>
                          <p className="text-gray-300 text-xs">İsteğe bağlı çerezleri engelle</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Impact of Disabling Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Çerezleri Devre Dışı Bırakmanın Etkileri</h2>
              
              <div className="bg-white/5 rounded-xl p-6">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
                  <p className="text-orange-200 text-sm">
                    <strong>Uyarı:</strong> Çerezleri devre dışı bıraktığınızda bazı site özellikleri düzgün çalışmayabilir.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 text-red-300">Olumsuz Etkiler</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>Otomatik oturum açma çalışmaz</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>Tercihleriniz hatırlanmaz</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>Kişiselleştirilmiş deneyim kaybolur</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>Bazı özellikler kullanılamaz</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 text-green-300">Avantajları</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Daha fazla gizlilik korunması</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Takip verilerinin azalması</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Depolama alanı tasarrufu</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Daha hızlı sayfa yükleme</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">İletişim</h2>
              
              <div className="bg-gradient-to-r from-ravenkart-primary/10 to-ravenkart-secondary/10 border border-ravenkart-primary/20 rounded-xl p-6">
                <p className="text-gray-300 mb-4">
                  Çerez politikamız hakkında sorularınız varsa bizimle iletişime geçebilirsiniz:
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Cookie className="w-5 h-5 text-ravenkart-primary" />
                    <span>ravenkart.tr@gmail.com</span>
                  </div>
                  
                  <motion.a
                    href="mailto:ravenkart.tr@gmail.com?subject=Çerez%20Politikası%20Hakkında"
                    className="bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    E-posta Gönder
                  </motion.a>
                </div>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  )
}