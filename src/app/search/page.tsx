/**
 * Search Page
 */

import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchInterface } from "@/components/search/search-interface";
import { SearchResults } from "@/components/search/search-results";
import { SearchSkeleton } from "@/components/search/search-skeleton";
import type { PageProps } from "@/lib/types";



export const metadata: Metadata = {
  title: "Search",
  description: "Search through all content on this site",
};

interface SearchPageProps extends PageProps {}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : '';
  const page = typeof params.page === 'string' ? parseInt(params.page, 10) : 1;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const tags = typeof params.tags === 'string' ? params.tags.split(',') : undefined;

  return (
    <div className="container max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Search</h1>
        <p className="text-muted-foreground">
          Find content across all pages and sections
        </p>
      </div>

      {/* Search Interface */}
      <div className="mb-8">
        <Suspense fallback={<SearchInterfaceSkeleton />}>
          <SearchInterface initialQuery={query} />
        </Suspense>
      </div>

      {/* Search Results */}
      <div>
        <Suspense fallback={<SearchSkeleton />}>
          <SearchResults
            query={query}
            page={page}
            category={category}
            tags={tags}
          />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * Loading skeletons
 */
function SearchInterfaceSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-12 w-full animate-pulse rounded-md bg-muted" />
      <div className="flex gap-2">
        <div className="h-8 w-20 animate-pulse rounded bg-muted" />
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

