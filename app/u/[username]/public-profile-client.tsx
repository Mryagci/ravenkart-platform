'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Building2, 
  ExternalLink,
  Download,
  Share2,
  QrCode,
  Plus
} from 'lucide-react'
import type { PublicProfile } from '@/types'
import { useState } from 'react'

interface PublicProfileClientProps {
  publicProfile: PublicProfile
}

const socialIcons: { [key: string]: string } = {
  linkedin: '💼',
  twitter: '🐦',
  instagram: '📷',
  tiktok: '🎵',
  youtube: '📺',
  facebook: '👥',
  snapchat: '👻',
  telegram: '💬',
  pinterest: '📌',
  whatsapp: '📱'
}

export default function PublicProfileClient({ publicProfile }: PublicProfileClientProps) {
  const { profile, social_links, projects } = publicProfile
  const [showQR, setShowQR] = useState(false)

  const fullName = `${profile.first_name} ${profile.last_name}`.trim()
  
  const handleAddToContacts = () => {
    // Generate vCard
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${fullName}
N:${profile.last_name};${profile.first_name};;;
ORG:${profile.company || ''}
TITLE:${profile.title || ''}
TEL:${profile.phone || ''}
EMAIL:${profile.email}
URL:${profile.website || ''}
NOTE:${profile.bio || ''}
END:VCARD`

    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${fullName.replace(/\s+/g, '_')}.vcf`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${fullName} - Dijital Kartvizit`,
          text: `${fullName} dijital kartvizitini inceleyin`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      alert('Link kopyalandı!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary">
        {profile.avatar_url && (
          <img 
            src={profile.avatar_url} 
            alt={fullName}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Profile Content */}
      <div className="relative -mt-16 md:-mt-20 px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect rounded-2xl p-6 card-shadow text-center"
          >
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary flex items-center justify-center text-white text-2xl md:text-3xl font-bold overflow-hidden">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.first_name?.[0]?.toUpperCase()
                )}
              </div>
              
              {/* Ribbon */}
              {profile.ribbon_gradient && (
                <div 
                  className="h-1 w-full mt-3 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${profile.ribbon_gradient.start}, ${profile.ribbon_gradient.end})`
                  }}
                />
              )}
            </div>

            {/* Name & Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {fullName}
            </h1>
            {profile.title && (
              <p className="text-lg text-gray-300 mb-1">{profile.title}</p>
            )}
            {profile.company && (
              <p className="text-gray-400 mb-4 flex items-center justify-center">
                <Building2 className="w-4 h-4 mr-2" />
                {profile.company}
              </p>
            )}

            {/* Bio */}
            {profile.bio && (
              <p className="text-gray-300 mb-6 leading-relaxed">{profile.bio}</p>
            )}

            {/* Contact Actions */}
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {profile.phone && (
                <Button
                  size="sm"
                  onClick={() => window.open(`tel:${profile.phone}`)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Ara
                </Button>
              )}
              
              <Button
                size="sm"
                onClick={() => window.open(`mailto:${profile.email}`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                E-posta
              </Button>

              {profile.website && (
                <Button
                  size="sm"
                  onClick={() => window.open(profile.website, '_blank')}
                  variant="outline"
                  className="border-white/20 text-gray-300"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Website
                </Button>
              )}

              <Button
                size="sm"
                onClick={handleAddToContacts}
                variant="outline"
                className="border-white/20 text-gray-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Kişiye Kaydet
              </Button>
            </div>

            {/* Share Actions */}
            <div className="flex gap-3 justify-center">
              <Button
                size="sm"
                onClick={handleShare}
                variant="outline"
                className="border-white/20 text-gray-300"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Paylaş
              </Button>
              
              <Button
                size="sm"
                onClick={() => setShowQR(!showQR)}
                variant="outline"
                className="border-white/20 text-gray-300"
              >
                <QrCode className="w-4 h-4 mr-2" />
                QR Kod
              </Button>
            </div>

            {/* QR Code */}
            {showQR && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-white rounded-lg inline-block"
              >
                <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500">QR Kod Yakında</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Social Links */}
          {social_links.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 glass-effect rounded-2xl p-6 card-shadow"
            >
              <h2 className="text-xl font-semibold text-white mb-4 text-center">
                Sosyal Medya
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {social_links.map((link) => (
                  <Button
                    key={link.id}
                    onClick={() => window.open(link.url || '', '_blank')}
                    variant="outline"
                    className="border-white/20 text-gray-300 justify-start"
                  >
                    <span className="mr-2 text-lg">
                      {socialIcons[link.platform] || '🔗'}
                    </span>
                    {link.platform}
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 glass-effect rounded-2xl p-6 card-shadow"
            >
              <h2 className="text-xl font-semibold text-white mb-4 text-center">
                Projeler & Ürünler
              </h2>
              <div className="grid gap-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => project.external_url && window.open(project.external_url, '_blank')}
                  >
                    <div className="flex items-start space-x-4">
                      {project.cover_image_url && (
                        <img
                          src={project.cover_image_url}
                          alt={project.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium">{project.title}</h3>
                        {project.description && (
                          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                      {project.external_url && (
                        <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-500 text-sm">
              Powered by{' '}
              <a 
                href="/" 
                className="text-ravenkart-primary hover:text-ravenkart-primary/80"
              >
                RAVENKART
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}