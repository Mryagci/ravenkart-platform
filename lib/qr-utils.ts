import QRCode from 'qrcode'

/**
 * Ziyaretçi sayfası için dinamik URL oluşturur (Yeni Ravenkart ziyaretçi bölümü)
 * @param cardId - Kart ID'si
 * @returns Ziyaretçi sayfası URL'i
 */
export function generateVisitorUrl(cardId: string): string {
  // NEXT_PUBLIC_APP_URL kullan, yoksa NODE_ENV'e göre belirle
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://www.ravenkart.com' 
      : 'http://localhost:3000')
  
  // Yeni ziyaretçi bölümü kullan
  return `${baseUrl}/ziyaretci/${cardId}`
}

/**
 * QR kod için dinamik URL oluşturur (geriye dönük uyumluluk için)
 * @param cardId - Kart ID'si
 * @returns QR kod taraması için dinamik URL
 */
export function generateDynamicQRUrl(cardId: string): string {
  return generateVisitorUrl(cardId)
}

/**
 * Kart için varsayılan hedef URL'i oluşturur
 * @param username - Kullanıcı adı
 * @returns Kartvizit sayfası URL'i
 */
export function generateDefaultCardUrl(username: string): string {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://ravenkart.com' 
    : 'http://localhost:3000'
  
  return `${baseUrl}/u/${username}`
}

/**
 * URL'in geçerli olup olmadığını kontrol eder
 * @param url - Kontrol edilecek URL
 * @returns Boolean değer
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    // Eğer protocol yoksa ekle ve tekrar dene
    try {
      new URL(`https://${url}`)
      return true
    } catch {
      return false
    }
  }
}

/**
 * URL'e protocol ekler (gerekiyorsa)
 * @param url - İşlenecek URL
 * @returns Protocol'lü URL
 */
export function normalizeUrl(url: string): string {
  if (!url) return ''
  
  // Zaten protocol varsa olduğu gibi döndür
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Protocol yoksa https ekle
  return `https://${url}`
}

/**
 * Kartvizit için QR kod oluşturur (Direkt website yönlendirme zorlamalı)
 * @param cardId - Kart ID'si
 * @param customUrl - İsteğe bağlı özel URL (yoksa varsayılan ziyaretçi sayfası kullanılır)
 * @returns Base64 QR kod resmi
 */
export async function generateQRCode(
  cardId: string, 
  customUrl?: string
): Promise<string> {
  try {
    // Her zaman Ravenkart domain'inde visitor sayfasını kullan
    let targetUrl = customUrl || generateVisitorUrl(cardId)
    
    // QR okuyucuların direkt website olarak algılaması için URL formatını zorla
    // vCard formatı veya başka format kullanmayalım, düz HTTP URL kullanın
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl
    }
    
    console.log('🔗 QR kod için DIREKT URL:', targetUrl)
    
    const qrCodeDataUrl = await QRCode.toDataURL(targetUrl, {
      width: 300,     // Daha da yüksek çözünürlük
      margin: 4,      // Daha fazla margin
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'L', // Düşük hata düzeltme (daha az veri, daha kolay tarama)
      type: 'image/png',
      quality: 1.0,
      rendererOpts: {
        quality: 1.0
      }
    })
    
    console.log('✅ QR kod başarıyla oluşturuldu - DIREKT YÖNLENDİRME MOD')
    return qrCodeDataUrl
  } catch (error) {
    console.error('QR kod oluşturulamadı:', error)
    throw new Error('QR kod oluşturulamadı')
  }
}

/**
 * Kartvizit için SVG QR kod oluşturur
 * @param cardId - Kart ID'si 
 * @param customUrl - İsteğe bağlı özel URL
 * @returns SVG string
 */
export async function generateQRCodeSVG(
  cardId: string,
  customUrl?: string
): Promise<string> {
  try {
    const targetUrl = customUrl || generateVisitorUrl(cardId)
    
    const svgString = await QRCode.toString(targetUrl, {
      type: 'svg',
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
    
    return svgString
  } catch (error) {
    console.error('SVG QR kod oluşturulamadı:', error)
    throw new Error('SVG QR kod oluşturulamadı')
  }
}