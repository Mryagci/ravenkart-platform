'use client'

import { motion } from 'framer-motion'
import { Scale, Building, Mail, Globe, Shield, Calendar, Copyright, AlertTriangle } from 'lucide-react'

export default function LegalPage() {
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
            <Scale className="w-12 h-12 text-ravenkart-primary" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              <span className="bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary bg-clip-text text-transparent">
                Yasal Bildirim
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
            
            {/* Website Owner Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Building className="w-6 h-6 text-ravenkart-primary" />
                Web Sitesi Sahibi
              </h2>
              
              <div className="bg-white/5 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">İşletme Bilgileri</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Building className="w-5 h-5 text-ravenkart-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-400 text-sm">İşletme Adı</p>
                          <p className="text-white font-semibold">Ravenkart</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-ravenkart-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-400 text-sm">Alan Adı</p>
                          <p className="text-white font-semibold">www.ravenkart.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-ravenkart-primary mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-gray-400 text-sm">İletişim E-posta</p>
                          <p className="text-white font-semibold">ravenkart.tr@gmail.com</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Sorumlu Kişi</h3>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <p className="text-blue-300 font-semibold text-sm">İletişim Sorumlusu</p>
                      </div>
                      <p className="text-gray-300 text-sm">
                        Tüm yasal konular ve müşteri hizmetleri için iletişim e-posta adresi: 
                        <strong className="text-white"> ravenkart.tr@gmail.com</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Hizmet Türü</h2>
              
              <div className="bg-white/5 rounded-xl p-6 space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  Bu web sitesi, <strong className="text-white">kişiye özel üretilmiş NFC özellikli dijital kartvizitler</strong> 
                  ve ilgili dijital hizmetlerin tanıtımını ve satışını yapmaktadır.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-ravenkart-primary/10 to-ravenkart-secondary/10 border border-ravenkart-primary/20 rounded-lg p-5">
                    <h3 className="text-ravenkart-primary font-semibold mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Dijital Hizmetler
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• NFC özellikli dijital kartvizit oluşturma</li>
                      <li>• QR kod tabanlı kartvizit paylaşımı</li>
                      <li>• Kişiselleştirilmiş profil sayfaları</li>
                      <li>• İletişim bilgisi yönetim sistemi</li>
                      <li>• Analitik ve istatistik hizmetleri</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-5">
                    <h3 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Gelecek Hizmetler
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Fiziksel NFC kartlar</li>
                      <li>• Ahşap ve metal lazer kazıma</li>
                      <li>• Kurumsal çözümler</li>
                      <li>• API ve entegrasyon hizmetleri</li>
                      <li>• İlgili aksesuarlar</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Copyright and Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Copyright className="w-6 h-6 text-ravenkart-primary" />
                Telif Hakkı ve Fikri Mülkiyet
              </h2>
              
              <div className="bg-white/5 rounded-xl p-6 space-y-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-red-300 font-semibold mb-2">Korumalı İçerik</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Bu sitede yer alan tüm içerikler (metin, grafik, logo, görsel, tasarım ve diğer materyaller) 
                        <strong className="text-white"> Ravenkart'a aittir</strong> ve 
                        <strong className="text-white"> 5846 sayılı Fikir ve Sanat Eserleri Kanunu</strong> kapsamında korunmaktadır.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      Yasak İşlemler
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>İzinsiz kopyalama ve çoğaltma</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>Ticari amaçlı kullanım</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>Dağıtım ve yayınlama</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">•</span>
                        <span>Değiştirme ve düzenleme</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Scale className="w-5 h-5 text-green-400" />
                      İzin Verilen Kullanım
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Kişisel kullanım ve inceleme</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Alıntı yapma (kaynak gösterme ile)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Öğrenim ve araştırma amaçlı</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>Fair use kapsamında eleştiri</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                Sorumluluk Reddi
              </h2>
              
              <div className="bg-white/5 rounded-xl p-6 space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-5">
                  <p className="text-yellow-200 text-sm leading-relaxed">
                    Web sitemizde yer alan bilgiler sürekli güncellenmeye çalışılsa da, 
                    <strong> içeriklerin doğruluğu ve eksiksizliği</strong> konusunda herhangi bir garanti verilmemektedir.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <h3 className="text-orange-300 font-semibold mb-2">Ürün Görselleri ve Açıklamaları</h3>
                    <p className="text-gray-300 text-sm">
                      Ürün görselleri ve açıklamalarında meydana gelebilecek hatalardan dolayı Ravenkart sorumluluk kabul etmez. 
                      Nihai ürün özelliklerine sipariş sayfasından ulaşabilirsiniz.
                    </p>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <h3 className="text-red-300 font-semibold mb-2">Hizmet Kesintileri</h3>
                    <p className="text-gray-300 text-sm">
                      Teknik bakım, sistem güncellemeleri veya force majeure durumlarında yaşanabilecek hizmet kesintilerinden 
                      doğan zararlardan sorumluluk kabul edilmez.
                    </p>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                    <h3 className="text-purple-300 font-semibold mb-2">Üçüncü Taraf Bağlantıları</h3>
                    <p className="text-gray-300 text-sm">
                      Sitemizde yer alan üçüncü taraf web sitelerine yönlendiren bağlantıların içeriğinden ve güvenliğinden 
                      sorumlu değiliz. Bu siteleri kendi riskinizle ziyaret edin.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Legal Warning */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Yasal Uyarı</h2>
              
              <div className="bg-white/5 rounded-xl p-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <Scale className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-blue-300 font-semibold mb-3">Kullanım Kabul Beyanı</h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        Bu web sitesini kullanan tüm kullanıcılar, burada yer alan yasal bildirimleri ve site politikalarını 
                        (iade, kargo, gizlilik vb.) <strong className="text-white">okumuş ve kabul etmiş sayılırlar.</strong>
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-white font-semibold text-sm mb-2">Kabulü Gereken Politikalar:</h4>
                          <ul className="space-y-1 text-gray-300 text-xs">
                            <li>• Gizlilik Politikası</li>
                            <li>• Hizmet Şartları</li>
                            <li>• Para İade Politikası</li>
                            <li>• Kargo Politikası</li>
                            <li>• Çerez Politikası</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-white font-semibold text-sm mb-2">Yasal Yükümlülükler:</h4>
                          <ul className="space-y-1 text-gray-300 text-xs">
                            <li>• Türk Ticaret Kanunu</li>
                            <li>• Tüketici Hakları Mevzuatı</li>
                            <li>• KVKK (Kişisel Verileri Koruma)</li>
                            <li>• Elektronik Ticaret Kanunu</li>
                            <li>• Fikir ve Sanat Eserleri Kanunu</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Uyuşmazlık Durumu</h2>
              
              <div className="bg-white/5 rounded-xl p-6 space-y-6">
                <div className="bg-gradient-to-r from-ravenkart-primary/10 to-ravenkart-secondary/10 border border-ravenkart-primary/20 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <Scale className="w-6 h-6 text-ravenkart-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold mb-2">Uygulanacak Hukuk ve Yetkili Mahkemeler</h3>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        Web sitemiz üzerinden yapılan alışverişler <strong className="text-white">Türkiye Cumhuriyeti yasalarına tabidir.</strong> 
                        Olası uyuşmazlıkların çözümünde <strong className="text-white">Ankara Tüketici Hakem Heyetleri ve Mahkemeleri yetkilidir.</strong>
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-white/5 rounded-lg p-3">
                          <h4 className="text-ravenkart-primary font-semibold text-sm mb-1">Tüketici Hakları</h4>
                          <p className="text-gray-300 text-xs">
                            2000₺'ye kadar: İlçe Tüketici Hakem Heyeti<br/>
                            2000₺ üzeri: İl Tüketici Hakem Heyeti
                          </p>
                        </div>
                        
                        <div className="bg-white/5 rounded-lg p-3">
                          <h4 className="text-ravenkart-secondary font-semibold text-sm mb-1">Ticari Uyuşmazlıklar</h4>
                          <p className="text-gray-300 text-xs">
                            Ankara Asliye Ticaret Mahkemeleri<br/>
                            (B2B işlemler için)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h3 className="text-green-300 font-semibold mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Öncelikle İletişim
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Herhangi bir sorun yaşadığınızda, öncelikle müşteri hizmetlerimizle iletişime geçmenizi öneririz. 
                    Çoğu sorun karşılıklı görüşme ile çözülebilir: 
                    <strong className="text-white"> ravenkart.tr@gmail.com</strong>
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">İletişim Bilgileri</h2>
              
              <div className="bg-gradient-to-r from-ravenkart-primary/10 to-ravenkart-secondary/10 border border-ravenkart-primary/20 rounded-xl p-6">
                <div className="text-center">
                  <Mail className="w-12 h-12 text-ravenkart-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-4">Yasal Konular İçin İletişim</h3>
                  <p className="text-gray-300 mb-6">
                    Bu yasal bildirim hakkında sorularınız veya herhangi bir yasal konu ile ilgili bizimle iletişime geçmek istediğinizde:
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center gap-3 text-gray-300">
                      <Mail className="w-5 h-5 text-ravenkart-primary" />
                      <span className="text-lg">ravenkart.tr@gmail.com</span>
                    </div>
                  </div>

                  <motion.a
                    href="mailto:ravenkart.tr@gmail.com?subject=Yasal%20Bildirim%20Hakkında"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Scale className="w-5 h-5" />
                    Yasal Konular İçin E-posta Gönder
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