/**
 * Search Dialog Component - Quick search overlay
 */

'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { clientSearchService } from "@/lib/api/search-client";
import type { SearchSuggestion, SearchResult } from "@/lib/types";
import { useDebounce } from "@/lib/hooks";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [quickResults, setQuickResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([]);
  const [popularSearches, setPopularSearches] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  // Load initial data when dialog opens
  useEffect(() => {
    if (open) {
      loadInitialData();
    } else {
      // Reset state when dialog closes
      setQuery('');
      setSuggestions([]);
      setQuickResults([]);
    }
  }, [open]);

  // Load suggestions and quick results
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      loadSearchData(debouncedQuery);
    } else {
      setSuggestions([]);
      setQuickResults([]);
    }
  }, [debouncedQuery]);

  const loadInitialData = () => {
    try {
      const recentData = clientSearchService.getRecentSearches();
      setRecentSearches(recentData.map(search => ({ text: search, count: 1 }))); // Convert string[] to SearchSuggestion[]
      
      // Popular searches not implemented yet
      setPopularSearches([]);
    } catch (error) {
      console.error('Failed to load initial search data:', error);
    }
  };

  const loadSearchData = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const [suggestionsResponse, quickSearchResponse] = await Promise.all([
        clientSearchService.getSuggestions(searchQuery, 5),
        clientSearchService.search({
          query: searchQuery,
          limit: 3, // Just a few quick results
        }),
      ]);

      if (suggestionsResponse.success) {
        setSuggestions(suggestionsResponse.data);
      }

      if (quickSearchResponse.success) {
        setQuickResults(quickSearchResponse.data.items);
      }
    } catch (error) {
      console.error('Failed to load search data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    clientSearchService.saveRecentSearch(searchQuery);
    
    // Track search interaction
    clientSearchService.trackSearchInteraction(searchQuery);
    
    // Close dialog and navigate
    onOpenChange(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    handleSearch(suggestion.text);
  };

  const handleResultClick = (result: SearchResult) => {
    clientSearchService.trackSearchInteraction(query);
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch(query);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 overflow-hidden">
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">Search</DialogTitle>
        
        {/* Search Input */}
        <div className="p-4 border-b">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search content..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 pr-4 h-12 text-base border-0 focus-visible:ring-0"
                autoComplete="off"
                autoFocus
              />
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Quick Results */}
              {quickResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Quick Results
                  </h3>
                  <div className="space-y-2">
                    {quickResults.map((result) => (
                      <Link
                        key={result.id}
                        href={result.url}
                        onClick={() => handleResultClick(result)}
                        className="block p-3 rounded-md hover:bg-accent transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{result.title}</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {result.excerpt}
                          </div>
                          <div className="flex items-center gap-2">
                            {result.category && (
                              <Badge variant="secondary" className="text-xs">
                                {result.category.name}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {result.metadata.contentType}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {query.trim() && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(query)}
                      className="w-full"
                    >
                      View all results for "{query}"
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <>
                  {quickResults.length > 0 && <Separator />}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Suggestions
                    </h3>
                    <div className="space-y-1">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Search className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{suggestion.text}</span>
                            {suggestion.type && (
                              <Badge variant="outline" className="ml-auto text-xs">
                                {suggestion.type}
                              </Badge>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Recent & Popular (when no query) */}
              {!query.trim() && (
                <div className="space-y-4">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Recent Searches
                      </h3>
                      <div className="space-y-1">
                        {recentSearches.slice(0, 3).map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(search)}
                            className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{search.text}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  {popularSearches.length > 0 && (
                    <>
                      {recentSearches.length > 0 && <Separator />}
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Popular Searches
                        </h3>
                        <div className="space-y-1">
                          {popularSearches.slice(0, 3).map((search, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(search)}
                              className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{search.text}</span>
                                {search.count && (
                                  <Badge variant="outline" className="ml-auto text-xs">
                                    {search.count}
                                  </Badge>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* No results */}
              {query.trim() && 
               suggestions.length === 0 && 
               quickResults.length === 0 && 
               !isLoading && (
                <div className="text-center py-8">
                  <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No results found for "{query}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Press Enter to search</span>
            <Link
              href="/search"
              onClick={() => onOpenChange(false)}
              className="hover:text-foreground transition-colors"
            >
              Advanced search →
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}