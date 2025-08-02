/**
 * Search Results Component
 */

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, ExternalLink, Search } from "lucide-react";
import { searchService } from "@/lib/api";
import type { SearchResult } from "@/lib/types";
import { SearchPagination } from "./search-pagination";
import { SearchSkeleton } from "./search-skeleton";

interface SearchResultsProps {
  query: string;
  page?: number;
  category?: string;
  tags?: string[];
}

export async function SearchResults({
  query,
  page = 1,
  category,
  tags,
}: SearchResultsProps) {
  if (!query.trim()) {
    return <SearchEmptyState />;
  }

  try {
    const searchQuery = {
      query,
      limit: 10,
      offset: (page - 1) * 10,
      filters: {
        category,
        tags,
      },
    };

    const response = await searchService.search(searchQuery);

    if (!response.success) {
      return <SearchErrorState message={response.message} />;
    }

    const { items: results, pagination } = response.data;

    if (results.length === 0) {
      return <SearchNoResults query={query} />;
    }

    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Search Results for "{query}"
            </h2>
            <p className="text-sm text-muted-foreground">
              {pagination.total} result{pagination.total !== 1 ? 's' : ''} found
              {category && ` in ${category}`}
              {tags && tags.length > 0 && ` with tags: ${tags.join(', ')}`}
            </p>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {results.map((result, index) => (
            <SearchResultItem
              key={result.id}
              result={result}
              query={query}
              index={index}
            />
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <SearchPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            hasNext={pagination.hasNext}
            hasPrevious={pagination.hasPrevious}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error('Search error:', error);
    return <SearchErrorState />;
  }
}

/**
 * Individual Search Result Item
 */
interface SearchResultItemProps {
  result: SearchResult;
  query: string;
  index: number;
}

function SearchResultItem({ result, query, index }: SearchResultItemProps) {
  // Remove the onClick handler to avoid Server/Client Component conflict
  // Tracking can be implemented differently if needed

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Title and Link */}
          <div>
            <Link
              href={result.url}
              className="group inline-flex items-center gap-2"
            >
              <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                {result.title}
              </h3>
              <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Excerpt */}
          {result.excerpt && (
            <p className="text-muted-foreground leading-relaxed">
              {result.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {/* Published Date */}
            {result.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(result.publishedAt).toLocaleDateString()}
                </span>
              </div>
            )}

            {/* Content Type */}
            <Badge variant="secondary" className="text-xs">
              {result.metadata.contentType}
            </Badge>

            {/* Category */}
            {result.category && (
              <Badge variant="outline" className="text-xs">
                {result.category.name}
              </Badge>
            )}

            {/* Relevance Score */}
            {result.score && (
              <div className="ml-auto">
                <span className="text-xs">
                  {Math.round(result.score * 100)}% match
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {result.tags && result.tags.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-1">
                {result.tags.slice(0, 5).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {result.tags.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{result.tags.length - 5} more
                  </Badge>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Empty state when no query is provided
 */
function SearchEmptyState() {
  return (
    <div className="text-center py-12">
      <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">Start Searching</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Enter a search term above to find content across all pages and sections.
      </p>
    </div>
  );
}

/**
 * No results state
 */
function SearchNoResults({ query }: { query: string }) {
  return (
    <div className="text-center py-12">
      <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No Results Found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        No content found for "{query}". Try adjusting your search terms or filters.
      </p>
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>Suggestions:</p>
        <ul className="space-y-1">
          <li>• Check your spelling</li>
          <li>• Try different keywords</li>
          <li>• Use fewer search terms</li>
          <li>• Remove filters to broaden your search</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Error state
 */
function SearchErrorState({ message }: { message?: string }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <Search className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-lg font-medium mb-2">Search Error</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {message || "There was an error performing your search. Please try again."}
      </p>
      <Button
        variant="outline"
        onClick={() => window.location.reload()}
      >
        Try Again
      </Button>
    </div>
  );
}