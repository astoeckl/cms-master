/**
 * Footer Component
 */

import Link from "next/link";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { config } from "@/lib/config";
import { FooterNavigation } from "./footer-navigation";

export async function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container max-w-screen-2xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
                C
              </div>
              <span className="font-bold text-lg">{config.app.siteName}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Master application for Cognitor CMS - Dynamic content management and publishing platform.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Navigation</h3>
            <FooterNavigation />
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link 
                href="/search" 
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Search
              </Link>
              <Link 
                href="/sitemap.xml" 
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Sitemap
              </Link>
            </nav>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">About</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Powered by Cognitor CMS</p>
              <p>Built with Next.js 15</p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {config.app.siteName}. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Site ID: {config.cognitor.siteId}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

