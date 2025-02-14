import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    // For now, always return 'happy' regardless of input
    return NextResponse.json({ mood: 'happy' });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to analyze mood' },
      { status: 500 }
    );
  }
} 