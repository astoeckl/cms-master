/**
 * Search API Route - Proxy to Cognitor Backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchService } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || undefined;
    const tags = searchParams.get('tags')?.split(',') || undefined;

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const response = await searchService.search({
      query: query.trim(),
      limit,
      offset: (page - 1) * limit,
      filters: {
        category,
        tags,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { 
        error: 'Search failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
