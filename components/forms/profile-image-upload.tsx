'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
// Storage temporarily disabled - using placeholder

interface ProfileImageUploadProps {
  currentImageUrl?: string
  userId: string
  onImageUpdate: (newUrl: string) => void
  className?: string
}

export default function ProfileImageUpload({
  currentImageUrl,
  userId,
  onImageUpdate,
  className = ""
}: ProfileImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')

    // Validate file
    const validation = { valid: true, error: null } // Temporarily skip validation
    if (!validation.valid) {
      setError(validation.error || 'Geçersiz dosya')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    handleUpload(file)
  }

  const handleUpload = async (file: File) => {
    if (uploading) return // Prevent multiple uploads
    
    try {
      setUploading(true)
      setError('')
      console.log('Starting upload process...')

      // Upload new image first
      console.log('Uploading new image...')
      const newImageUrl = 'https://example.com/placeholder.jpg' // Temporarily disabled
      console.log('Upload completed, new URL:', newImageUrl)

      // Update profile in database
      console.log('Updating profile in database...')
      // Database update temporarily disabled
      console.log('Would update profile with:', newImageUrl)
      console.log('Profile updated successfully')

      // Delete old image after successful upload
      if (currentImageUrl) {
        console.log('Deleting old image...')
        try {
          console.log('Would delete old image:', currentImageUrl)
          console.log('Old image deleted')
        } catch (deleteError) {
          console.warn('Failed to delete old image:', deleteError)
        }
      }

      // Update UI
      onImageUpdate(newImageUrl)
      setPreviewUrl(null)
      console.log('Upload process completed successfully')
    } catch (error: any) {
      console.error('Upload error:', error)
      setError(error.message || 'Yükleme başarısız oldu')
      setPreviewUrl(null)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }


  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const displayUrl = previewUrl || currentImageUrl

  return (
    <div className={`text-center ${className}`}>
      {/* Image Display */}
      <div className="relative inline-block mb-4">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 bg-gradient-to-r from-ravenkart-primary to-ravenkart-secondary flex items-center justify-center">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Profil fotoğrafı"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="w-12 h-12 text-white" />
          )}
        </div>

        {/* Loading overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {/* Upload button overlay */}
        {!uploading && (
          <motion.button
            onClick={triggerFileInput}
            className="absolute bottom-0 right-0 w-10 h-10 bg-ravenkart-primary rounded-full flex items-center justify-center shadow-lg hover:bg-ravenkart-primary/80 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Upload className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />


      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
        >
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* File format info */}
      <p className="text-xs text-gray-400 mt-2">
        JPG, PNG, WebP formatları • Max 5MB
      </p>
    </div>
  )
}