import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Dynamic import to avoid initialization during build
    const { getAdminDb } = await import('@/lib/firebaseAdmin');
    const adminDb = getAdminDb();
    
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin not available' }, { status: 503 });
    }
    
    const data = await request.json();
    
    // Use Admin SDK to bypass security rules for server-side writing
    await adminDb.collection('site-config').doc('main-content').set(data);
    
    return NextResponse.json({ message: 'Content updated successfully in Firebase' });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
