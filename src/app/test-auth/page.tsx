'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TestAuth() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [testResult, setTestResult] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user }, error } = await supabase.auth.getUser()
      console.log('Auth check result:', { user, error })
      setUser(user)
    } catch (error) {
      console.error('Auth check error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function testLogin() {
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'erkinyagci@hotmail.com',
        password: 'test123'
      })
      if (error) {
        alert('Login error: ' + error.message)
      } else {
        alert('Login successful!')
        checkUser()
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  async function testQRSave() {
    if (!user) {
      alert('Please login first')
      return
    }

    try {
      const response = await fetch('/api/qr-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cardId: Date.now().toString(),
          cardData: {
            name: "Test User",
            username: "testuser" + Date.now(),
            title: "Developer",
            email: "test@example.com"
          },
          userId: user.id
        })
      })

      const result = await response.json()
      setTestResult(JSON.stringify(result, null, 2))
      
      if (response.ok) {
        alert('QR code saved successfully!')
      } else {
        alert('Error: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('QR save error:', error)
      setTestResult('Network error: ' + error.message)
    }
  }

  if (loading) {
    return <div className="p-8">Loading auth status...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Auth Status</h2>
        {user ? (
          <div className="text-green-600">
            <p>✅ Logged in as: {user.email}</p>
            <p>User ID: {user.id}</p>
          </div>
        ) : (
          <p className="text-red-600">❌ Not logged in</p>
        )}
      </div>

      <div className="space-y-4">
        <button 
          onClick={testLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Login
        </button>
        
        <button 
          onClick={testQRSave}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-4"
        >
          Test QR Save
        </button>

        <button 
          onClick={() => router.push('/create-card')}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 ml-4"
        >
          Go to Create Card
        </button>
      </div>

      {testResult && (
        <div className="mt-6 bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Test Result:</h3>
          <pre className="text-sm text-gray-700">{testResult}</pre>
        </div>
      )}
    </div>
  )
}