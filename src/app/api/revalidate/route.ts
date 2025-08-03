/**
 * On-Demand Revalidation API for CMS Updates
 * 
 * Usage: POST /api/revalidate
 * Body: { secret: "your-secret", paths: ["/page-slug"], tags: ["pages"] }
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, paths, tags } = body;

    // Verify secret token (set in environment variables)
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Revalidate specific paths
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path);
        console.log(`✅ Revalidated path: ${path}`);
      }
    }

    // Revalidate cache tags
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        revalidateTag(tag);
        console.log(`✅ Revalidated tag: ${tag}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Revalidation completed',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Revalidation failed', error: String(error) },
      { status: 500 }
    );
  }
}

// Handle GET requests for testing
export async function GET() {
  return NextResponse.json({
    message: 'Revalidation endpoint active',
    usage: 'POST with { secret, paths?, tags? }'
  });
}