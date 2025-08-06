/**
 * Footer Navigation Client Component
 */

'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

import type { NavigationItem } from "@/lib/types";

export function FooterNavigation() {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use fallback navigation since navigation API is not available
    const fallbackNavigation: NavigationItem[] = [
      { 
        id: 'home',
        title: 'Home', 
        url: '/', 
        order: 1 
      },
      { 
        id: 'pages',
        title: 'All Pages', 
        url: '/pages', 
        order: 2 
      },
      { 
        id: 'search',
        title: 'Search', 
        url: '/search', 
        order: 3 
      }
    ];
    
    setNavigationItems(fallbackNavigation);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <FooterNavigationSkeleton />;
  }

  if (navigationItems.length === 0) {
    return <FooterNavigationFallback />;
  }

  return (
    <nav className="flex flex-col space-y-2 text-sm">
      {navigationItems.slice(0, 6).map((item) => (
        <Link
          key={item.id}
          href={item.url || `/${item.slug}` || '#'}
          target={item.target}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Fallback footer navigation
 */
function FooterNavigationFallback() {
  const fallbackItems: NavigationItem[] = [
    { id: 'home', title: 'Home', url: '/', order: 0 },
    { id: 'pages', title: 'All Pages', url: '/pages', order: 1 },
    { id: 'search', title: 'Search', url: '/search', order: 2 },
  ];

  return (
    <nav className="flex flex-col space-y-2 text-sm">
      {fallbackItems.map((item) => (
        <Link
          key={item.id}
          href={item.url || '#'}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Loading skeleton for footer navigation
 */
function FooterNavigationSkeleton() {
  return (
    <div className="flex flex-col space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-4 w-20 animate-pulse rounded bg-muted" />
      ))}
    </div>
  );
}