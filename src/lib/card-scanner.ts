import { createClient } from '@supabase/supabase-js'

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
  private supabase: any = null

  private getSupabase() {
    if (!this.getSupabase()) {
      this.getSupabase() = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    }
    return this.getSupabase()
  }

  /**
   * Save a scanned card to the database
   */
  async saveScannedCard(cardData: ScannedCardData): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await this.getSupabase().auth.getUser()
      
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      const { error } = await this.getSupabase()
        .from('scanned_cards')
        .insert({
          ...cardData,
          user_id: user.id,
          scanned_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error saving card:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error saving card:', error)
      return { success: false, error: 'Failed to save card' }
    }
  }

  /**
   * Get all scanned cards for the current user
   */
  async getScannedCards(): Promise<{ success: boolean; data?: ScannedCardData[]; error?: string }> {
    try {
      const { data: { user } } = await this.getSupabase().auth.getUser()
      
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      const { data, error } = await this.getSupabase()
        .from('scanned_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('scanned_at', { ascending: false })

      if (error) {
        console.error('Error fetching cards:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Error fetching cards:', error)
      return { success: false, error: 'Failed to fetch cards' }
    }
  }

  /**
   * Delete a scanned card
   */
  async deleteScannedCard(cardId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await this.getSupabase().auth.getUser()
      
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      const { error } = await this.getSupabase()
        .from('scanned_cards')
        .delete()
        .eq('id', cardId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting card:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting card:', error)
      return { success: false, error: 'Failed to delete card' }
    }
  }

  /**
   * Process QR code data and extract business card information
   */
  parseQRCodeData(qrData: string): ScannedCardData | null {
    try {
      // Try parsing as JSON first
      const parsed = JSON.parse(qrData)
      return {
        name: parsed.name || '',
        title: parsed.title || parsed.position,
        company: parsed.company || parsed.organization,
        email: parsed.email,
        phone: parsed.phone || parsed.mobile,
        website: parsed.website || parsed.url,
        address: parsed.address
      }
    } catch {
      // If not JSON, try parsing as vCard format
      return this.parseVCard(qrData)
    }
  }

  /**
   * Parse vCard format data
   */
  private parseVCard(vCardData: string): ScannedCardData | null {
    try {
      const lines = vCardData.split('\n')
      const card: ScannedCardData = { name: '' }

      for (const line of lines) {
        const [key, value] = line.split(':')
        if (!key || !value) continue

        switch (key.toUpperCase()) {
          case 'FN':
            card.name = value
            break
          case 'TITLE':
            card.title = value
            break
          case 'ORG':
            card.company = value
            break
          case 'EMAIL':
            card.email = value
            break
          case 'TEL':
            card.phone = value
            break
          case 'URL':
            card.website = value
            break
          case 'ADR':
            card.address = value
            break
        }
      }

      return card.name ? card : null
    } catch {
      return null
    }
  }

  /**
   * Simulate OCR processing of business card image
   * In a real implementation, this would use an OCR service
   */
  async processBusinessCardImage(imageData: string): Promise<ScannedCardData | null> {
    // This is a mock implementation
    // In production, you would send the image to an OCR service
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: 'John Doe',
          title: 'Software Engineer',
          company: 'Tech Corp',
          email: 'john@techcorp.com',
          phone: '+1 234 567 8900'
        })
      }, 1500)
    })
  }
}