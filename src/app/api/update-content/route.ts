import { NextResponse } from 'next/server';
import { updateSiteContent } from '@/lib/siteService';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Always update Firebase in production
    await updateSiteContent(data);
    
    return NextResponse.json({ message: 'Content updated successfully in Firebase' });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
