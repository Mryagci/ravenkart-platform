import { NextRequest, NextResponse } from 'next/server';
import { ContactStorage } from '@/lib/contact-storage';

// GET - Fetch contact information
export async function GET() {
  try {
    const contactInfo = ContactStorage.get();
    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update contact information
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || !value) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 });
    }

    contactInfo = {
      ...contactInfo,
      [key]: value
    };

    return NextResponse.json({ success: true, data: contactInfo });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Bulk update contact information
export async function POST(request: NextRequest) {
  try {
    const newContactData = await request.json();
    
    // Update the in-memory contact info
    contactInfo = {
      ...contactInfo,
      ...newContactData
    };

    return NextResponse.json({ success: true, message: 'Contact information updated successfully' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}