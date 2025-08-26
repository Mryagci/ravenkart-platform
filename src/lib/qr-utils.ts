/**
 * QR kod için dinamik URL oluşturur
 * @param cardId - Kart ID'si
 * @returns QR kod taraması için dinamik URL
 */
export function generateDynamicQRUrl(cardId: string): string {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://ravenkart.com' 
    : 'http://localhost:3000'
  
  return `${baseUrl}/qr/${cardId}`
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