/**
 * Search Interface with Autocomplete
 */

'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { searchService } from "@/lib/api";
import type { SearchSuggestion } from "@/lib/types";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface SearchInterfaceProps {
  initialQuery?: string;
}

export function SearchInterface({ initialQuery = '' }: SearchInterfaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([]);
  const [popularSearches, setPopularSearches] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  // Load initial data
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [recentData, popularData] = await Promise.all([
          searchService.getRecentSearches(),
          searchService.getPopularSearches(5),
        ]);

        setRecentSearches(recentData);
        
        if (popularData.success) {
          setPopularSearches(popularData.data);
        }
      } catch (error) {
        console.error('Failed to load search data:', error);
        // Fallback to empty arrays
        setRecentSearches([]);
        setPopularSearches([]);
      }
    }

    loadInitialData();
  }, []);

  // Load suggestions when query changes
  useEffect(() => {
    async function loadSuggestions() {
      if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await searchService.getSuggestions(debouncedQuery);
        if (response.success) {
          setSuggestions(response.data);
        }
      } catch (error) {
        console.error('Failed to load suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadSuggestions();
  }, [debouncedQuery]);

  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Save to recent searches
    searchService.saveRecentSearch(searchQuery);
    
    // Track search interaction
    searchService.trackSearchInteraction(searchQuery);
    
    // Navigate to search results
    const params = new URLSearchParams(searchParams);
    params.set('q', searchQuery);
    params.delete('page'); // Reset pagination
    
    router.push(`/search?${params.toString()}`);
    setShowSuggestions(false);
    inputRef.current?.blur();
  }, [router, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    const allSuggestions = [
      ...suggestions,
      ...(query.length < 2 ? recentSearches : []),
      ...(query.length < 2 ? popularSearches : []),
    ];

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : allSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
          handleSuggestionClick(allSuggestions[selectedIndex]);
        } else {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
    
    // Clear URL params
    const params = new URLSearchParams(searchParams);
    params.delete('q');
    params.delete('page');
    router.push(`/search?${params.toString()}`);
  };

  const clearRecentSearches = () => {
    searchService.clearRecentSearches();
    setRecentSearches([]);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search content..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-20 h-12 text-base"
            autoComplete="off"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-12 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1/2 h-10 -translate-y-1/2"
            disabled={!query.trim()}
          >
            Search
          </Button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <Card 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto"
        >
          <div className="p-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="text-sm text-muted-foreground">Loading suggestions...</div>
              </div>
            ) : (
              <>
                {/* Search Suggestions */}
                {suggestions.length > 0 && (
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={`suggestion-${index}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent ${
                          selectedIndex === index ? 'bg-accent' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Search className="h-3 w-3 text-muted-foreground" />
                          <span>{suggestion.text}</span>
                          {suggestion.type && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {suggestion.type}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Recent Searches */}
                {query.length < 2 && recentSearches.length > 0 && (
                  <>
                    {suggestions.length > 0 && <Separator className="my-2" />}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between px-3 py-1">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Recent
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearRecentSearches}
                          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                        >
                          Clear
                        </Button>
                      </div>
                      {recentSearches.slice(0, 3).map((search, index) => (
                        <button
                          key={`recent-${index}`}
                          onClick={() => handleSuggestionClick(search)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent ${
                            selectedIndex === suggestions.length + index ? 'bg-accent' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{search.text}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Popular Searches */}
                {query.length < 2 && popularSearches.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <div className="space-y-1">
                      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1 px-3 py-1">
                        <TrendingUp className="h-3 w-3" />
                        Popular
                      </span>
                      {popularSearches.slice(0, 3).map((search, index) => (
                        <button
                          key={`popular-${index}`}
                          onClick={() => handleSuggestionClick(search)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent ${
                            selectedIndex === suggestions.length + recentSearches.length + index ? 'bg-accent' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-3 w-3 text-muted-foreground" />
                            <span>{search.text}</span>
                            {search.count && (
                              <Badge variant="outline" className="ml-auto text-xs">
                                {search.count}
                              </Badge>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* No suggestions */}
                {suggestions.length === 0 && recentSearches.length === 0 && popularSearches.length === 0 && query.length >= 2 && !isLoading && (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    No suggestions found
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      )}

      {/* Click outside handler */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}