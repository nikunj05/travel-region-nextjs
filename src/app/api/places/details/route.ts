import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const placeId = searchParams.get('place_id');
    const language = searchParams.get('language') || 'en';

    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID parameter is required' },
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

    // Build the Google Places Details API URL
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&fields=geometry&key=${apiKey}&language=${language}`;

    // Make the request to Google Places API
    const response = await fetch(url);
    const data = await response.json();

    // Return the response from Google Places API
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching place details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch place details' },
      { status: 500 }
    );
  }
}

