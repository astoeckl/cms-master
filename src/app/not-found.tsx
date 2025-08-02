/**
 * 404 Not Found Page
 */

import Link from "next/link";
import { FileQuestion, Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="container max-w-2xl py-16 text-center">
      <div className="space-y-8">
        {/* Icon and Title */}
        <div className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="h-10 w-10 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Page Not Found</h1>
            <p className="text-lg text-muted-foreground">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </div>
        </div>

        {/* Error Details */}
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-base">What happened?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>The page you requested might have been:</p>
            <ul className="text-left space-y-1 pl-4">
              <li>• Moved to a different location</li>
              <li>• Deleted or unpublished</li>
              <li>• Temporarily unavailable</li>
              <li>• The URL was typed incorrectly</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Search Content
            </Link>
          </Button>
          
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-sm text-muted-foreground">
          <p>
            If you believe this is an error, please try refreshing the page or{" "}
            <Link 
              href="/search" 
              className="text-primary hover:underline"
            >
              search for what you're looking for
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}