/**
 * Desktop Navigation Component
 */

'use client';

import Link from "next/link";
import { ChevronDown } from "lucide-react";

import type { NavigationItem } from "@/lib/types";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

import { useState, useEffect } from "react";

export function Navigation() {
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
    return <NavigationSkeleton />;
  }

  if (navigationItems.length === 0) {
    return <NavigationFallback />;
  }

    return (
      <NavigationMenu>
        <NavigationMenuList>
          {navigationItems.map((item) => (
            <NavigationMenuItem key={item.id}>
              {item.children && item.children.length > 0 ? (
                <>
                  <NavigationMenuTrigger className="h-9 px-4 py-2">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {item.children.map((childItem) => (
                        <NavigationMenuLink key={childItem.id} asChild>
                          <Link
                            href={childItem.url || `/${childItem.slug}` || '#'}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              childItem.isActive && "bg-accent text-accent-foreground"
                            )}
                            target={childItem.target}
                          >
                            <div className="text-sm font-medium leading-none">
                              {childItem.title}
                            </div>
                            {/* You could add descriptions here if available in your CMS */}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink asChild>
                  <Link
                    href={item.url || `/${item.slug}` || '#'}
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                      item.isActive && "bg-accent text-accent-foreground"
                    )}
                    target={item.target}
                  >
                    {item.title}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    );
}

/**
 * Loading skeleton for navigation
 */
function NavigationSkeleton() {
  return (
    <nav className="flex items-center space-x-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-4 w-16 animate-pulse rounded bg-muted" />
      ))}
    </nav>
  );
}

/**
 * Fallback navigation when API fails
 */
function NavigationFallback() {
  const fallbackItems: NavigationItem[] = [
    {
      id: 'home',
      title: 'Home',
      url: '/',
      order: 0,
    },
    {
      id: 'pages',
      title: 'Pages',
      url: '/pages',
      order: 1,
    },
    {
      id: 'search',
      title: 'Search',
      url: '/search',
      order: 2,
    },
  ];

  return (
    <nav className="flex items-center space-x-6">
      {fallbackItems.map((item) => (
        <Link
          key={item.id}
          href={item.url || '#'}
          className="text-sm font-medium transition-colors hover:text-foreground/80"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}