import { NextRequest, NextResponse } from 'next/server'

// Force Node.js runtime for API calls with explicit config
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Google Cloud Vision REST API
async function performGoogleVisionOCR(imageBase64: string) {
  const apiKey = process.env.GOOGLE_VISION_API_KEY
  
  if (!apiKey) {
    console.log('Google Vision API key not configured, skipping')
    return null
  }
  
  console.log('Google Vision API Key present:', apiKey ? 'YES' : 'NO')
  console.log('Image data length:', imageBase64.length)

  try {
    const body = {
      requests: [{
        image: { content: imageBase64 },
        features: [
          { type: 'TEXT_DETECTION', maxResults: 1 },
          { type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1 }
        ],
        imageContext: {
          languageHints: ['tr', 'en'] // Turkish and English
        }
      }]
    }

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Vision API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`Google Vision API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return data.responses?.[0]
  } catch (error) {
    console.error('Google Vision REST API error:', error)
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { image, type = 'business_card', getCropHints = false } = body
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }
    
    console.log('Processing OCR request (Hybrid REST approach)...', { getCropHints })
    
    // Try Google Cloud Vision first (REST API)
    try {
      console.log('Attempting Google Vision REST API...')
      const visionResult = await performGoogleVisionOCR(image)
      
      if (visionResult) {
        // Extract text from Vision API response
        const detections = visionResult.textAnnotations
        const fullTextAnnotation = visionResult.fullTextAnnotation
        
        let extractedText = ''
        let confidence = 0
        
        if (fullTextAnnotation?.text) {
          extractedText = fullTextAnnotation.text
          
          // Calculate average confidence
          if (fullTextAnnotation.pages?.[0]?.confidence !== undefined) {
            confidence = Math.round(fullTextAnnotation.pages[0].confidence * 100)
          }
        } else if (detections?.[0]) {
          extractedText = detections[0].description || ''
          
          if (detections[0].confidence !== undefined) {
            confidence = Math.round(detections[0].confidence * 100)
          }
        }
        
        if (extractedText && extractedText.trim().length > 0) {
          console.log('Google Vision REST API successful')
          console.log('Extracted text:', extractedText)
          console.log('Confidence:', confidence)
          
          return NextResponse.json({
            success: true,
            text: extractedText.trim(),
            confidence: confidence,
            provider: 'Google Cloud Vision REST',
            type: type
          })
        }
      }
      
    } catch (error: any) {
      console.error('Google Vision REST API failed:', error.message)
      console.log('Falling back to Tesseract.js...')
    }
    
    // For now, skip Tesseract.js fallback to avoid worker issues
    console.log('Google Vision failed and Tesseract.js temporarily disabled')
    return NextResponse.json(
      { 
        error: 'OCR processing failed - Google Vision API unavailable',
        details: 'Google Vision API key issue or service error',
        provider: 'Google Vision REST API'
      },
      { status: 500 }
    )
    
  } catch (error: any) {
    console.error('General OCR Error:', error)
    
    return NextResponse.json(
      { 
        error: 'OCR processing failed',
        details: error.message
      },
      { status: 500 }
    )
  }
}