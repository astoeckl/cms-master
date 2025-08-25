/**
 * Search Suggestions API Route - Proxy to Cognitor Backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '5');

    if (!term || term.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const response = await searchService.getSuggestions(term.trim(), limit);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search Suggestions API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get suggestions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
