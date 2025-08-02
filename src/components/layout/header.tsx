/**
 * Header component with navigation
 */

import Link from "next/link";
import { Suspense } from "react";
import { Search } from "lucide-react";
import { Navigation } from "./navigation";
import { MobileNavigation } from "./mobile-navigation";
import { SearchTrigger } from "../search/search-trigger";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";

export async function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-foreground transition-colors hover:text-foreground/80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
              C
            </div>
            <span className="hidden font-bold text-lg sm:inline-block">
              {config.app.siteName}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
          <Suspense fallback={<NavigationSkeleton />}>
            <Navigation />
          </Suspense>
        </div>

        {/* Search and Mobile Navigation */}
        <div className="flex items-center space-x-2">
          {/* Search Trigger */}
          <Suspense fallback={null}>
            <SearchTrigger />
          </Suspense>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Suspense fallback={null}>
              <MobileNavigation />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
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