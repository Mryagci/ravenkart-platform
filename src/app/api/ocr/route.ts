import { NextRequest, NextResponse } from 'next/server'

// Force Node.js runtime for API calls
export const runtime = 'nodejs'

// Google Cloud Vision REST API
async function performGoogleVisionOCR(imageBase64: string) {
  const apiKey = process.env.GOOGLE_VISION_API_KEY
  
  if (!apiKey) {
    console.log('Google Vision API key not configured, skipping')
    return null
  }

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
      throw new Error(`Google Vision API error: ${response.status}`)
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
    
    // Fallback to Tesseract.js
    try {
      console.log('Processing with Tesseract.js...')
      
      // Dynamic import to avoid Edge runtime issues
      const Tesseract = await import('tesseract.js')
      
      // Create a new image from buffer for Tesseract
      const imageForTesseract = `data:image/jpeg;base64,${image}`
      
      // Create worker with proper configuration for Node.js environment
      const worker = await Tesseract.default.createWorker('eng+tur', 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            console.log(`Tesseract progress: ${Math.round(m.progress * 100)}%`)
          }
        }
      })
      
      console.log('Tesseract worker created, recognizing text...')
      const { data: { text, confidence } } = await worker.recognize(imageForTesseract)
      
      console.log('Tesseract recognition complete, terminating worker...')
      await worker.terminate()
      
      console.log('=== TESSERACT OCR RESULTS ===')
      console.log('Raw text:', JSON.stringify(text))
      console.log('Text length:', text?.length || 0)
      console.log('Confidence:', confidence)
      console.log('============================')
      
      if (!text || text.trim().length === 0) {
        console.log('No text detected by Tesseract')
        return NextResponse.json(
          { error: 'No text detected in image by any OCR provider' },
          { status: 400 }
        )
      }
      
      console.log('Tesseract OCR completed successfully')
      console.log('Final extracted text:', text.trim())
      console.log('Final confidence:', Math.round(confidence))
      
      const response = {
        success: true,
        text: text.trim(),
        confidence: Math.round(confidence),
        provider: 'Tesseract.js',
        type: 'business_card'
      }
      
      console.log('Sending response:', JSON.stringify(response))
      return NextResponse.json(response)
      
    } catch (tesseractError: any) {
      console.error('Tesseract OCR Error:', tesseractError)
      
      return NextResponse.json(
        { 
          error: 'OCR processing failed with all providers',
          details: tesseractError.message,
          provider: 'Hybrid OCR - All methods failed'
        },
        { status: 500 }
      )
    }
    
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