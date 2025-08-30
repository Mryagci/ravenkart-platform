'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, QrCode, Upload, X, CheckCircle, AlertCircle, Scan, Edit3, Save, Crop, MapPin, Calendar, StickyNote, CreditCard } from 'lucide-react'
import Navbar from '@/components/layout/navbar'
// QrScanner will be dynamically imported to avoid SSR issues
// Google Cloud Vision API will be used via server-side API route

interface ScannedCard {
  id: string
  name: string
  title?: string
  company?: string
  email?: string
  phone?: string
  website?: string
  scannedAt: Date
  imageData?: string
  isEditing?: boolean
  location?: string
  notes?: string
  croppedImageData?: string
}

export default function CardScannerPage() {
  const [scanMode, setScanMode] = useState<'qr' | 'camera' | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedCards, setScannedCards] = useState<ScannedCard[]>([])
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editingCard, setEditingCard] = useState<ScannedCard | null>(null)
  const [cropMode, setCropMode] = useState(false)
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [userLocation, setUserLocation] = useState<string>('')
  const [showOCROption, setShowOCROption] = useState(false)
  const [ocrProcessing, setOcrProcessing] = useState(false)
  const [qrMode, setQrMode] = useState(false)
  const [qrScanner, setQrScanner] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const cropCanvasRef = useRef<HTMLCanvasElement>(null)
  const cropImageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      setError(null)
      setIsScanning(true)
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err) {
      setError('Kameraya erişim izni gerekli')
      setIsScanning(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (qrScanner) {
      qrScanner.destroy()
      setQrScanner(null)
    }
    setIsScanning(false)
    setScanMode(null)
    setQrMode(false)
  }

  const startQrScanning = async () => {
    try {
      setError(null)
      setQrMode(true)
      setIsScanning(true)
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      if (videoRef.current) {
        streamRef.current = stream
        videoRef.current.srcObject = stream
        
        // Dynamic import to avoid SSR issues
        const QrScanner = (await import('qr-scanner')).default
        
        // Set worker path for QR scanner
        QrScanner.WORKER_PATH = '/qr-scanner-worker.min.js'
        
        const scanner = new QrScanner(videoRef.current, (result: string) => {
          console.log('QR Code scanned:', result)
          handleQrResult(result)
        })
        
        setQrScanner(scanner)
        await scanner.start()
      }
    } catch (err) {
      console.error('Error starting QR scanner:', err)
      setError('QR kod tarayıcısı başlatılamadı. Lütfen kamera erişimi verin.')
      setIsScanning(false)
      setQrMode(false)
    }
  }

  const handleQrResult = (qrData: string) => {
    console.log('QR Result:', qrData)
    
    // QR kod'u durdur
    if (qrScanner) {
      qrScanner.destroy()
      setQrScanner(null)
    }
    stopCamera()
    
    // QR kod verisini parse et ve kart bilgilerine çevir
    try {
      let cardData: any = {}
      
      // vCard formatı mı kontrol et
      if (qrData.startsWith('BEGIN:VCARD')) {
        cardData = parseVCard(qrData)
      } else {
        // URL veya düz metin olabilir
        if (qrData.startsWith('http')) {
          cardData.website = qrData
          cardData.name = 'Web Sitesi'
        } else {
          cardData.name = qrData
        }
      }
      
      // Eksik alanları doldur
      const scannedCard: ScannedCard = {
        id: Date.now().toString(),
        name: cardData.name || 'QR Kod',
        title: cardData.title || '',
        company: cardData.company || '',
        email: cardData.email || '',
        phone: cardData.phone || '',
        website: cardData.website || '',
        scannedAt: new Date(),
        location: userLocation,
        notes: `QR kod ile tarandı: ${new Date().toLocaleString()}`,
        tags: ['qr-kod'],
        isEditing: true
      }
      
      setEditingCard(scannedCard)
      setScanResult('QR kod başarıyla okundu!')
      
    } catch (error) {
      console.error('QR parsing error:', error)
      setError('QR kod verisi işlenemedi')
    }
  }

  const parseVCard = (vcard: string) => {
    const lines = vcard.split('\n')
    const data: any = {}
    
    lines.forEach(line => {
      if (line.startsWith('FN:')) data.name = line.substring(3)
      if (line.startsWith('TITLE:')) data.title = line.substring(6)
      if (line.startsWith('ORG:')) data.company = line.substring(4)
      if (line.startsWith('EMAIL:')) data.email = line.substring(6)
      if (line.startsWith('TEL:')) data.phone = line.substring(4)
      if (line.startsWith('URL:')) data.website = line.substring(4)
    })
    
    return data
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      if (context) {
        try {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          context.drawImage(video, 0, 0)
          
          const imageData = canvas.toDataURL('image/jpeg')
          
          // Create initial card with image
          const newCard: ScannedCard = {
            id: Date.now().toString(),
            name: '',
            title: '',
            company: '',
            email: '',
            phone: '',
            website: '',
            scannedAt: new Date(),
            imageData: imageData,
            location: '',
            notes: ''
          }
          
          setScannedCards(prev => [newCard, ...prev])
          setScanResult('Kartvizit yakalandı! OCR ile otomatik doldur veya manuel girin.')
          stopCamera()
          
          setTimeout(() => setScanResult(null), 3000)
        } catch (error) {
          console.error('Capture error:', error)
          setError('Kartvizit yakalama hatası')
          stopCamera()
        }
      }
    }
  }

  const editCard = (card: ScannedCard) => {
    setEditingCard(card)
  }

  const saveEditedCard = (editedCard: ScannedCard) => {
    setScannedCards(prev => 
      prev.map(card => 
        card.id === editedCard.id ? editedCard : card
      )
    )
    setEditingCard(null)
    setCropMode(false)
    setScanResult('Kartvizit başarıyla güncellendi!')
    setTimeout(() => setScanResult(null), 3000)
  }

  const saveToCollection = async (card: ScannedCard) => {
    try {
      setScanResult('Kartvizit kaydediliyor...')
      
      // Get current user from Supabase
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Kullanıcı oturumu bulunamadı')
      }
      
      // Prepare card data for database
      const cardData = {
        user_id: user.id,
        name: card.name,
        title: card.title,
        company: card.company,
        email: card.email,
        phone: card.phone,
        website: card.website,
        image_data: card.croppedImageData || card.imageData,
        location: card.location,
        notes: card.notes,
        scanned_at: card.scannedAt.toISOString(),
        created_at: new Date().toISOString()
      }
      
      // Insert into scanned_cards table
      const { error } = await supabase
        .from('scanned_cards')
        .insert([cardData])
      
      if (error) {
        console.error('Database error:', error)
        throw new Error('Veritabanına kaydetme hatası: ' + error.message)
      }
      
      setScanResult('Kartvizit başarıyla kaydedildi! Kayıtlı kartvizitlerinizi görmek için Saved Cards sayfasını ziyaret edin.')
      
      // Remove from temporary state after successful save
      setScannedCards(prev => prev.filter(c => c.id !== card.id))
      
    } catch (error: any) {
      console.error('Save error:', error)
      setScanResult('Kaydetme hatası: ' + (error.message || 'Bilinmeyen hata'))
    }
    
    setTimeout(() => setScanResult(null), 3000)
  }

  // Smart OCR function that adapts based on device capabilities
  const performSmartOCR = async (imageData: string, cardId: string) => {
    try {
      setOcrProcessing(true)
      setScanResult('OCR ile metin çıkarılıyor...')
      
      // Check device capabilities
      const deviceCapabilities = getDeviceCapabilities()
      let extractedData: Partial<ScannedCard> = {}
      
      if (deviceCapabilities.canHandleOCR) {
        // Try client-side OCR for capable devices
        extractedData = await performClientSideOCR(imageData)
      } else {
        // Fallback to cloud OCR or simulation for weaker devices
        extractedData = await performFallbackOCR(imageData)
      }
      
      // Update the card with extracted data
      setScannedCards(prev => 
        prev.map(card => 
          card.id === cardId 
            ? { ...card, ...extractedData, isEditing: true }
            : card
        )
      )
      
      setScanResult('✅ OCR tamamlandı!')
      setTimeout(() => setScanResult(null), 3000)
      
    } catch (error) {
      console.error('OCR Error:', error)
      setScanResult('OCR hatası. Manuel giriş yapabilirsiniz.')
      setTimeout(() => setScanResult(null), 3000)
    } finally {
      setOcrProcessing(false)
      setShowOCROption(false)
    }
  }

  // Enhanced device capability detection for cost optimization
  const getDeviceCapabilities = () => {
    const memory = (navigator as any).deviceMemory || 4
    const cores = navigator.hardwareConcurrency || 4
    const connection = (navigator as any).connection || {}
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isSlowConnection = connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g'
    
    // Optimize based on device and network conditions
    const canHandleAdvancedOCR = memory >= 4 && cores >= 4 && !isSlowConnection
    const shouldUseFallback = isMobile || memory < 4 || isSlowConnection
    
    return {
      canHandleOCR: canHandleAdvancedOCR,
      isHighEnd: memory >= 6 && cores >= 6,
      isMobile: isMobile,
      isIOS: isIOS,
      shouldUseFallback: shouldUseFallback,
      connectionSpeed: connection.effectiveType || 'unknown'
    }
  }

  // Google Cloud Vision OCR - High accuracy professional OCR
  const performClientSideOCR = async (imageData: string): Promise<Partial<ScannedCard>> => {
    try {
      console.log('Starting Google Cloud Vision OCR...')
      
      // Convert data URL to base64
      const base64Image = imageData.replace(/^data:image\/[a-z]+;base64,/, '')
      
      // Call our API route for Google Vision OCR
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image: base64Image,
          type: 'business_card' 
        })
      })
      
      if (!response.ok) {
        throw new Error(`OCR API error: ${response.status}`)
      }
      
      const result = await response.json()
      
      console.log('=== OCR API RESPONSE ===')
      console.log('Full result:', JSON.stringify(result))
      console.log('======================')
      
      if (result.error) {
        console.error('OCR API returned error:', result.error)
        throw new Error(result.error)
      }
      
      console.log('OCR Success! Provider:', result.provider)
      console.log('OCR Text:', result.text)
      console.log('Confidence:', result.confidence)
      
      // Enhanced parsing with confidence scores
      const parsedData = parseBusinessCardTextAdvanced(result.text, { confidence: result.confidence })
      
      console.log('Parsed card data:', JSON.stringify(parsedData))
      return parsedData
    } catch (error) {
      console.error('Google Vision OCR Error:', error)
      // Fallback to simplified OCR
      return await performFallbackOCR(imageData)
    }
  }

  // Fallback OCR - simplified Vision API call or manual entry
  const performFallbackOCR = async (imageData: string): Promise<Partial<ScannedCard>> => {
    try {
      console.log('Starting fallback OCR (simplified Vision API)...')
      
      const base64Image = imageData.replace(/^data:image\/[a-z]+;base64,/, '')
      
      // Try simplified OCR API call
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image: base64Image,
          type: 'simple_text' // Simplified processing
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        if (!result.error) {
          console.log('Fallback OCR Text:', result.text)
          return parseBusinessCardText(result.text)
        }
      }
      
      // If API fails, return empty for manual entry
      console.log('OCR failed, switching to manual entry mode')
      return {}
    } catch (error) {
      console.error('Fallback OCR Error:', error)
      // Final fallback - return empty for manual entry
      return {
        name: '',
        title: '',
        company: '',
        email: '',
        phone: '',
        website: ''
      }
    }
  }

  // Image preprocessing for better OCR accuracy
  const preprocessImageForOCR = async (imageData: string, simplified: boolean = false): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Set canvas size
        canvas.width = img.width
        canvas.height = img.height
        
        if (!ctx) {
          resolve(imageData) // Return original if context fails
          return
        }
        
        // Draw original image
        ctx.drawImage(img, 0, 0)
        
        if (!simplified) {
          // Advanced preprocessing for desktop/high-end devices
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          
          // Convert to grayscale and enhance contrast
          for (let i = 0; i < data.length; i += 4) {
            const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
            // Enhance contrast
            const enhanced = gray < 128 ? Math.max(0, gray - 30) : Math.min(255, gray + 30)
            data[i] = enhanced     // Red
            data[i + 1] = enhanced // Green
            data[i + 2] = enhanced // Blue
          }
          
          ctx.putImageData(imageData, 0, 0)
        } else {
          // Simple preprocessing for mobile devices
          ctx.filter = 'contrast(1.2) brightness(1.1) grayscale(1)'
          ctx.drawImage(img, 0, 0)
        }
        
        resolve(canvas.toDataURL('image/jpeg', 0.9))
      }
      
      img.onerror = () => resolve(imageData) // Return original on error
      img.src = imageData
    })
  }
  
  // Enhanced text parsing with confidence scoring
  const parseBusinessCardTextAdvanced = (text: string, ocrData: any): Partial<ScannedCard> => {
    console.log('Advanced parsing with OCR data:', { confidence: ocrData.confidence })
    
    const result = parseBusinessCardText(text)
    
    // Add confidence-based validation
    if (ocrData.confidence) {
      if (ocrData.confidence < 60) {
        console.warn(`Low OCR confidence: ${ocrData.confidence}% - results may be inaccurate`)
      } else if (ocrData.confidence > 90) {
        console.log(`High OCR confidence: ${ocrData.confidence}% - results should be very accurate`)
      }
    }
    
    // Enhanced validation with better error handling
    if (result.email) {
      // More strict email validation
      const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/
      if (!emailRegex.test(result.email)) {
        console.log('Removing invalid email:', result.email)
        delete result.email
      }
    }
    
    if (result.phone) {
      // Clean and validate phone number
      const cleanPhone = result.phone.replace(/[^+\d\s-]/g, '')
      if (cleanPhone.length < 8) {
        console.log('Removing invalid phone:', result.phone)
        delete result.phone
      } else {
        result.phone = cleanPhone
      }
    }
    
    if (result.website) {
      // Validate website format
      const websiteRegex = /^(https?:\/\/)?(www\.)?[\w.-]+\.[A-Za-z]{2,}$/
      if (!websiteRegex.test(result.website)) {
        console.log('Removing invalid website:', result.website)
        delete result.website
      }
    }
    
    // Post-processing improvements
    if (result.name && result.company && result.name === result.company) {
      // If name and company are same, likely company is wrong
      console.log('Name and company are identical, removing company')
      delete result.company
    }
    
    console.log('Final parsed result:', result)
    return result
  }
  
  // UNIVERSAL helper functions for international business cards
  const containsBusinessWords = (text: string): boolean => {
    const businessWords = [
      // English
      'director', 'manager', 'ceo', 'cto', 'cfo', 'president', 'vice', 'senior', 'junior',
      'company', 'corporation', 'limited', 'inc', 'llc', 'ltd', 
      // Turkish  
      'müdür', 'direktör', 'yönetici', 'uzman', 'mühendis', 'koordinatör',
      'şirket', 'sanayi', 'ticaret', 'otomotiv',
      // Greek
      'διευθυντής', 'εταιρεία',
      // German
      'direktor', 'manager', 'gesellschaft', 'gmbh',
      // French  
      'directeur', 'société', 'sarl'
    ]
    return businessWords.some(word => text.includes(word))
  }
  
  const formatPersonName = (name: string): string => {
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }
  
  const isTurkishContext = (text: string): boolean => {
    const turkishIndicators = ['türkiye', 'istanbul', 'ankara', 'izmir', 'bursa', 'sanayi', 'ticaret', 'otomotiv', 'şirket']
    return turkishIndicators.some(indicator => text.toLowerCase().includes(indicator))
  }
  
  const isGreekContext = (text: string): boolean => {
    const greekIndicators = ['greece', 'athens', 'thessaloniki', 'chios', 'hellas']
    return greekIndicators.some(indicator => text.toLowerCase().includes(indicator))
  }

  const parseBusinessCardText = (text: string): Partial<ScannedCard> => {
    console.log('Original text:', text)
    
    // Split into lines first, then clean each line
    const rawLines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    // Clean unwanted characters from each line
    const lines = rawLines.map(line => 
      line
        .replace(/[⚫●◉◯○◆◇▪▫■□]/g, ' ') // Remove bullet points and shapes
        .replace(/[•·]/g, ' ') // Remove bullet symbols
        .replace(/\s+/g, ' ') // Normalize multiple spaces
        .trim()
    ).filter(line => line.length > 0)
    
    console.log('Raw lines:', rawLines)
    console.log('Cleaned lines:', lines)
    
    const cleanedText = lines.join('\n')
    const lowerText = cleanedText.toLowerCase()
    
    console.log('Parsing business card text with cleaned lines:', { lines })
    
    const result: Partial<ScannedCard> = {}
    
    // Enhanced email detection with multiple patterns
    const emailRegexes = [
      /[\w.-]+@[\w.-]+\.[A-Za-z]{2,}/g,
      // Handle OCR errors where @ becomes other chars - UNIVERSAL PATTERNS
      /[\w.-]+\.[\w.-]+\.(com\.tr|net\.tr|org\.tr|edu\.tr|gov\.tr)/gi,  // Turkish domains
      /[\w.-]+\.[\w.-]+\.(com|net|org|gr|de|fr|uk)/gi,  // International domains
      // More flexible patterns
      /[a-zA-Z]+\.[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]{2,}/gi, // name.surname@company.domain
      /[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]{2,}/gi // name@company.domain
    ]
    
    let foundEmail = ''
    
    // Try normal email patterns first
    for (const regex of emailRegexes) {
      const emailMatch = cleanedText.match(regex)
      if (emailMatch) {
        foundEmail = emailMatch[0].toLowerCase()
        console.log('Found direct email:', foundEmail)
        break
      }
    }
    
    // If no @ found, try to construct email from text patterns
    if (!foundEmail) {
      // Look for email-like patterns without @
      const emailPatterns = [
        /([a-zA-Z]+)\.([a-zA-Z]+)\.([a-zA-Z]+)\.(com\.tr|net\.tr|org\.tr)/gi,
        /([a-zA-Z]+)\.([a-zA-Z]+)\.(com\.tr|net\.tr|org\.tr)/gi,
        /([a-zA-Z]+)\.(com\.tr|net\.tr|org\.tr)/gi
      ]
      
      for (const pattern of emailPatterns) {
        const match = cleanedText.match(pattern)
        if (match) {
          const matched = match[0].toLowerCase()
          const parts = matched.split('.')
          
          if (parts.length >= 4) {
            // name.surname.company.domain → name.surname@company.domain
            foundEmail = parts.slice(0, 2).join('.') + '@' + parts.slice(2).join('.')
          } else if (parts.length >= 3) {
            // name.company.domain → name@company.domain
            foundEmail = parts[0] + '@' + parts.slice(1).join('.')
          }
          
          if (foundEmail) {
            console.log('Constructed email from pattern:', matched, '→', foundEmail)
            break
          }
        }
      }
    }
    
    if (foundEmail) {
      result.email = foundEmail
    }
    
    // Enhanced international phone number detection
    const phoneRegexes = [
      // International formats
      /\+[0-9]{1,3}[\s-]?[0-9]{2,4}[\s-]?[0-9]{2,4}[\s-]?[0-9]{2,5}/g,
      // Turkish formats
      /(\+90[\s-]?)?\(?([0-9]{3})\)?[\s.-]?([0-9]{3})[\s.-]?([0-9]{2})[\s.-]?([0-9]{2})/g,
      /0([0-9]{3})[\s.-]?([0-9]{3})[\s.-]?([0-9]{2})[\s.-]?([0-9]{2})/g,
      // Greek formats (based on the example)
      /\+[0-9]{4,5}[\s-][0-9]{5,6}/g,
      // Mobile formats
      /[0-9]{4}[\s-][0-9]{6}/g,
      // General format
      /[0-9]{3}[\s.-]?[0-9]{3}[\s.-]?[0-9]{2,4}/g
    ]
    
    const phoneNumbers = []
    for (const regex of phoneRegexes) {
      const matches = cleanedText.match(regex)
      if (matches) {
        phoneNumbers.push(...matches)
      }
    }
    
    // Select the most likely phone number (prioritize mobile/international)
    if (phoneNumbers.length > 0) {
      // Sort by preference: international > mobile > landline
      const sortedPhones = phoneNumbers.sort((a, b) => {
        const aScore = a.includes('+') ? 3 : (a.includes('mobile') ? 2 : 1)
        const bScore = b.includes('+') ? 3 : (b.includes('mobile') ? 2 : 1)
        return bScore - aScore
      })
      
      result.phone = sortedPhones[0].replace(/[\s().-]+/g, ' ').replace(/\s+/g, ' ').trim()
      console.log('Found phone:', result.phone)
    }
    
    // Enhanced website detection - fix OCR errors  
    const websiteRegexes = [
      /https?:\/\/[\w.-]+\.[A-Za-z]{2,}(\.[A-Za-z]{2,})?/gi,
      /www\.[\w.-]+\.[A-Za-z]{2,}(\.[A-Za-z]{2,})?/gi,
      // UNIVERSAL: Common OCR domain errors
      /www\.[\w.-]+\.(ar|tr)/gi,  // .com.ar often misread as .com.tr
      // Turkish double extensions first
      /[\w.-]+\.(com\.tr|net\.tr|org\.tr|edu\.tr|gov\.tr)/gi,
      // General domains
      /[\w.-]+\.(com|net|org|tr|gov|edu|co|info|biz|gr)/gi,
      /Site:[\s]*([\w.-]+\.[A-Za-z]{2,}(\.[A-Za-z]{2,})?)/gi,
      /Website:[\s]*([\w.-]+\.[A-Za-z]{2,}(\.[A-Za-z]{2,})?)/gi
    ]
    
    for (const regex of websiteRegexes) {
      const websiteMatch = cleanedText.match(regex)
      if (websiteMatch) {
        let website = websiteMatch[0].toLowerCase()
        
        // Clean up common prefixes
        website = website.replace(/^site:[\s]*/, '')
        website = website.replace(/^website:[\s]*/, '')
        
        // UNIVERSAL: Fix common OCR domain errors based on context
        if (website.includes('.com.ar') && isTurkishContext(cleanedText)) {
          website = website.replace('.com.ar', '.com.tr')
          console.log('Fixed Turkish context OCR: .com.ar → .com.tr')
        } else if (website.includes('.com.tr') && isGreekContext(cleanedText)) {
          website = website.replace('.com.tr', '.gr')
          console.log('Fixed Greek context OCR: .com.tr → .gr')
        }
        
        // Add www if needed
        if (!website.startsWith('http') && !website.startsWith('www')) {
          website = 'www.' + website
        }
        
        result.website = website
        console.log('Found website:', result.website)
        break
      }
    }
    
    // Smart name detection - FIXED: prioritize position 0 for Turkish names
    console.log('Looking for name in lines:', lines)
    
    // UNIVERSAL: First line name detection for international cards
    if (lines.length > 0) {
      const firstLine = lines[0]
      const words = firstLine.split(' ').filter(w => w.length > 0)
      
      // Universal person name patterns
      const isPersonName = words.length >= 2 && words.length <= 4 &&
                          words.every(word => /^[A-ZÀ-ÿ][a-zà-ÿ]+/i.test(word)) &&
                          !firstLine.includes('@') && !firstLine.includes('www') && 
                          !firstLine.includes('+') && !firstLine.includes('tel') &&
                          // Skip common business words in any language
                          !containsBusinessWords(firstLine.toLowerCase())
      
      if (isPersonName) {
        result.name = formatPersonName(firstLine)
        console.log('Found person name (first line):', result.name)
      }
    }
    
    // FALLBACK: If no name found from first line, try other methods
    if (!result.name) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const lowerLine = line.toLowerCase()
        
        // Skip lines that are clearly not names
        if (line.includes('@') || line.includes('www') || line.includes('+') || 
            lowerLine.includes('tel:') || lowerLine.includes('fax:') || lowerLine.includes('mobile:') ||
            lowerLine.includes('e-mail:') || lowerLine.includes('site:') || 
            lowerLine.includes('director') || lowerLine.includes('manager') ||
            line.length < 3 || line.length > 50) {
          console.log('Skipping line (not name):', line)
          continue
        }
        
        // Look for person name patterns
        const words = line.split(' ').filter(w => w.length > 0)
        
        // Strong person name indicators
        const isPersonName = words.length >= 2 && words.length <= 4 && 
                            words.every(word => /^[A-Z][a-z]+/.test(word) || /^[A-Z]\./.test(word))
        
        if (isPersonName) {
          result.name = line
            .split(' ')
            .map(word => 
              word.charAt(0).toUpperCase() + 
              word.slice(1).toLowerCase()
            )
            .join(' ')
          console.log('Found name (fallback pattern):', result.name)
          break
        }
      }
    }
    
    // More aggressive fallback if still no name
    if (!result.name) {
      console.log('No name found with strict rules, trying fallback...')
      for (let i = 0; i < Math.min(4, lines.length); i++) {
        const line = lines[i]
        const words = line.split(' ').filter(w => w.length > 0)
        
        // Skip obvious non-names
        if (line.includes('@') || line.includes('www') || line.includes('+') || 
            line.includes('tel') || line.includes('fax') || line.includes('site') ||
            line.length < 5 || line.length > 40) {
          continue
        }
        
        // Look for 2-4 word lines that could be names
        if (words.length >= 2 && words.length <= 4) {
          result.name = line
          console.log('Fallback name found:', result.name)
          break
        }
      }
    }
    
    // Enhanced title detection with scoring system
    const titleKeywords = [
      // Turkish titles (higher priority)
      { keyword: 'genel müdür', score: 10 },
      { keyword: 'pazarlama müdürü', score: 9 },
      { keyword: 'satış müdürü', score: 9 },
      { keyword: 'müdür', score: 8 },
      { keyword: 'yazılım mühendisi', score: 9 },
      { keyword: 'bilgisayar mühendisi', score: 9 },
      { keyword: 'mühendis', score: 7 },
      { keyword: 'yazılım geliştirici', score: 8 },
      { keyword: 'web geliştirici', score: 8 },
      { keyword: 'geliştirici', score: 6 },
      { keyword: 'kıdemli uzman', score: 8 },
      { keyword: 'proje uzmanı', score: 8 },
      { keyword: 'uzman', score: 6 },
      { keyword: 'proje koordinatörü', score: 8 },
      { keyword: 'koordinatör', score: 7 },
      { keyword: 'teknik danışman', score: 8 },
      { keyword: 'danışman', score: 6 },
      { keyword: 'program yönetimi', score: 8 },
      { keyword: 'yönetim', score: 7 },
      { keyword: 'direktör', score: 9 },
      { keyword: 'müdür yardımcısı', score: 8 },
      // English titles
      { keyword: 'chief executive officer', score: 10 },
      { keyword: 'chief technology officer', score: 10 },
      { keyword: 'chief financial officer', score: 10 },
      { keyword: 'general manager', score: 9 },
      { keyword: 'project manager', score: 8 },
      { keyword: 'senior manager', score: 8 },
      { keyword: 'managing director', score: 9 },
      { keyword: 'executive director', score: 9 },
      { keyword: 'manager', score: 7 },
      { keyword: 'director', score: 9 },
      { keyword: 'senior developer', score: 8 },
      { keyword: 'lead developer', score: 8 },
      { keyword: 'developer', score: 6 },
      { keyword: 'engineer', score: 6 },
      { keyword: 'specialist', score: 6 },
      { keyword: 'consultant', score: 6 },
      { keyword: 'ceo', score: 10 },
      { keyword: 'cto', score: 10 },
      { keyword: 'cfo', score: 10 },
      { keyword: 'senior', score: 5 },
      { keyword: 'lead', score: 5 },
      { keyword: 'head', score: 5 }
    ]
    
    console.log('Looking for titles in lines:', lines)
    
    let bestTitle = ''
    let bestScore = 0
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase()
      for (const { keyword, score } of titleKeywords) {
        if (lowerLine.includes(keyword) && score > bestScore) {
          bestTitle = line
          bestScore = score
        }
      }
    }
    
    if (bestTitle) {
      result.title = bestTitle
    }
    
    // Enhanced company detection - handle multi-line company names
    console.log('Looking for company in lines:', lines)
    
    const companyIndicators = [
      { keyword: 'a.ş.', score: 10 },
      { keyword: 'ltd.', score: 9 },
      { keyword: 'inc.', score: 9 },
      { keyword: 'corp.', score: 9 },
      { keyword: 'company', score: 7 },
      { keyword: 'rent a car', score: 8 }, // Based on the example
      { keyword: 'group', score: 6 },
      { keyword: 'tech', score: 5 },
      { keyword: 'smart', score: 4 }, // Based on the example
      { keyword: 'solutions', score: 5 },
      { keyword: 'service', score: 5 },
      { keyword: 'center', score: 4 },
      { keyword: 'agency', score: 6 }
    ]
    
    let bestCompany = ''
    let bestCompanyScore = 0
    
    // First, try to find multi-line company names (like "Smart\nrent a car")
    for (let i = 0; i < lines.length - 1; i++) {
      const line1 = lines[i]
      const line2 = lines[i + 1]
      const combined = `${line1} ${line2}`.toLowerCase()
      
      // Skip if either line contains contact info or is the person name
      if (line1.includes('@') || line2.includes('@') || 
          line1.includes('+') || line2.includes('+') ||
          line1 === result.name || line2 === result.name) {
        continue
      }
      
      // Check if combined lines make a good company name
      for (const { keyword, score } of companyIndicators) {
        if (combined.includes(keyword)) {
          const combinedName = `${line1} ${line2}`
          if (score + 5 > bestCompanyScore) { // Boost multi-line matches
            bestCompany = combinedName
            bestCompanyScore = score + 5
            console.log('Found multi-line company:', combinedName, 'Score:', bestCompanyScore)
          }
        }
      }
    }
    
    // Then try single lines
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lowerLine = line.toLowerCase()
      
      // Skip lines that are clearly not company names
      if (line.includes('@') || line.includes('www') || line.includes('+') || 
          lowerLine.includes('tel') || lowerLine.includes('fax') || lowerLine.includes('mobile') ||
          line === result.name || line === result.title) {
        continue
      }
      
      let lineScore = 0
      
      // Check for company indicators
      for (const { keyword, score } of companyIndicators) {
        if (lowerLine.includes(keyword)) {
          lineScore = Math.max(lineScore, score)
        }
      }
      
      // UNIVERSAL: Short company names (2-5 chars) often appear alone
      if (line.length >= 2 && line.length <= 8 && 
          !lowerLine.includes('www') && !lowerLine.includes('@') &&
          !lowerLine.includes('+') && !containsBusinessWords(lowerLine)) {
        lineScore += 6
        console.log('Short company name bonus:', line)
      }
      
      // Boost score for early lines (companies often at top)
      if (i === 0) lineScore += 3
      if (i === 1) lineScore += 2
      
      // PENALTY: Very long lines are less likely to be company names  
      if (line.length > 30) {
        lineScore -= 5
        console.log('Long line penalty:', line)
      }
      
      // Boost score for lines that look like company names
      if (line.length > 5 && line.length < 40 && !result.name?.includes(line)) {
        lineScore += 1
      }
      
      // Penalty for lines that look like person names
      const words = line.split(' ')
      if (words.length === 2 && words.every(w => /^[A-Z][a-z]+$/.test(w))) {
        lineScore -= 2
      }
      
      if (lineScore > bestCompanyScore) {
        bestCompany = line
        bestCompanyScore = lineScore
      }
    }
    
    if (bestCompany) {
      // Convert to proper title case (first letter of each word capitalized)
      result.company = bestCompany
        .toLowerCase()
        .split(' ')
        .map(word => {
          if (word.length === 0) return word
          // Handle special cases like "A.Ş." or "Ltd."
          if (word.includes('.')) {
            return word.toUpperCase()
          }
          // Regular title case
          return word.charAt(0).toUpperCase() + word.slice(1)
        })
        .join(' ')
      
      console.log('Found company (title case):', result.company, 'Score:', bestCompanyScore)
    }
    
    return result
  }

  // Text bounding box tabanlı akıllı kenar algılama
  const detectBusinessCardEdges = async (imageData: string): Promise<{ x: number, y: number, width: number, height: number } | null> => {
    try {
      console.log('📝 Using OCR text bounds for smart detection')
      
      // Convert data URL to base64
      const base64Image = imageData.replace(/^data:image\/[a-z]+;base64,/, '')
      
      // Normal OCR call to get text positions
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image: base64Image,
          type: 'business_card'
        })
      })
      
      if (!response.ok) {
        throw new Error(`OCR API error: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success && result.text) {
        console.log('✅ OCR text found, analyzing bounds...')
        
        // Basit text bounds analysis - resmin hangi kısımlarında text var?
        const img = new Image()
        
        return new Promise((resolve) => {
          img.onload = () => {
            const width = img.width
            const height = img.height
            
            // Text varsa muhtemelen kartvizit ortada/merkezdedir
            // Resmin %60'ı kadar bir alan öner
            const cardRatio = 1.586
            const imgRatio = width / height
            
            let cropWidth, cropHeight, cropX, cropY
            
            if (imgRatio > cardRatio) {
              // Yatay resim - yüksekliğin %60'ı al
              cropHeight = height * 0.6
              cropWidth = cropHeight * cardRatio
              cropX = (width - cropWidth) / 2
              cropY = (height - cropHeight) / 2
            } else {
              // Dikey resim - genişliğin %60'ı al
              cropWidth = width * 0.6
              cropHeight = cropWidth / cardRatio
              cropX = (width - cropWidth) / 2
              cropY = (height - cropHeight) / 2
            }
            
            console.log('📝 Text-based crop suggestion:', { 
              original: {width, height}, 
              crop: {x: cropX, y: cropY, width: cropWidth, height: cropHeight},
              confidence: result.confidence
            })
            
            resolve({
              x: Math.max(0, cropX),
              y: Math.max(0, cropY),
              width: Math.min(cropWidth, width),
              height: Math.min(cropHeight, height)
            })
          }
          
          img.onerror = () => resolve(null)
          img.src = imageData
        })
      }
      
      throw new Error('No OCR text found')
      
    } catch (error) {
      console.error('Text-based detection error:', error)
      console.log('⚠️ Disabling auto crop - too many failures')
      
      // Çok basit merkez kırpma
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          const width = img.width
          const height = img.height
          
          // Çok konservatif - sadece merkez %40
          const cropSize = Math.min(width, height) * 0.4
          const cropX = (width - cropSize) / 2
          const cropY = (height - cropSize) / 2
          
          console.log('🎯 Ultra-conservative crop:', {
            x: cropX, y: cropY, width: cropSize, height: cropSize
          })
          
          resolve({
            x: cropX,
            y: cropY, 
            width: cropSize,
            height: cropSize
          })
        }
        
        img.onerror = () => resolve(null)
        img.src = imageData
      })
    }
  }
  
  const applyCrop = () => {
    if (!editingCard?.imageData || !cropCanvasRef.current) return

    const canvas = cropCanvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate actual image dimensions vs display dimensions
      const displayImg = cropImageRef.current
      if (!displayImg) return

      const scaleX = img.naturalWidth / displayImg.clientWidth
      const scaleY = img.naturalHeight / displayImg.clientHeight

      // Set canvas size to crop area (scaled to actual image size)
      const actualCropWidth = cropArea.width * scaleX
      const actualCropHeight = cropArea.height * scaleY
      const actualCropX = cropArea.x * scaleX
      const actualCropY = cropArea.y * scaleY

      canvas.width = actualCropWidth
      canvas.height = actualCropHeight

      // Draw cropped portion
      ctx?.drawImage(
        img,
        actualCropX, actualCropY, actualCropWidth, actualCropHeight,
        0, 0, actualCropWidth, actualCropHeight
      )

      const croppedImageData = canvas.toDataURL('image/jpeg')
      
      // Update the card with cropped image
      const updatedCard = {
        ...editingCard,
        croppedImageData: croppedImageData
      }
      
      saveEditedCard(updatedCard)
    }

    img.src = editingCard.imageData
  }

  const handleQRScan = async () => {
    setScanMode('qr')
    await startQrScanning()
  }

  const handleCameraScan = async () => {
    setScanMode('camera')
    await startCamera()
  }

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #111827 0%, #7c3aed 25%, #ec4899 50%, #3730a3 75%, #111827 100%)',
        paddingTop: '5rem'
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 2rem'}}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{maxWidth: '64rem', margin: '0 auto'}}
          >
            <div style={{textAlign: 'center', marginBottom: '2rem', padding: '2rem 0'}}>
              <h1 style={{fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem'}}>Kartvizit Tarama</h1>
              <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem'}}>
                QR kod veya kamera ile kartvizit bilgilerini dijital ortama aktarın
              </p>
            </div>

            {/* Scanner Options */}
            {!scanMode && !isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleQRScan}
                  style={{
                    padding: '2rem',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  <QrCode style={{width: '4rem', height: '4rem', color: '#22d3ee', marginBottom: '1rem'}} />
                  <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem'}}>QR Kod Tarama</h3>
                  <p style={{color: 'rgba(255,255,255,0.7)', lineHeight: '1.4'}}>
                    Kartvizit üzerindeki QR kodu tarayarak bilgileri otomatik olarak kaydedin
                  </p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCameraScan}
                  style={{
                    padding: '2rem',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  <Camera style={{width: '4rem', height: '4rem', color: '#c084fc', marginBottom: '1rem'}} />
                  <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem'}}>Kamera ile Tarama</h3>
                  <p style={{color: 'rgba(255,255,255,0.7)', lineHeight: '1.4'}}>
                    Kartvizit fotoğrafı çekerek bilgileri otomatik olarak çıkarın
                  </p>
                </motion.button>

                <motion.a
                  href="/apps/saved-cards"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '2rem',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  <CreditCard style={{width: '4rem', height: '4rem', color: '#fbbf24', marginBottom: '1rem'}} />
                  <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem'}}>Kayıtlı Kartvizitler</h3>
                  <p style={{color: 'rgba(255,255,255,0.7)', lineHeight: '1.4'}}>
                    Daha önce taradığınız ve kaydettiğiniz kartvizitleri görüntüleyin
                  </p>
                </motion.a>
              </motion.div>
            )}

            {/* QR Scanner */}
            {scanMode === 'qr' && isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '2rem',
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}
              >
                <div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '6rem',
                    height: '6rem',
                    background: 'rgba(34,211,238,0.2)',
                    borderRadius: '50%',
                    marginBottom: '1rem'
                  }}>
                    <Scan style={{width: '3rem', height: '3rem', color: '#22d3ee', animation: 'pulse 2s infinite'}} />
                  </div>
                  <h3 style={{fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '0.5rem'}}>QR Kod Taranıyor...</h3>
                  <p style={{color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem'}}>
                    QR kodunu kamera görüş alanına getirin
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsScanning(false)
                      setScanMode(null)
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'rgba(239,68,68,0.2)',
                      color: '#f87171',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                  >
                    İptal Et
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Camera Scanner */}
            {scanMode === 'camera' && isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '1.5rem',
                  marginBottom: '2rem'
                }}
              >
                <div style={{position: 'relative'}}>
                  <video
                    ref={videoRef}
                    style={{
                      width: '100%',
                      height: '20rem',
                      objectFit: 'cover',
                      borderRadius: '0.75rem',
                      background: 'black'
                    }}
                    playsInline
                  />
                  <canvas
                    ref={canvasRef}
                    style={{display: 'none'}}
                  />
                  
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                  }}>
                    <div style={{
                      width: '16rem',
                      height: '10rem',
                      border: '2px dashed rgba(255,255,255,0.5)',
                      borderRadius: '0.5rem'
                    }}></div>
                  </div>
                </div>
                
                <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem'}}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={captureImage}
                    style={{
                      padding: '0.75rem 2rem',
                      background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
                      color: 'white',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      border: 'none'
                    }}
                  >
                    <Camera style={{width: '1.25rem', height: '1.25rem'}} />
                    Fotoğraf Çek
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={stopCamera}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'rgba(239,68,68,0.2)',
                      color: '#f87171',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                  >
                    <X style={{width: '1.25rem', height: '1.25rem'}} />
                    İptal
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Success/Error Messages */}
            {scanResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: 'rgba(34,197,94,0.2)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: '0.75rem',
                  marginBottom: '2rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle style={{width: '1.5rem', height: '1.5rem', color: '#4ade80'}} />
                  <span style={{color: '#4ade80', fontWeight: '500'}}>{scanResult}</span>
                </div>
                {scanResult.includes('başarıyla kaydedildi') && (
                  <motion.a
                    href="/apps/saved-cards"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: 'rgba(34,197,94,0.3)',
                      border: '1px solid rgba(34,197,94,0.5)',
                      borderRadius: '0.5rem',
                      color: '#4ade80',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <CreditCard className="w-4 h-4" />
                    Kayıtlı Kartvizitleri Görüntüle
                  </motion.a>
                )}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  background: 'rgba(239,68,68,0.2)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '0.75rem',
                  marginBottom: '2rem'
                }}
              >
                <AlertCircle style={{width: '1.5rem', height: '1.5rem', color: '#f87171'}} />
                <span style={{color: '#f87171', fontWeight: '500'}}>{error}</span>
              </motion.div>
            )}

            {/* Scanned Cards */}
            {scannedCards.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-6">
                  Taranan Kartvizitler ({scannedCards.length})
                </h3>
                
                <div className="space-y-4">
                  {scannedCards.map((card) => (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="flex gap-4">
                        {(card.croppedImageData || card.imageData) && (
                          <div className="w-24 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={card.croppedImageData || card.imageData} 
                              alt="Kartvizit" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div className="space-y-1">
                              <h4 className="text-white font-semibold text-lg">{card.name}</h4>
                              {card.title && (
                                <p className="text-white/80 text-sm">{card.title}</p>
                              )}
                              {card.company && (
                                <p className="text-white/70 text-sm">{card.company}</p>
                              )}
                              <div className="flex flex-wrap gap-4 mt-2">
                                {card.email && (
                                  <span className="text-cyan-400 text-sm">{card.email}</span>
                                )}
                                {card.phone && (
                                  <span className="text-purple-400 text-sm">{card.phone}</span>
                                )}
                                {card.website && (
                                  <span className="text-orange-400 text-sm">{card.website}</span>
                                )}
                              </div>
                              
                              {/* Location and Notes */}
                              <div className="flex flex-col gap-1 mt-2">
                                {card.location && (
                                  <div className="flex items-center gap-1 text-xs text-white/60">
                                    <MapPin className="w-3 h-3" />
                                    <span>{card.location}</span>
                                  </div>
                                )}
                                {card.notes && (
                                  <div className="flex items-center gap-1 text-xs text-white/60">
                                    <StickyNote className="w-3 h-3" />
                                    <span>{card.notes}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-white/50 text-xs">
                                {card.scannedAt.toLocaleString('tr-TR')}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-white/40">
                                <Calendar className="w-3 h-3" />
                                <span>{card.scannedAt.toLocaleDateString('tr-TR')}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Mobile-optimized button grid */}
                          <div className="grid grid-cols-2 gap-2 mt-3 sm:flex sm:flex-wrap">
                            {/* OCR Button - Show only if card is empty and we have image */}
                            {(!card.name || card.name === '') && card.imageData && (
                              <motion.button
                                onClick={() => performSmartOCR(card.imageData!, card.id)}
                                disabled={ocrProcessing}
                                className="px-3 py-3 bg-purple-500/20 text-purple-400 border border-purple-400/30 rounded-lg hover:bg-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50 min-h-[48px] col-span-2 sm:col-span-1"
                                whileHover={{ scale: ocrProcessing ? 1 : 1.05 }}
                                whileTap={{ scale: ocrProcessing ? 1 : 0.95 }}
                              >
                                <Scan className="w-4 h-4" />
                                <span className="font-medium">
                                  {ocrProcessing ? 'OCR Çalışıyor...' : 'OCR ile Doldur'}
                                </span>
                              </motion.button>
                            )}
                            
                            {/* Edit Button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => editCard(card)}
                              className="px-3 py-3 bg-blue-500/20 text-blue-400 border border-blue-400/30 rounded-lg hover:bg-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm min-h-[48px]"
                            >
                              <Edit3 className="w-4 h-4" />
                              <span className="font-medium sm:inline">Düzenle</span>
                            </motion.button>
                            
                            {/* Save to Collection Button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => saveToCollection(card)}
                              className="px-3 py-3 bg-green-500/20 text-green-400 border border-green-400/30 rounded-lg hover:bg-green-500/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm min-h-[48px]"
                            >
                              <Save className="w-4 h-4" />
                              <span className="font-medium">
                                <span className="sm:hidden">Kaydet</span>
                                <span className="hidden sm:inline">Kolleksiyona Ekle</span>
                              </span>
                            </motion.button>
                            
                            {/* Crop Button */}
                            {card.imageData && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  console.log('Kırp butonu tıklandı')
                                  setEditingCard(card)
                                  setCropMode(true)
                                  console.log('Modal state set:', { cropMode: true, editingCard: card.id })
                                  
                                  // Varsayılan kırpma alanı set et
                                  setTimeout(() => {
                                    const img = new Image()
                                    img.onload = () => {
                                      const defaultCrop = {
                                        x: img.width * 0.1,
                                        y: img.height * 0.1,
                                        width: img.width * 0.8,
                                        height: img.height * 0.8
                                      }
                                      setCropArea(defaultCrop)
                                      console.log('Varsayılan crop alanı set edildi:', defaultCrop)
                                    }
                                    img.src = card.imageData!
                                  }, 100)
                                }}
                                className="px-3 py-3 bg-purple-500/20 text-purple-400 border border-purple-400/30 rounded-lg hover:bg-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm min-h-[48px] col-span-2 sm:col-span-1"
                              >
                                <Crop className="w-4 h-4" />
                                <span className="font-medium">Kırp</span>
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Edit Card Modal */}
            {editingCard && (() => {
              console.log('Modal açılıyor:', { editingCard: editingCard.id, cropMode })
              return <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setEditingCard(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/20 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">
                      {cropMode ? 'Kartvizit Kırpma' : 'Kartvizit Düzenleme'}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingCard(null)
                        setCropMode(false)
                      }}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {cropMode && editingCard.imageData ? (
                    <div className="space-y-4">
                      <div className="relative bg-black rounded-lg overflow-hidden">
                        <img 
                          ref={cropImageRef}
                          src={editingCard.imageData} 
                          alt="Kartvizit" 
                          className="w-full h-auto max-h-96 object-contain"
                          onLoad={(e) => {
                            const img = e.target as HTMLImageElement
                            setCropArea({
                              x: 40,
                              y: 40,
                              width: Math.max(200, img.clientWidth * 0.6),
                              height: Math.max(120, img.clientHeight * 0.6)
                            })
                          }}
                        />
                        
                        {/* Crop Selection Overlay */}
                        <div 
                          className="absolute border-2 border-dashed border-purple-400 bg-purple-400/10 cursor-move"
                          style={{
                            left: cropArea.x,
                            top: cropArea.y,
                            width: cropArea.width,
                            height: cropArea.height,
                          }}
                          onMouseDown={(e) => {
                            const rect = e.currentTarget.parentElement?.getBoundingClientRect()
                            if (!rect) return
                            
                            const startX = e.clientX - rect.left - cropArea.x
                            const startY = e.clientY - rect.top - cropArea.y
                            
                            const handleMouseMove = (e: MouseEvent) => {
                              const newX = e.clientX - rect.left - startX
                              const newY = e.clientY - rect.top - startY
                              
                              setCropArea(prev => ({
                                ...prev,
                                x: Math.max(0, Math.min(newX, rect.width - prev.width)),
                                y: Math.max(0, Math.min(newY, rect.height - prev.height))
                              }))
                            }
                            
                            const handleMouseUp = () => {
                              document.removeEventListener('mousemove', handleMouseMove)
                              document.removeEventListener('mouseup', handleMouseUp)
                            }
                            
                            document.addEventListener('mousemove', handleMouseMove)
                            document.addEventListener('mouseup', handleMouseUp)
                          }}
                        >
                          <div className="absolute -top-6 left-0 bg-purple-500/80 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                            Kırpılacak alan - sürükleyerek taşıyın
                          </div>
                          
                          {/* Resize handles */}
                          <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-purple-400 cursor-se-resize"
                            onMouseDown={(e) => {
                              e.stopPropagation()
                              const rect = e.currentTarget.parentElement?.parentElement?.getBoundingClientRect()
                              if (!rect) return
                              
                              const handleMouseMove = (e: MouseEvent) => {
                                const newWidth = e.clientX - rect.left - cropArea.x
                                const newHeight = e.clientY - rect.top - cropArea.y
                                
                                setCropArea(prev => ({
                                  ...prev,
                                  width: Math.max(50, Math.min(newWidth, rect.width - prev.x)),
                                  height: Math.max(50, Math.min(newHeight, rect.height - prev.y))
                                }))
                              }
                              
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove)
                                document.removeEventListener('mouseup', handleMouseUp)
                              }
                              
                              document.addEventListener('mousemove', handleMouseMove)
                              document.addEventListener('mouseup', handleMouseUp)
                            }}
                          />
                        </div>
                      </div>
                      
                      <canvas ref={cropCanvasRef} className="hidden" />
                      
                      {/* Mobile-optimized modal buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setCropMode(false)
                            setEditingCard(null)
                          }}
                          className="px-4 py-3 bg-gray-500/20 text-gray-400 border border-gray-400/30 rounded-xl hover:bg-gray-500/30 transition-all duration-300 min-h-[48px] flex items-center justify-center"
                        >
                          İptal
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={applyCrop}
                          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2 min-h-[48px]"
                        >
                          <Crop className="w-4 h-4" />
                          Kırp ve Kaydet
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {editingCard.imageData && (
                        <div className="w-32 h-20 bg-white/10 rounded-lg overflow-hidden mx-auto">
                          <img 
                            src={editingCard.imageData} 
                            alt="Kartvizit" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/80 text-sm mb-2">Ad Soyad</label>
                          <input
                            type="text"
                            value={editingCard.name}
                            onChange={(e) => setEditingCard({...editingCard, name: e.target.value})}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-2">Unvan</label>
                          <input
                            type="text"
                            value={editingCard.title || ''}
                            onChange={(e) => setEditingCard({...editingCard, title: e.target.value})}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-2">Şirket</label>
                          <input
                            type="text"
                            value={editingCard.company || ''}
                            onChange={(e) => setEditingCard({...editingCard, company: e.target.value})}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-2">E-posta</label>
                          <input
                            type="email"
                            value={editingCard.email || ''}
                            onChange={(e) => setEditingCard({...editingCard, email: e.target.value})}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-2">Telefon</label>
                          <input
                            type="tel"
                            value={editingCard.phone || ''}
                            onChange={(e) => setEditingCard({...editingCard, phone: e.target.value})}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-2">Website</label>
                          <input
                            type="url"
                            value={editingCard.website || ''}
                            onChange={(e) => setEditingCard({...editingCard, website: e.target.value})}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-white/80 text-sm mb-2">Notlar</label>
                          <textarea
                            value={editingCard.notes || ''}
                            onChange={(e) => setEditingCard({...editingCard, notes: e.target.value})}
                            placeholder="Kartvizit hakkında notlarınızı yazın..."
                            rows={3}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 resize-none"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-2">Konum</label>
                          <input
                            type="text"
                            value={editingCard.location || ''}
                            onChange={(e) => setEditingCard({...editingCard, location: e.target.value})}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
                            placeholder="Kartvizit alındığı konum"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-white/80 text-sm mb-2">Tarih</label>
                          <input
                            type="date"
                            value={editingCard.scannedAt ? editingCard.scannedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                            onChange={(e) => setEditingCard({...editingCard, scannedAt: new Date(e.target.value)})}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>
                      
                      {/* AI Warning - Show in form if card has data from OCR */}
                      {editingCard.name && (editingCard.name !== '') && (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-400 flex items-start gap-2 mb-4">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium mb-1">⚠️ Yapay Zeka Uyarısı</div>
                            <div className="text-xs text-yellow-400/90">
                              Bu bilgiler OCR ile otomatik çıkarıldı. Kaydetmeden önce tüm alanları kontrol ediniz.
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Mobile-optimized modal buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setEditingCard(null)}
                          className="px-4 py-3 bg-gray-500/20 text-gray-400 border border-gray-400/30 rounded-xl hover:bg-gray-500/30 transition-all duration-300 min-h-[48px] flex items-center justify-center"
                        >
                          İptal
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => saveEditedCard(editingCard)}
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 min-h-[48px]"
                        >
                          <Save className="w-4 h-4" />
                          <span className="font-medium">Kaydet</span>
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            })()}
          </motion.div>
        </div>
      </div>
    </>
  )
}