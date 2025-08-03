/**
 * Breadcrumbs Navigation Component
 */

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbsProps {
  currentPath: string;
}

export async function Breadcrumbs({ currentPath }: BreadcrumbsProps) {
  // Create static breadcrumbs since navigation API doesn't exist
  const breadcrumbItems = [];
  
  // Always add home
  breadcrumbItems.push({
    id: 'static-home',
    title: 'Home',
    url: '/',
    isActive: currentPath === '/'
  });
  
  // Add current page if not home
  if (currentPath !== '/') {
    const pathSegments = currentPath.split('/').filter(Boolean);
    const currentSlug = pathSegments[pathSegments.length - 1];
    const title = currentSlug.charAt(0).toUpperCase() + currentSlug.slice(1);
    
    breadcrumbItems.push({
      id: `page-${currentSlug}`,
      title: title,
      url: currentPath,
      isActive: true
    });
  }

  if (breadcrumbItems.length <= 1) {
    return null; // Don't show breadcrumbs for home page only
  }

    return (
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          {breadcrumbItems.map((item, index) => (
            <li key={item.id} className="flex items-center space-x-2">
              {index > 0 && (
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              )}
              
              {item.isActive ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {index === 0 ? (
                    <span className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      {item.title}
                    </span>
                  ) : (
                    item.title
                  )}
                </span>
              ) : (
                <Link
                  href={item.url || '#'}
                  className="hover:text-foreground transition-colors"
                >
                  {index === 0 ? (
                    <span className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      {item.title}
                    </span>
                  ) : (
                    item.title
                  )}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
}