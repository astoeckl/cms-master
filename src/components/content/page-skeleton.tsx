/**
 * Page Content Skeleton Loading Component
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function PageSkeleton() {
  return (
    <article className="space-y-8">
      {/* Page Header Skeleton */}
      <header className="space-y-6">
        {/* Category */}
        <div className="flex justify-center">
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Title */}
        <div className="text-center space-y-4">
          <div className="space-y-3">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-12 w-1/2 mx-auto" />
          </div>
          
          {/* Excerpt */}
          <div className="space-y-2 max-w-3xl mx-auto">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
        </div>

        {/* Featured Image */}
        <Skeleton className="aspect-[16/9] w-full rounded-lg" />

        {/* Meta Information */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-18" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-10" />
          <Skeleton className="h-6 w-14" />
        </div>
      </header>

      <Separator />

      {/* Main Content Skeleton */}
      <div className="space-y-6">
        {/* Paragraphs */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Heading */}
        <Skeleton className="h-8 w-1/2" />

        {/* More paragraphs */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          
          {/* Image placeholder */}
          <Skeleton className="aspect-video w-full rounded-lg" />
          
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>

        {/* Another heading */}
        <Skeleton className="h-7 w-2/5" />

        {/* List items */}
        <div className="space-y-3 pl-6">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Final paragraphs */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      {/* Author Bio Skeleton */}
      <div className="bg-muted/50 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>

      {/* Related Content Skeleton */}
      <RelatedContentSkeleton />
    </article>
  );
}

/**
 * Related Content Skeleton
 */
function RelatedContentSkeleton() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            {/* Featured Image */}
            <Skeleton className="aspect-[16/10] w-full rounded-t-lg" />

            <CardHeader className="space-y-3">
              {/* Category */}
              <Skeleton className="h-5 w-16" />
              
              {/* Title */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Excerpt */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-10" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}