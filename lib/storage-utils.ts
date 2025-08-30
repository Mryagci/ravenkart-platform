import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Logo dosyasını Supabase Storage'a yükler
 * @param file - Yüklenecek dosya
 * @param userId - Kullanıcı ID'si
 * @param cardId - Kart ID'si (opsiyonel, güncelleme için)
 * @returns Public URL
 */
export async function uploadLogo(
  file: File,
  userId: string,
  cardId?: string
): Promise<string> {
  try {
    // Dosya formatı kontrolü
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Geçersiz dosya formatı. JPG, PNG, SVG veya WebP kullanın.')
    }

    // Dosya boyutu kontrolü (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('Dosya boyutu 5MB\'dan küçük olmalıdır.')
    }

    // Dosya adı oluştur
    const fileExt = file.name.split('.').pop()
    const fileName = cardId 
      ? `${cardId}.${fileExt}` // Güncelleme: mevcut cardId kullan
      : `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}` // Yeni: timestamp + random

    const filePath = `${userId}/${fileName}`

    console.log('📤 Logo yükleniyor:', filePath)

    // Dosyayı Storage'a yükle
    const { data, error } = await supabase.storage
      .from('logos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Aynı dosya varsa üzerine yaz
      })

    if (error) {
      console.error('Storage upload error:', error)
      throw new Error(`Logo yüklenirken hata oluştu: ${error.message}`)
    }

    // Public URL'i al
    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath)

    console.log('✅ Logo yüklendi:', publicUrl)
    return publicUrl

  } catch (error) {
    console.error('Logo upload hatası:', error)
    throw error
  }
}

/**
 * Logo dosyasını Storage'dan siler
 * @param logoUrl - Silinecek logo URL'i
 * @param userId - Kullanıcı ID'si (güvenlik için)
 */
export async function deleteLogo(logoUrl: string, userId: string): Promise<void> {
  try {
    if (!logoUrl || !logoUrl.includes('/logos/')) {
      return // Logo URL geçersizse sessizce çık
    }

    // URL'den dosya yolunu çıkar
    const urlParts = logoUrl.split('/logos/')
    if (urlParts.length !== 2) {
      console.warn('Geçersiz logo URL formatı:', logoUrl)
      return
    }

    const filePath = urlParts[1]

    // Güvenlik: dosya yolu kullanıcının klasöründe mi kontrol et
    if (!filePath.startsWith(`${userId}/`)) {
      throw new Error('Bu logo dosyasını silme yetkiniz yok')
    }

    console.log('🗑️ Logo siliniyor:', filePath)

    const { error } = await supabase.storage
      .from('logos')
      .remove([filePath])

    if (error) {
      console.error('Logo silme hatası:', error)
      // Silme hatası kritik değil, devam et
    } else {
      console.log('✅ Logo silindi:', filePath)
    }

  } catch (error) {
    console.error('Logo silme işlemi hatası:', error)
    // Silme hatası uygulama akışını bozmasın
  }
}

/**
 * Kullanıcının logo dosya boyutunu kontrol eder
 * @param userId - Kullanıcı ID'si
 * @returns Toplam boyut (bytes)
 */
export async function getUserLogoSize(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase.storage
      .from('logos')
      .list(userId, {
        limit: 100,
        offset: 0
      })

    if (error) {
      console.error('Logo boyut kontrolü hatası:', error)
      return 0
    }

    const totalSize = data?.reduce((sum, file) => sum + (file.metadata?.size || 0), 0) || 0
    return totalSize

  } catch (error) {
    console.error('Logo boyut hesaplama hatası:', error)
    return 0
  }
}

/**
 * Logo URL'inin geçerliliğini kontrol eder
 * @param logoUrl - Kontrol edilecek URL
 * @returns Boolean
 */
export function isValidLogoUrl(logoUrl: string): boolean {
  if (!logoUrl) return false
  
  try {
    const url = new URL(logoUrl)
    return url.pathname.includes('/logos/') && 
           (url.hostname.includes('supabase') || url.hostname.includes('localhost'))
  } catch {
    return false
  }
}