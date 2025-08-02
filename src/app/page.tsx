import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Globe, Settings } from "lucide-react";
import { config } from "@/lib/config";

export default function Home() {
  return (
    <div className="container max-w-6xl py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 mb-16">
        <div className="space-y-4">
          <Badge variant="outline" className="px-3 py-1">
            Cognitor CMS Master
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to {config.app.siteName}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master application for Cognitor CMS - Dynamic content management and publishing platform
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Search Content
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/pages">
              <FileText className="mr-2 h-4 w-4" />
              Browse Pages
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Dynamic Content
            </CardTitle>
            <CardDescription>
              All content is dynamically loaded from Cognitor CMS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Pages, navigation, and content are fetched in real-time from the headless CMS.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Advanced Search
            </CardTitle>
            <CardDescription>
              Full-text search with autocomplete suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Powerful search functionality with real-time suggestions and filtering.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Custom Styling
            </CardTitle>
            <CardDescription>
              Individual site themes and styling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Each site can have its own unique branding and visual identity.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Section */}
      <div className="bg-muted/50 rounded-lg p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">System Status</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">Site ID</div>
              <Badge variant="secondary">{config.cognitor.siteId}</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">API Endpoint</div>
              <Badge variant="secondary">{config.cognitor.apiBaseUrl}</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Environment</div>
              <Badge variant={config.isDevelopment ? "destructive" : "default"}>
                {config.isDevelopment ? "Development" : "Production"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
