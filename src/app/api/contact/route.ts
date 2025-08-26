import { NextResponse } from 'next/server';
import { ContactStorage } from '@/lib/contact-storage';

// GET - Public endpoint to fetch contact information for homepage
export async function GET() {
  try {
    const contactInfo = ContactStorage.get();
    console.log('Public API returning:', contactInfo.address?.district); // Debug log
    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}