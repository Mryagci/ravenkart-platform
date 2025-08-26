'use client'

import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react'
import { useContactInfo } from '@/hooks/useContactInfo'

const footerLinks = {
  product: {
    title: "Ürün",
    links: [
      { name: "Özellikler", href: "#features" },
      { name: "Fiyatlandırma", href: "/pricing" },
      { name: "Demo", href: "/demo" }
    ]
  },
  company: {
    title: "Şirket",
    links: [
      { name: "Hakkımızda", href: "/about" },
      { name: "İletişim", href: "/contact" }
    ]
  },
  support: {
    title: "Destek",
    links: [
      { name: "Yardım Merkezi", href: "/help" },
      { name: "Kargo Politikası", href: "/shipping" },
      { name: "Para İade Politikası", href: "/refund" }
    ]
  },
  legal: {
    title: "Hukuki",
    links: [
      { name: "Gizlilik Politikası", href: "/privacy" },
      { name: "Hizmet Şartları", href: "/terms" },
      { name: "Çerez Politikası", href: "/cookies" },
      { name: "Yasal Bildirim", href: "/legal" }
    ]
  }
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { contactInfo } = useContactInfo()
  
  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: contactInfo.social?.twitter ? `https://twitter.com/${contactInfo.social.twitter.replace('@', '')}` : "#", color: "hover:text-blue-400" },
    { name: "LinkedIn", icon: Linkedin, href: contactInfo.social?.linkedin ? `https://linkedin.com/${contactInfo.social.linkedin}` : "#", color: "hover:text-blue-600" },
    { name: "GitHub", icon: Github, href: "#", color: "hover:text-gray-400" },
    { name: "Email", icon: Mail, href: `mailto:${contactInfo.emails?.general || 'hello@ravenkart.com'}`, color: "hover:text-red-400" }
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand section */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary bg-clip-text text-transparent">
                RAVENKART
              </h3>
              <p className="text-gray-400 mt-3 leading-relaxed">
                Dijital kartvizit platformu ile işinizi geleceğe taşıyın. 
                Modern, hızlı ve güvenli çözümler.
              </p>
            </div>

            {/* Contact info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-400 hover:text-white transition-colors">
                <MapPin className="w-4 h-4 mr-3" />
                <span className="text-sm">
                  {contactInfo.address?.district || 'Sarıyer/İstanbul'}{contactInfo.address?.country && contactInfo.address.country !== 'Türkiye' ? `, ${contactInfo.address.country}` : ''}
                </span>
              </div>
              <div className="flex items-center text-gray-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4 mr-3" />
                <span className="text-sm">{contactInfo.phones?.support || '+90 (212) 123 45 67'}</span>
              </div>
              <div className="flex items-center text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4 mr-3" />
                <span className="text-sm">{contactInfo.emails?.general || 'hello@ravenkart.com'}</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color} hover:bg-gray-700 hover:scale-110`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer links */}
          {Object.values(footerLinks).map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h4 className="font-semibold mb-4 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter subscription */}
        <motion.div
          className="border-t border-gray-800 pt-12 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="max-w-md mx-auto text-center">
            <h4 className="font-semibold mb-3 text-white">Güncellemeleri Kaçırmayın</h4>
            <p className="text-gray-400 text-sm mb-4">
              Yeni özellikler ve güncellemelerden haberdar olun
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-ravenkart-primary text-white text-sm"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium">
                Abone Ol
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p>© {currentYear} Ravenkart. Tüm hakları saklıdır.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="hover:text-white transition-colors">
              Gizlilik Politikası
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Kullanım Şartları
            </a>
            <a href="/cookies" className="hover:text-white transition-colors">
              Çerez Politikası
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}