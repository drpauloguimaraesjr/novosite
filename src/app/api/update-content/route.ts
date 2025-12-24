import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Use Admin SDK to bypass security rules for server-side writing
    await adminDb.collection('site-config').doc('main-content').set(data);
    
    return NextResponse.json({ message: 'Content updated successfully in Firebase' });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
