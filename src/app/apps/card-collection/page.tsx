'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CardCollectionPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to saved-cards page
    router.push('/apps/saved-cards')
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ color: 'white', textAlign: 'center' }}>
        <h2>Yönlendiriliyor...</h2>
        <p>Kartvizit kolleksiyonunuza yönlendiriliyorsunuz.</p>
      </div>
    </div>
  )
}