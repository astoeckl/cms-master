/**
 * All Pages Overview
 */

import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { pagesService } from "@/lib/api";

export const metadata: Metadata = {
  title: "All Pages",
  description: "Browse all available pages and content",
};

export default function PagesOverview() {
  return (
    <div className="container max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">All Pages</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse through all available content and pages on this site
        </p>
      </div>

      {/* Pages Grid */}
      <Suspense fallback={<PagesGridSkeleton />}>
        <PagesGrid />
      </Suspense>
    </div>
  );
}

/**
 * Pages Grid Component
 */
async function PagesGrid() {
  try {
    const response = await pagesService.getPages({
      status: 'published',
      limit: 50,
    });



    if (!response.success || response.data.items.length === 0) {
      return <NoPagesFound />;
    }

    const pages = response.data.items;

    return (
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Card key={page.id} className="group hover:shadow-lg transition-shadow">
              <Link href={`/${page.slug}`}>
                {/* Featured Image */}
                {page.featuredImage && (
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
                    <Image
                      src={page.featuredImage.url}
                      alt={page.featuredImage.alt || page.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}

                <CardHeader className="space-y-3">
                  {/* Category */}
                  {page.category && (
                    <Badge variant="secondary" className="w-fit">
                      {page.category.name}
                    </Badge>
                  )}

                  {/* Title */}
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {page.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Excerpt */}
                  {page.excerpt && (
                    <p className="text-muted-foreground line-clamp-3 text-sm">
                      {page.excerpt}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <time dateTime={page.updated_at}>
                        {new Date(page.updated_at).toLocaleDateString()}
                      </time>
                    </div>
                    
                    {page.author && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{page.author.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {page.tags && page.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {page.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {page.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{page.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Load More Button (if pagination available) */}
        {response.data.pagination?.hasNext && (
          <div className="text-center">
            <Button variant="outline">
              Load More Pages
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Failed to load pages:', error);
    
    // Provide more detailed error information in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
    
    return <PagesError error={error instanceof Error ? error.message : String(error)} />;
  }
}

/**
 * No pages found state
 */
function NoPagesFound() {
  return (
    <div className="text-center py-12">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">No Pages Found</h3>
        <p className="text-muted-foreground">
          There are currently no published pages available.
        </p>
        <Button asChild>
          <Link href="/">
            <ArrowRight className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * Error state
 */
function PagesError({ error }: { error?: string }) {
  return (
    <div className="text-center py-12">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Error Loading Pages</h3>
        <p className="text-muted-foreground">
          There was an error loading the pages. Please try again.
        </p>
        {error && process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left max-w-2xl mx-auto">
            <p className="text-sm text-red-800 font-medium mb-2">Development Error Details:</p>
            <pre className="text-xs text-red-700 whitespace-pre-wrap break-words">
              {error}
            </pre>
          </div>
        )}
        <Button variant="outline" asChild>
          <Link href="/pages">
            Try Again
          </Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * Loading skeleton
 */
function PagesGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <Card key={index}>
          <Skeleton className="aspect-[16/10] w-full rounded-t-lg" />
          <CardHeader className="space-y-3">
            <Skeleton className="h-5 w-16" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex flex-wrap gap-1">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-10" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}