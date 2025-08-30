'use client'

import { motion } from 'framer-motion'
import { Shield, Mail, Phone, MapPin, Calendar } from 'lucide-react'

export default function PrivacyPage() {
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
            <Shield className="w-12 h-12 text-ravenkart-primary" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              <span className="bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary bg-clip-text text-transparent">
                Gizlilik Politikası
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
                Bu Gizlilik Politikası, Ravenkart ("Site", "biz", "bize" veya "bizim") dijital kartvizit platformunu ziyaret ettiğinizde, 
                hizmetlerimizi kullandığınızda veya ravenkart.com ("Site") adresinden bir satın alma işlemi yaptığınızda kişisel bilgilerinizi 
                nasıl topladığını, kullandığını ve paylaştığını açıklamaktadır.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Lütfen bu Gizlilik Politikasını dikkatlice okuyun. Hizmetlerden herhangi birini kullanarak ve bunlara erişerek, 
                bilgilerinizin bu Gizlilik Politikasında açıklandığı şekilde toplanmasını, kullanılmasını ve paylaşılmasını kabul etmiş olursunuz.
              </p>
            </section>

            {/* Policy Changes */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                Bu Gizlilik Politikasındaki Değişiklikler
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Uygulamalarımızdaki değişiklikleri yansıtmak veya diğer operasyonel, yasal veya düzenleyici nedenlerle 
                bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Revize edilmiş Gizlilik Politikasını sitede yayınlayacağız, 
                "Son güncelleme" tarihini güncelleyeceğiz ve geçerli yasaların gerektirdiği diğer adımları atacağız.
              </p>
            </section>

            {/* Information Collection */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Hangi Kişisel Bilgileri Topluyoruz</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">Doğrudan Sizden Topladığımız Bilgiler</h3>
              <div className="bg-white/5 rounded-lg p-6 mb-6">
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    Adınız, adresiniz, telefon numaranız ve e-posta adresiniz dahil iletişim bilgileri
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    Dijital kartvizit bilgileriniz, şirket adı, ünvan ve sosyal medya hesapları
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    Ödeme bilgileri (kredi kartı bilgileri güvenli ödeme sağlayıcıları tarafından işlenir)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    Hesap bilgileri ve güvenlik amacıyla kullanılan bilgiler
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    Müşteri desteği iletişimi sırasında paylaştığınız bilgiler
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">Kullanımınız Hakkında Topladığımız Bilgiler</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Dijital kartvizit hizmetlerimizle etkileşiminiz hakkında otomatik olarak belirli bilgiler ("Kullanım Verileri") toplayabiliriz. 
                Bu bilgiler şunları içerir:
              </p>
              <div className="bg-white/5 rounded-lg p-6">
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    Cihaz bilgileri ve tarayıcı bilgileri
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    IP adresiniz ve ağ bağlantı bilgileri
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    QR kod tarama istatistikleri ve analitik verileri
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    Site kullanım alışkanlıkları ve ziyaret süreleri
                  </li>
                </ul>
              </div>
            </section>

            {/* Information Usage */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Kişisel Bilgilerinizi Nasıl Kullanıyoruz</h2>
              
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Dijital Kartvizit Hizmetlerinin Sağlanması</h3>
                  <p className="text-gray-300">
                    Kişiselleştirilmiş dijital kartvizitinizi oluşturmak, QR kod üretmek, analitik veriler sağlamak ve 
                    hesabınızı yönetmek için kişisel bilgilerinizi kullanırız.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Ödeme İşlemleri</h3>
                  <p className="text-gray-300">
                    Abonelik ödemelerinizi işleme koymak ve fatura bilgilerini yönetmek için gerekli bilgileri kullanırız. 
                    Kredi kartı bilgileri güvenli ödeme sağlayıcıları (PayTR) aracılığıyla işlenir.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">İletişim ve Destek</h3>
                  <p className="text-gray-300">
                    Size müşteri desteği sağlamak, sistem güncellemeleri hakkında bilgi vermek ve hizmet kalitesini 
                    artırmak için bilgilerinizi kullanırız.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Güvenlik ve Dolandırıcılık Önleme</h3>
                  <p className="text-gray-300">
                    Hesabınızın güvenliğini sağlamak ve olası dolandırıcılık faaliyetlerini tespit etmek için 
                    güvenlik analizi yapabiliriz.
                  </p>
                </div>
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Bilgileri Kimlerle Paylaşırız</h2>
              
              <div className="bg-white/5 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Hizmet Sağlayıcılar</h3>
                  <p className="text-gray-300">
                    PayTR (ödeme işleme), hosting sağlayıcıları ve analitik hizmetleri gibi güvenilir üçüncü taraf 
                    hizmet sağlayıcılarla sınırlı bilgi paylaşımı yapabiliriz.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Yasal Gereklilikler</h3>
                  <p className="text-gray-300">
                    Yasal yükümlülükler, mahkeme kararları veya güvenlik gerekçeleriyle bilgilerinizi 
                    yetkili makamlarla paylaşmak zorunda kalabiliriz.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">İzinli Paylaşımlar</h3>
                  <p className="text-gray-300">
                    Dijital kartvizitinizi QR kod aracılığıyla paylaştığınızda, belirlediğiniz bilgiler 
                    kişilerle paylaşılır. Bu paylaşım sizin kontrolünüzdedir.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Bilgilerinizin Güvenliği</h2>
              <div className="bg-white/5 rounded-lg p-6">
                <p className="text-gray-300 leading-relaxed mb-4">
                  Kişisel bilgilerinizin güvenliği bizim için önceliklidir. Bilgilerinizi korumak için 
                  aşağıdaki güvenlik önlemlerini alıyoruz:
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    SSL sertifikası ile şifreli veri aktarımı
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    Güvenli veri saklama ve yedekleme sistemleri
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    Düzenli güvenlik güncellemeleri ve denetimleri
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    Erişim kontrolü ve yetkilendirme sistemleri
                  </li>
                </ul>
              </div>
            </section>

            {/* User Rights */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Haklarınız</h2>
              <div className="bg-white/5 rounded-lg p-6">
                <p className="text-gray-300 mb-4">Kişisel verilerinizle ilgili olarak aşağıdaki haklara sahipsiniz:</p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    <strong>Erişim Hakkı:</strong> Hakkınızda tuttuğumuz kişisel bilgilere erişim talep etme
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    <strong>Düzeltme Hakkı:</strong> Yanlış veya eksik bilgilerin düzeltilmesini talep etme
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    <strong>Silme Hakkı:</strong> Belirli koşullar altında bilgilerinizin silinmesini talep etme
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    <strong>Taşınabilirlik Hakkı:</strong> Bilgilerinizin yapılandırılmış formatta kopyasını alma
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-ravenkart-primary mt-1">•</span>
                    <strong>İtiraz Hakkı:</strong> Belirli işleme faaliyetlerine karşı itiraz etme
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">İletişim</h2>
              <div className="bg-white/5 rounded-lg p-6">
                <p className="text-gray-300 mb-6">
                  Gizlilik uygulamalarımız veya bu Gizlilik Politikası hakkında herhangi bir sorunuz varsa, 
                  lütfen bizimle iletişime geçin:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-5 h-5 text-ravenkart-primary" />
                    <span>ravenkart.tr@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-ravenkart-primary" />
                    <span>Ankara, Türkiye</span>
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