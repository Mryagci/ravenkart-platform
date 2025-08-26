'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import { useContactInfo } from '@/hooks/useContactInfo'
import { useState } from 'react'

export default function ContactPage() {
  const { contactInfo, loading } = useContactInfo()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic here
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
              İletişim
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Size nasıl yardımcı olabiliriz? Sorularınız için bize ulaşın.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-8">İletişim Bilgileri</h2>
              
              <div className="space-y-6">
                {/* Email */}
                <motion.div
                  className="flex items-center gap-4"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">E-posta</h3>
                    <p className="text-gray-400">
                      {loading ? 'Yükleniyor...' : contactInfo.emails?.general || 'ravenkart.tr@gmail.com'}
                    </p>
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div
                  className="flex items-center gap-4"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Telefon</h3>
                    <p className="text-gray-400">
                      {loading ? 'Yükleniyor...' : contactInfo.phones?.support || '+90 530 9588531'}
                    </p>
                  </div>
                </motion.div>

                {/* Address */}
                <motion.div
                  className="flex items-center gap-4"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Adres</h3>
                    <p className="text-gray-400">
                      {loading ? 'Yükleniyor...' : `${contactInfo.address?.district || 'Ankara'}, ${contactInfo.address?.country || 'Türkiye'}`}
                    </p>
                  </div>
                </motion.div>

                {/* Working Hours */}
                <motion.div
                  className="flex items-center gap-4"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Çalışma Saatleri</h3>
                    <p className="text-gray-400">
                      Hafta içi: {loading ? 'Yükleniyor...' : contactInfo.hours?.weekdays || '09:00 - 18:00'}
                    </p>
                    <p className="text-gray-400">
                      Hafta sonu: {loading ? 'Yükleniyor...' : contactInfo.hours?.weekend || 'Kapalı'}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Bize Yazın
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Adınız *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-ravenkart-primary transition-colors"
                      placeholder="Adınızı girin"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-ravenkart-primary transition-colors"
                      placeholder="E-posta adresinizi girin"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Konu *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-ravenkart-primary transition-colors"
                    placeholder="Mesajınızın konusunu girin"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Mesajınız *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-ravenkart-primary transition-colors resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg hover:shadow-ravenkart-primary/25 transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-5 h-5" />
                  Mesajı Gönder
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Daha Hızlı Destek İçin
            </h3>
            <p className="text-gray-300 mb-6">
              Acil durumlarda veya teknik destek için doğrudan WhatsApp üzerinden de bize ulaşabilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.a
                href={`mailto:${contactInfo.emails?.general || 'ravenkart.tr@gmail.com'}`}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5" />
                E-posta Gönder
              </motion.a>
              <motion.a
                href={`tel:${contactInfo.phones?.support || '+905309588531'}`}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="w-5 h-5" />
                Ara
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}