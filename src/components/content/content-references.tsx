/**
 * Content Reference Components - Resolve and render content references
 * These are client components that can fetch and resolve references dynamically
 */

'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { pagesService, searchService } from "@/lib/api";
import type { CognitorPage, SearchResult } from "@/lib/types";

interface ContentReferenceProps {
  data: Record<string, any>;
  contentType: string;
}

/**
 * List view for content references
 */
export function ContentReferenceList({ data, contentType }: ContentReferenceProps) {
  const [content, setContent] = useState<(CognitorPage | SearchResult)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to resolve references
        const resolvedContent = await resolveContentReferences(data, contentType);
        setContent(resolvedContent);
      } catch (err) {
        console.error('Failed to load content references:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [data, contentType]);

  if (loading) {
    return <ContentListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No content available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.title && (
        <h2 className="text-2xl font-bold tracking-tight">{data.title}</h2>
      )}
      
      <div className="space-y-4">
        {content.map((item, index) => (
          <Card key={getItemId(item) || index} className="hover:shadow-lg transition-shadow">
            <Link href={getItemUrl(item)}>
              <div className="flex gap-4 p-4">
                {getItemImage(item) && (
                  <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={getItemImage(item)!}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                )}
                
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  {getItemExcerpt(item) && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {getItemExcerpt(item)}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {getItemDate(item) && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={getItemDate(item) || undefined}>
                          {new Date(getItemDate(item)!).toLocaleDateString()}
                        </time>
                      </div>
                    )}
                    
                    {getItemAuthor(item) && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{getItemAuthor(item)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * Grid view for content references  
 */
export function ContentReferenceGrid({ data, contentType }: ContentReferenceProps) {
  const [content, setContent] = useState<(CognitorPage | SearchResult)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const resolvedContent = await resolveContentReferences(data, contentType);
        setContent(resolvedContent);
      } catch (err) {
        console.error('Failed to load content references:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [data, contentType]);

  if (loading) {
    return <ContentGridSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">No content available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.title && (
        <h2 className="text-2xl font-bold tracking-tight">{data.title}</h2>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {content.map((item, index) => (
          <Card key={getItemId(item) || index} className="group hover:shadow-lg transition-shadow">
            <Link href={getItemUrl(item)}>
              {getItemImage(item) && (
                <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
                  <Image
                    src={getItemImage(item)!}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}

              <CardHeader className="space-y-3">
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {getItemExcerpt(item) && (
                  <p className="text-muted-foreground line-clamp-3 text-sm">
                    {getItemExcerpt(item)}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {getItemDate(item) && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <time dateTime={getItemDate(item) || undefined}>
                        {new Date(getItemDate(item)!).toLocaleDateString()}
                      </time>
                    </div>
                  )}
                  
                  {getItemAuthor(item) && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{getItemAuthor(item)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * Teaser view for content references
 */
export function ContentReferenceTeaser({ data, contentType }: ContentReferenceProps) {
  const [content, setContent] = useState<(CognitorPage | SearchResult)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const resolvedContent = await resolveContentReferences(data, contentType, 3); // Limit to 3 for teaser
        setContent(resolvedContent);
      } catch (err) {
        console.error('Failed to load content references:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [data, contentType]);

  if (loading) {
    return <ContentGridSkeleton count={3} />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (content.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {data.title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">{data.title}</h2>
          {data.view_all_url && (
            <Link href={data.view_all_url}>
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-3">
        {content.map((item, index) => (
          <Card key={getItemId(item) || index} className="group hover:shadow-md transition-shadow">
            <Link href={getItemUrl(item)}>
              {getItemImage(item) && (
                <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
                  <Image
                    src={getItemImage(item)!}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}

              <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors text-sm">
                  {item.title}
                </h3>
                
                {getItemDate(item) && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(getItemDate(item)!).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * Resolve content references from data object
 */
async function resolveContentReferences(
  data: Record<string, any>, 
  contentType: string,
  limit?: number
): Promise<(CognitorPage | SearchResult)[]> {
  try {
    console.log('🔗 Resolving content references:', { data, contentType, limit });

    // Check various reference patterns
    const referencePatterns = [
      'references', 'refs', 'items', 'content_items',
      'news_ids', 'article_ids', 'post_ids', 'page_ids',
      'news', 'articles', 'posts', 'pages',
      'content', 'related_content'
    ];

    let referenceData: any[] = [];

    // Find the first matching reference pattern
    for (const pattern of referencePatterns) {
      if (data[pattern] && Array.isArray(data[pattern])) {
        referenceData = data[pattern];
        console.log(`📋 Found reference data in field '${pattern}':`, referenceData);
        break;
      }
    }

    // If we found reference IDs, try to resolve them
    if (referenceData.length > 0) {
      // Check if they look like numeric IDs
      const hasNumericIds = referenceData.some(item => 
        typeof item === 'number' || (typeof item === 'string' && !isNaN(Number(item)))
      );

      if (hasNumericIds) {
        console.log('🔢 Found numeric IDs, would resolve:', referenceData);
        // TODO: Implement specific ID resolution when API supports it
        // For now, fall through to generic content loading
      }

      // Check if they're already resolved objects
      if (referenceData.some(item => typeof item === 'object' && item.title)) {
        console.log('📦 Found pre-resolved objects');
        return referenceData.slice(0, limit || 10);
      }
    }

    // Search strategy based on content type
    let searchQuery = 'content';
    if (contentType.includes('news')) {
      searchQuery = 'news';
    } else if (contentType.includes('article')) {
      searchQuery = 'article';
    } else if (contentType.includes('post')) {
      searchQuery = 'post';
    } else if (data.search_term) {
      searchQuery = data.search_term;
    } else if (data.category) {
      searchQuery = data.category;
    }

    // Try search API first (usually more diverse content)
    console.log('🔍 Using search API with query:', searchQuery);
    try {
      const searchResponse = await searchService.search({
        query: searchQuery,
        limit: limit || 10,
      });

      if (searchResponse.success && searchResponse.data.items && searchResponse.data.items.length > 0) {
        console.log(`✅ Found ${searchResponse.data.items.length} items via search`);
        return searchResponse.data.items;
      }
    } catch (searchError) {
      console.warn('Search API failed, trying pages API:', searchError);
    }

    // Fallback: Get latest published pages
    console.log('📄 Fallback: Loading latest published pages');
    const response = await pagesService.getPages({
      status: 'published',
      limit: limit || 10,
    });

    if (response.success && response.data.items && response.data.items.length > 0) {
      console.log(`✅ Found ${response.data.items.length} pages via pages API`);
      return response.data.items;
    }

    console.warn('⚠️ No content found through any method');
    return [];
  } catch (error) {
    console.error('❌ Error resolving content references:', error);
    throw error;
  }
}

/**
 * Helper functions to extract data from different content types
 */
function getItemId(item: CognitorPage | SearchResult): string {
  return String(item.id);
}

function getItemUrl(item: CognitorPage | SearchResult): string {
  if ('slug' in item) {
    return `/${item.slug}`;
  }
  return item.url || '#';
}

function getItemImage(item: CognitorPage | SearchResult): string | null {
  if ('featuredImage' in item && item.featuredImage) {
    return item.featuredImage.url;
  }
  return null;
}

function getItemExcerpt(item: CognitorPage | SearchResult): string | null {
  if ('excerpt' in item && item.excerpt) {
    return item.excerpt;
  }
  if ('excerpt' in item && item.excerpt) {
    return item.excerpt;
  }
  if ('description' in item && item.description) {
    return item.description;
  }
  return null;
}

function getItemDate(item: CognitorPage | SearchResult): string | null {
  if ('publishedAt' in item && item.publishedAt) {
    return item.publishedAt;
  }
  if ('updated_at' in item && item.updated_at) {
    return item.updated_at;
  }
  return null;
}

function getItemAuthor(item: CognitorPage | SearchResult): string | null {
  if ('author' in item && item.author) {
    return item.author.name;
  }
  return null;
}

/**
 * Loading skeletons
 */
function ContentListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index}>
          <div className="flex gap-4 p-4">
            <Skeleton className="w-24 h-24 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ContentGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index}>
          <Skeleton className="aspect-[16/10] w-full rounded-t-lg" />
          <CardHeader className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}