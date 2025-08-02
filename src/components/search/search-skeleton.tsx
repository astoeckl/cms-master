/**
 * Search Skeleton Loading Component
 */

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SearchSkeleton() {
  return (
    <div className="space-y-6">
      {/* Results Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Results List Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <SearchResultSkeleton key={index} />
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-20" />
          <div className="hidden md:flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8" />
            ))}
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Individual Search Result Skeleton
 */
function SearchResultSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Title */}
          <Skeleton className="h-6 w-3/4" />
          
          {/* Excerpt */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          
          {/* Meta Information */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-12" />
            <div className="ml-auto">
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex gap-2 pt-2 border-t">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-10" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}