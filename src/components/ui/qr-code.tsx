'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { Download, Copy, Check } from 'lucide-react'

interface QRCodeComponentProps {
  value: string
  size?: number
  title?: string
  className?: string
}

export default function QRCodeComponent({ 
  value, 
  size = 200, 
  title = "QR Kod",
  className = ""
}: QRCodeComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      }, (error) => {
        if (error) console.error('QR Code generation error:', error)
      })
    }
  }, [value, size])

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = `${title.replace(/\s+/g, '_')}_QR.png`
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  if (!value) {
    return (
      <div className={`text-center ${className}`}>
        <div 
          className="bg-gray-200 rounded-lg flex items-center justify-center text-gray-500"
          style={{ width: size, height: size }}
        >
          QR Kod
        </div>
      </div>
    )
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="bg-white p-4 rounded-lg shadow-lg inline-block">
        <canvas 
          ref={canvasRef}
          className="block mx-auto"
        />
      </div>
      
      <div className="mt-4 space-y-2">
        <Button 
          onClick={handleDownload}
          size="sm" 
          className="w-full bg-ravenkart-primary hover:bg-ravenkart-primary/80"
        >
          <Download className="w-4 h-4 mr-2" />
          PNG İndir
        </Button>
        
        <Button 
          onClick={handleCopyLink}
          size="sm" 
          variant="outline"
          className="w-full border-white/20 text-gray-300"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Kopyalandı!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Link Kopyala
            </>
          )}
        </Button>
      </div>
    </div>
  )
}