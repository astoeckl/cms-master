/**
 * Search API Service for Cognitor CMS
 */

import { cognitorApi } from './client';
import type {
  SearchQuery,
  SearchResult,
  SearchSuggestion,
  CognitorResponse,
  PaginatedData,
} from '../types';

export class SearchService {
  /**
   * Perform full-text search using Cognitor Search API
   */
  async search(query: SearchQuery): Promise<CognitorResponse<PaginatedData<SearchResult>>> {
    const queryParams: Record<string, string | number> = {
      q: query.query,
    };

    if (query.limit) queryParams.size = query.limit;
    if (query.offset) queryParams.page = Math.floor((query.offset || 0) / (query.limit || 10)) + 1;

    // Add filters if provided
    if (query.filters) {
      if (query.filters.category) queryParams.category = query.filters.category;
      if (query.filters.contentType) queryParams.content_type = query.filters.contentType;
      if (query.filters.tags && query.filters.tags.length > 0) {
        queryParams.tags = query.filters.tags.join(',');
      }
      if (query.filters.dateRange) {
        if (query.filters.dateRange.from) queryParams.date_from = query.filters.dateRange.from;
        if (query.filters.dateRange.to) queryParams.date_to = query.filters.dateRange.to;
      }
    }

    try {
      // Use the Cognitor search endpoint
      const response = await cognitorApi.get<any>(`search/sites/${cognitorApi.siteId}`, queryParams, {
        cache: 'default',
        next: { 
          revalidate: 300, // 5 minutes
          tags: ['search'] 
        },
      });

      if (response.success && response.data) {
        const { results, total, page, size, total_pages } = response.data;
        
        // Transform Cognitor search results to our format
        const transformedResults: SearchResult[] = results.map((result: any) => ({
          id: result.id.toString(),
          type: result.doc_type === 'content_element' ? 'page' : result.doc_type,
          title: result.title,
          excerpt: result.content || result.description || '',
          url: result.url || '#',
          score: result.score,
          publishedAt: result.created_at,
          category: undefined,
          tags: result.keywords ? result.keywords.split(',') : [],
          metadata: {
            contentType: result.doc_type,
            wordCount: result.content ? result.content.split(' ').length : 0,
            readTime: Math.max(1, Math.ceil((result.content?.split(' ').length || 0) / 200))
          },
          highlight: result.highlight
        }));

        return {
          data: {
            items: transformedResults,
            total: total,
            page: page,
            limit: size,
            pagination: {
              page: page,
              limit: size,
              total: total,
              totalPages: total_pages,
              hasNext: page < total_pages,
              hasPrev: page > 1
            }
          },
          success: true,
          message: `Found ${total} results`
        };
      }

      return {
        data: { items: [], total: 0, page: 1, limit: query.limit || 10 },
        success: false,
        message: 'No results found'
      };
    } catch (error) {
      console.error('Search failed:', error);
      return {
        data: { items: [], total: 0, page: 1, limit: query.limit || 10 },
        success: false,
        message: 'Search failed'
      };
    }
  }

  /**
   * Get search suggestions for autocomplete using Cognitor Suggest API
   * Falls back to static suggestions if API is unavailable
   */
  async getSuggestions(term: string, limit = 5): Promise<CognitorResponse<SearchSuggestion[]>> {
    if (!term.trim()) {
      return { data: [], success: true };
    }

    // Static fallback suggestions
    const getStaticSuggestions = (): SearchSuggestion[] => {
      const staticSuggestions: SearchSuggestion[] = [
        { id: '1', text: 'steuerberater', type: 'term' as const },
        { id: '2', text: 'beratung', type: 'term' as const },
        { id: '3', text: 'österreich', type: 'term' as const },
        { id: '4', text: 'kontakt', type: 'term' as const },
        { id: '5', text: 'unternehmen', type: 'term' as const },
        { id: '6', text: 'service', type: 'term' as const },
      ];
      
      return staticSuggestions
        .filter(s => s.text.toLowerCase().includes(term.toLowerCase()))
        .slice(0, limit);
    };

    // Try the real API first, but don't let it break the UI
    try {
      const response = await cognitorApi.get<any>(`search/sites/${cognitorApi.siteId}/suggest`, {
        q: term,
        limit: limit,
      }, {
        cache: 'default',
        next: { 
          revalidate: 600, // 10 minutes
          tags: ['search-suggestions'] 
        },
      });

      if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Transform suggestions to our format
        const suggestions: SearchSuggestion[] = response.data.map((suggestion: any) => ({
          id: suggestion.id?.toString() || Math.random().toString(),
          text: suggestion.text || suggestion.title || suggestion,
          type: suggestion.type || 'term',
          url: suggestion.url
        }));

        return {
          data: suggestions,
          success: true,
          message: 'API suggestions loaded successfully'
        };
      }

      // API returned empty results, fall back to static suggestions
      const staticSuggestions = getStaticSuggestions();
      return {
        data: staticSuggestions,
        success: true,
        message: staticSuggestions.length > 0 ? 'Static suggestions provided' : 'No suggestions found'
      };
    } catch (error) {
      // Log error but don't break the UI
      console.warn('Suggest API unavailable, using static suggestions:', error instanceof Error ? error.message : 'Unknown error');
      
      // Always provide static suggestions as fallback
      const staticSuggestions = getStaticSuggestions();
      return { 
        data: staticSuggestions, 
        success: true, 
        message: 'Fallback suggestions provided' 
      };
    }
  }

  /**
   * Get popular search terms
   * Static implementation since API endpoint doesn't exist
   */
  async getPopularSearches(limit = 10): Promise<CognitorResponse<SearchSuggestion[]>> {
    // Return static popular search terms
    const staticPopularSearches = [
      { id: '1', text: 'steuerberater', type: 'term' as const },
      { id: '2', text: 'beratung', type: 'term' as const },
      { id: '3', text: 'österreich', type: 'term' as const },
      { id: '4', text: 'kontakt', type: 'term' as const },
      { id: '5', text: 'service', type: 'term' as const },
      { id: '6', text: 'unternehmen', type: 'term' as const },
      { id: '7', text: 'hilfe', type: 'term' as const },
      { id: '8', text: 'support', type: 'term' as const },
    ].slice(0, limit);

    return {
      data: staticPopularSearches,
      success: true,
      message: 'Popular searches loaded successfully'
    };
  }

  /**
   * Get recent searches (if user tracking is enabled)
   */
  async getRecentSearches(limit = 5): Promise<SearchSuggestion[]> {
    try {
      // Check if localStorage is available (client-side only)
      if (typeof window === 'undefined') return [];
      
      const recentSearches = localStorage.getItem('cognitor-recent-searches');
      if (!recentSearches) return [];

      const searches: string[] = JSON.parse(recentSearches);
      return searches
        .slice(0, limit)
        .map((term, index) => ({
          text: term,
          type: 'page' as const,
        }));
    } catch {
      return [];
    }
  }

  /**
   * Save search term to recent searches
   */
  saveRecentSearch(term: string): void {
    try {
      // Only on client-side
      if (typeof window === 'undefined') return;
      
      const maxRecentSearches = 10;
      let recentSearches: string[] = [];
      
      const existing = localStorage.getItem('cognitor-recent-searches');
      if (existing) {
        recentSearches = JSON.parse(existing);
      }

      // Remove term if it already exists
      recentSearches = recentSearches.filter(search => search !== term);
      
      // Add term to beginning
      recentSearches.unshift(term);
      
      // Keep only the most recent searches
      recentSearches = recentSearches.slice(0, maxRecentSearches);
      
      localStorage.setItem('cognitor-recent-searches', JSON.stringify(recentSearches));
    } catch (error) {
      console.warn('Failed to save recent search:', error);
    }
  }

  /**
   * Clear recent searches
   */
  clearRecentSearches(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cognitor-recent-searches');
      }
    } catch (error) {
      console.warn('Failed to clear recent searches:', error);
    }
  }

  /**
   * Get search analytics (if available)
   */
  async getSearchAnalytics(period = '30d'): Promise<CognitorResponse<SearchAnalytics>> {
    return cognitorApi.get<SearchAnalytics>('search/analytics', {
      period,
    }, {
      cache: 'force-cache',
      next: { 
        revalidate: 3600, // 1 hour
        tags: ['search-analytics'] 
      },
    });
  }

  /**
   * Track search interaction (optional analytics)
   */
  async trackSearchInteraction(query: string, resultId?: string, action: 'search' | 'click' | 'view' = 'search'): Promise<void> {
    try {
      await cognitorApi.post('search/track', {
        query,
        resultId,
        action,
        timestamp: new Date().toISOString(),
      }, {
        cache: 'no-store',
      });
    } catch (error) {
      // Analytics failures shouldn't break the user experience
      console.warn('Failed to track search interaction:', error);
    }
  }
}

// Additional types for search analytics
interface SearchAnalytics {
  totalSearches: number;
  uniqueQueries: number;
  topQueries: Array<{
    query: string;
    count: number;
    percentage: number;
  }>;
  noResultQueries: Array<{
    query: string;
    count: number;
  }>;
  averageResultsPerQuery: number;
  searchTrends: Array<{
    date: string;
    searches: number;
  }>;
}

// Singleton instance
export const searchService = new SearchService();