import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const input = searchParams.get('input');
    const types = searchParams.get('types');
    const language = searchParams.get('language') || 'en';

    if (!input) {
      return NextResponse.json(
        { error: 'Input parameter is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google API key is not configured' },
        { status: 500 }
      );
    }

    // Build the Google Places Autocomplete API URL
    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&key=${apiKey}&language=${language}`;

    if (types) {
      url += `&types=${encodeURIComponent(types)}`;
    }

    // Make the request to Google Places API
    const response = await fetch(url);
    const data = await response.json();

    // Return the response from Google Places API
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch autocomplete suggestions' },
      { status: 500 }
    );
  }
}

