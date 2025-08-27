import { NextRequest, NextResponse } from 'next/server'

// Force Node.js runtime for Google Cloud Vision compatibility
export const runtime = 'nodejs'

// Initialize Google Cloud Vision client
let visionClient: any = null

async function getVisionClient() {
  if (!visionClient) {
    try {
      // Dynamic import to avoid Edge runtime issues
      const { ImageAnnotatorClient } = await import('@google-cloud/vision')
      
      // Check if credentials are available
      const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
      
      if (credentials) {
        // Parse credentials from environment variable
        const credentialsObj = JSON.parse(credentials)
        visionClient = new ImageAnnotatorClient({
          credentials: credentialsObj
        })
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        // Use credentials file path
        visionClient = new ImageAnnotatorClient()
      } else {
        console.log('Google Cloud Vision credentials not configured, will use Tesseract.js only')
        return null
      }
    } catch (error) {
      console.error('Failed to initialize Google Cloud Vision:', error)
      return null
    }
  }
  
  return visionClient
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
    
    console.log('Processing OCR request (Hybrid approach)...', { getCropHints })
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(image, 'base64')
    
    // Try Google Cloud Vision first (if credentials available)
    try {
      console.log('Attempting Google Cloud Vision...')
      const client = await getVisionClient()
      
      // If no credentials, skip to Tesseract
      if (!client) {
        throw new Error('Vision client not available')
      }
      
      // If crop hints are requested, get them first
      if (getCropHints) {
        try {
          console.log('Getting crop hints from Google Vision...')
          const cropRequest = {
            image: { content: imageBuffer },
            features: [{ type: 'CROP_HINTS' as const, maxResults: 1 }]
          }
          
          const [cropResult] = await client.annotateImage(cropRequest)
          const cropHints = cropResult.cropHintsAnnotation?.cropHints
          
          if (cropHints && cropHints[0]) {
            const hint = cropHints[0]
            const vertices = hint.boundingPoly?.vertices
            
            if (vertices && vertices.length === 4) {
              console.log('Found crop hints:', vertices)
              return NextResponse.json({
                success: true,
                cropHint: {
                  x: Math.min(...vertices.map(v => v.x || 0)),
                  y: Math.min(...vertices.map(v => v.y || 0)), 
                  width: Math.max(...vertices.map(v => v.x || 0)) - Math.min(...vertices.map(v => v.x || 0)),
                  height: Math.max(...vertices.map(v => v.y || 0)) - Math.min(...vertices.map(v => v.y || 0))
                },
                confidence: hint.confidence || 0,
                provider: 'Google Cloud Vision CROP_HINTS'
              })
            }
          }
          
          console.log('No crop hints found, continuing with OCR')
        } catch (error) {
          console.error('Crop hints error:', error)
          console.log('Continuing with OCR')
        }
      }
      
      // Prepare the request for Google Cloud Vision OCR
      const visionRequest = {
        image: { content: imageBuffer },
        features: [
          { type: 'TEXT_DETECTION' as const, maxResults: 1 },
          { type: 'DOCUMENT_TEXT_DETECTION' as const, maxResults: 1 }
        ],
        imageContext: {
          languageHints: ['tr', 'en'] // Turkish and English
        }
      }
      
      // Perform OCR
      const [result] = await client.annotateImage(visionRequest)
      
      // Extract text from response
      const detections = result.textAnnotations
      const fullTextAnnotation = result.fullTextAnnotation
      
      let extractedText = ''
      let confidence = 0
      
      if (fullTextAnnotation && fullTextAnnotation.text) {
        extractedText = fullTextAnnotation.text
        
        // Calculate average confidence
        if (fullTextAnnotation.pages && fullTextAnnotation.pages[0]) {
          const page = fullTextAnnotation.pages[0]
          if (page.confidence !== undefined && page.confidence !== null) {
            confidence = Math.round(page.confidence * 100)
          }
        }
      } else if (detections && detections[0]) {
        extractedText = detections[0].description || ''
        
        if (detections[0].confidence !== undefined && detections[0].confidence !== null) {
          confidence = Math.round(detections[0].confidence * 100)
        }
      }
      
      if (extractedText && extractedText.trim().length > 0) {
        console.log('Google Cloud Vision OCR successful')
        console.log('Extracted text:', extractedText)
        console.log('Confidence:', confidence)
        
        return NextResponse.json({
          success: true,
          text: extractedText.trim(),
          confidence: confidence,
          provider: 'Google Cloud Vision',
          type: type
        })
      }
      
    } catch (error: any) {
      console.error('Google Cloud Vision failed:', error.message)
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