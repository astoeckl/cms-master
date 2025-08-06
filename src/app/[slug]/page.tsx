/**
 * Dynamic Page Route - Renders pages by slug from Cognitor CMS
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import { pagesService } from "@/lib/api";
import { PageContent } from "@/components/content/page-content";
import { PageSkeleton } from "@/components/content/page-skeleton";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import type { PageProps } from "@/lib/types";

interface DynamicPageProps extends PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for each page
export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const response = await pagesService.getPageBySlug({ slug });
    
    if (!response.success || !response.data) {
      return {
        title: "Page Not Found",
        description: "The requested page could not be found.",
      };
    }

    const page = response.data;
    const title = page.metadata?.title || page.title;
    const description = page.metadata?.description || page.excerpt || "";

    return {
      title,
      description,
      keywords: page.metadata?.keywords,
      openGraph: {
        title: page.metadata?.openGraph?.title || title,
        description: page.metadata?.openGraph?.description || description,
        type: (page.metadata?.openGraph?.type as "article" | "website") || "article",
        publishedTime: page.publishedAt,
        modifiedTime: page.updated_at,
        authors: page.author ? [page.author.name] : undefined,
        section: page.category?.name,
        tags: page.tags,
        images: page.featuredImage ? [
          {
            url: page.featuredImage.url,
            width: page.featuredImage.width,
            height: page.featuredImage.height,
            alt: page.featuredImage.alt || page.title,
          }
        ] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: page.metadata?.openGraph?.title || title,
        description: page.metadata?.openGraph?.description || description,
        images: page.featuredImage ? [page.featuredImage.url] : undefined,
      },
      alternates: {
        canonical: page.metadata?.canonicalUrl,
      },
      robots: {
        index: !page.metadata?.noIndex,
        follow: !page.metadata?.noFollow,
      },
    };
  } catch (error) {
    console.error(`Failed to generate metadata for page: ${slug}`, error);
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }
}

// Generate static params for popular pages (only in production)
export async function generateStaticParams() {
  // Skip static generation in development for faster iteration
  if (process.env.NODE_ENV === 'development') {
    return [];
  }

  try {
    const response = await pagesService.getAllPublishedPages();
    
    if (!response.success) {
      return [];
    }

    // Generate params for the first 100 pages (adjust as needed)
    return response.data.slice(0, 100).map((page) => ({
      slug: page.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params;

  try {
    const response = await pagesService.getPageBySlug({ slug });

    if (!response.success || !response.data) {
      notFound();
    }

    const page = response.data;
    
    // Check if page has sidebar elements
    const hasSidebarElements = page.page_elements?.some(element => element.section === 'sidebar');
    
    // Use different container classes based on layout type
    const containerClasses = hasSidebarElements 
      ? "w-full max-w-none py-8 px-4 sm:px-6 lg:px-8 xl:px-12" // Full width for sidebar layout
      : "container max-w-4xl py-8 px-4 sm:px-6 lg:px-8"; // Standard width for single column

    return (
      <div className={containerClasses}>
        {/* Breadcrumbs */}
        <Suspense fallback={<BreadcrumbsSkeleton />}>
          <Breadcrumbs currentPath={`/${slug}`} />
        </Suspense>

        {/* Page Content */}
        <Suspense fallback={<PageSkeleton />}>
          <PageContent page={page} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error(`Error loading page: ${slug}`, error);
    notFound();
  }
}

/**
 * Breadcrumbs skeleton
 */
function BreadcrumbsSkeleton() {
  return (
    <div className="flex items-center space-x-2 mb-6">
      <div className="h-4 w-12 animate-pulse rounded bg-muted" />
      <span className="text-muted-foreground">/</span>
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
    </div>
  );
}