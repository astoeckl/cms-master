/**
 * Page Content Component - Renders CMS content
 */

import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Tag, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { CognitorPage } from "@/lib/types";
import { RichContentRenderer } from "./rich-content-renderer";
import { RelatedContent } from "./related-content";

interface PageContentProps {
  page: CognitorPage;
}

export function PageContent({ page }: PageContentProps) {
  return (
    <article className="space-y-12">
      {/* Page Header */}
      <header className="space-y-8">
        {/* Status Badge (for draft/preview) */}
        {page.status && page.status !== 'published' && (
          <div className="flex justify-center">
            <Badge variant="outline" className="text-xs">
              {page.status?.toUpperCase()}
            </Badge>
          </div>
        )}

        {/* Category */}
        {page.category && (
          <div className="flex justify-center">
            <Badge variant="secondary">
              {page.category.name}
            </Badge>
          </div>
        )}

        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            {page.title}
          </h1>
          
          {/* Excerpt */}
          {page.excerpt && (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {page.excerpt}
            </p>
          )}
        </div>

        {/* Featured Image */}
        {page.featuredImage && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src={page.featuredImage.url}
              alt={page.featuredImage.alt || page.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {/* Published/Updated Date */}
          {(page.publishedAt || page.updated_at) && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={page.publishedAt || page.updated_at}>
                {new Date(page.publishedAt || page.updated_at!).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          )}

          {/* Additional updated date if both exist and different */}
          {page.updated_at && page.publishedAt && page.updated_at !== page.publishedAt && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                Updated {new Date(page.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          {/* Author */}
          {page.author && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>By {page.author.name}</span>
            </div>
          )}

          {/* Reading Time (estimated) */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{estimateReadingTime(page.content || [])} min read</span>
          </div>
        </div>

        {/* Tags */}
        {page.tags && page.tags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {page.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </header>

      <Separator />

      {/* Content Layout with Sidebar */}
      {(page.page_elements && page.page_elements.length > 0) || (page.content && page.content.length > 0) ? (
        <RichContentRenderer 
          pageElements={page.page_elements} 
          content={page.content} 
        />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No content available for this page.</p>
          {page.description && (
            <p className="mt-4 text-sm">{page.description}</p>
          )}
        </div>
      )}

      {/* Author Bio */}
      {page.author && page.author.bio && (
        <>
          <Separator />
          <div className="bg-muted/50 rounded-lg p-6">
            <div className="flex items-start gap-4">
              {page.author.avatar && (
                <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={page.author.avatar.url}
                    alt={page.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">About {page.author.name}</h3>
                <p className="text-muted-foreground">{page.author.bio}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Related Content */}
      <RelatedContent pageId={page.id} category={page.category} />
    </article>
  );
}

/**
 * Estimate reading time based on content
 */
function estimateReadingTime(content: any[]): number {
  if (!content || !Array.isArray(content)) return 1;

  const wordsPerMinute = 200; // Average reading speed
  let wordCount = 0;

  const countWords = (items: any[]): void => {
    items.forEach((item) => {
      if (item.text) {
        wordCount += item.text.split(/\s+/).length;
      }
      if (item.content && Array.isArray(item.content)) {
        countWords(item.content);
      }
    });
  };

  countWords(content);
  
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
}