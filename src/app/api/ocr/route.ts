import { NextRequest, NextResponse } from 'next/server'
import { ImageAnnotatorClient } from '@google-cloud/vision'
import Tesseract from 'tesseract.js'

// Initialize Google Cloud Vision client
let visionClient: ImageAnnotatorClient | null = null

function getVisionClient() {
  if (!visionClient) {
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
      throw new Error('Google Cloud Vision credentials not configured')
    }
  }
  
  return visionClient
}

export async function POST(req: NextRequest) {
  try {
    const { image, type = 'business_card', getCropHints = false } = await req.json()
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }
    
    console.log('Processing OCR request with Google Cloud Vision...', { getCropHints })
    
    // Get Vision API client
    const client = getVisionClient()
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(image, 'base64')
    
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
        
        console.log('No crop hints found, falling back to OCR')
      } catch (error) {
        console.error('Crop hints error:', error)
        console.log('Falling back to OCR')
      }
    }
    
    // Prepare the request for Google Cloud Vision OCR
    const visionRequest = {
      image: {
        content: imageBuffer,
      },
      features: [
        {
          type: 'TEXT_DETECTION' as const,
          maxResults: 1
        },
        {
          type: 'DOCUMENT_TEXT_DETECTION' as const,
          maxResults: 1
        }
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
      // Use document text detection for better structured text
      extractedText = fullTextAnnotation.text
      
      // Calculate average confidence
      if (fullTextAnnotation.pages && fullTextAnnotation.pages[0]) {
        const page = fullTextAnnotation.pages[0]
        if (page.confidence !== undefined && page.confidence !== null) {
          confidence = Math.round(page.confidence * 100)
        }
      }
    } else if (detections && detections[0]) {
      // Fallback to basic text detection
      extractedText = detections[0].description || ''
      
      // Use detection confidence
      if (detections[0].confidence !== undefined && detections[0].confidence !== null) {
        confidence = Math.round(detections[0].confidence * 100)
      }
    }
    
    if (!extractedText) {
      return NextResponse.json(
        { error: 'No text detected in image' },
        { status: 400 }
      )
    }
    
    console.log('OCR completed successfully')
    console.log('Extracted text:', extractedText)
    console.log('Confidence:', confidence)
    
    return NextResponse.json({
      success: true,
      text: extractedText,
      confidence: confidence,
      provider: 'Google Cloud Vision',
      type: type
    })
    
  } catch (error: any) {
    console.error('Google Cloud Vision OCR Error:', error)
    
    // Fallback to Tesseract.js if Google Cloud Vision fails
    console.log('Falling back to Tesseract.js...')
    
    try {
      const { image } = await req.clone().json()
      const imageBuffer = Buffer.from(image, 'base64')
      
      console.log('Processing with Tesseract.js...')
      const { data: { text, confidence } } = await Tesseract.recognize(imageBuffer, 'eng+tur', {
        logger: m => console.log(m)
      })
      
      if (!text || text.trim().length === 0) {
        return NextResponse.json(
          { error: 'No text detected in image' },
          { status: 400 }
        )
      }
      
      console.log('Tesseract OCR completed successfully')
      console.log('Extracted text:', text)
      console.log('Confidence:', Math.round(confidence))
      
      return NextResponse.json({
        success: true,
        text: text.trim(),
        confidence: Math.round(confidence),
        provider: 'Tesseract.js (Fallback)',
        type: 'business_card'
      })
      
    } catch (tesseractError: any) {
      console.error('Tesseract OCR Error:', tesseractError)
      
      return NextResponse.json(
        { 
          error: 'OCR processing failed with both providers',
          googleError: error.message,
          tesseractError: tesseractError.message,
          provider: 'Both Google Cloud Vision and Tesseract.js failed'
        },
        { status: 500 }
      )
    }
  }
}