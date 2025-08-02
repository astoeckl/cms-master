/**
 * Mobile Navigation Component
 */

'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import type { NavigationItem } from "@/lib/types";

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use fallback navigation since navigation API is not available
    const fallbackNavigation = [
      { id: 'home', title: 'Home', url: '/', order: 0 },
      { id: 'pages', title: 'All Pages', url: '/pages', order: 1 },
      { id: 'search', title: 'Search', url: '/search', order: 2 },
    ];
    
    setNavigationItems(fallbackNavigation);
    setIsLoading(false);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          {/* Navigation Content */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              {isLoading ? (
                <MobileNavigationSkeleton />
              ) : (
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <MobileNavigationItem
                      key={item.id}
                      item={item}
                      onLinkClick={handleLinkClick}
                    />
                  ))}
                </nav>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Mobile Navigation Item Component
 */
interface MobileNavigationItemProps {
  item: NavigationItem;
  onLinkClick: () => void;
  level?: number;
}

function MobileNavigationItem({ 
  item, 
  onLinkClick, 
  level = 0 
}: MobileNavigationItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className={`${level > 0 ? 'ml-4' : ''}`}>
      <div className="flex items-center">
        {hasChildren ? (
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 justify-between p-2 h-auto text-left"
          >
            <span className="text-sm font-medium">{item.title}</span>
            <ChevronRight 
              className={`h-4 w-4 transition-transform ${
                isExpanded ? 'rotate-90' : ''
              }`} 
            />
          </Button>
        ) : (
          <Link
            href={item.url || `/${item.slug}` || '#'}
            onClick={onLinkClick}
            target={item.target}
            className="flex-1 block p-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {item.title}
          </Link>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-2 space-y-1">
          {item.children!.map((childItem) => (
            <MobileNavigationItem
              key={childItem.id}
              item={childItem}
              onLinkClick={onLinkClick}
              level={level + 1}
            />
          ))}
        </div>
      )}

      {level === 0 && <Separator className="my-2" />}
    </div>
  );
}

/**
 * Loading skeleton for mobile navigation
 */
function MobileNavigationSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-8 w-full animate-pulse rounded bg-muted" />
          {i < 2 && <Separator className="my-2" />}
        </div>
      ))}
    </div>
  );
}