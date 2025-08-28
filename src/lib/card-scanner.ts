// Minimal version for build success
export interface ScannedCardData {
  id?: string
  name: string
  title?: string
  company?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  notes?: string
  scannedAt?: Date
  userId?: string
}

export class CardScannerService {
  async saveScannedCard(cardData: ScannedCardData): Promise<{ success: boolean; error?: string }> {
    // Minimal implementation to prevent build errors
    console.warn('CardScannerService: Not implemented in build mode')
    return { success: false, error: 'Not available during build' }
  }

  async getScannedCards(userId: string): Promise<{ data: ScannedCardData[]; error?: string }> {
    console.warn('CardScannerService: Not implemented in build mode') 
    return { data: [], error: 'Not available during build' }
  }

  async deleteScannedCard(cardId: string): Promise<{ success: boolean; error?: string }> {
    console.warn('CardScannerService: Not implemented in build mode')
    return { success: false, error: 'Not available during build' }
  }
}