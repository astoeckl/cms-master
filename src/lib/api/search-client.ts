/**
 * Client-side Search Service - Uses Next.js API routes
 */

import type {
  SearchQuery,
  SearchSuggestion,
  SearchResult,
  CognitorResponse,
  PaginatedData,
} from '../types';

export class ClientSearchService {
  /**
   * Search using Next.js API route
   */
  async search(query: SearchQuery): Promise<CognitorResponse<PaginatedData<SearchResult>>> {
    const params = new URLSearchParams();
    params.append('q', query.query);
    
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.offset) params.append('page', Math.floor((query.offset || 0) / (query.limit || 10) + 1).toString());
    
    if (query.filters?.category) params.append('category', query.filters.category);
    if (query.filters?.tags?.length) params.append('tags', query.filters.tags.join(','));

    const response = await fetch(`/api/search?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Get search suggestions using Next.js API route
   */
  async getSuggestions(term: string, limit = 5): Promise<CognitorResponse<SearchSuggestion[]>> {
    const params = new URLSearchParams();
    params.append('q', term);
    params.append('limit', limit.toString());

    const response = await fetch(`/api/search/suggestions?${params.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Save recent search to localStorage
   */
  saveRecentSearch(query: string): void {
    try {
      const recent = this.getRecentSearches();
      const filtered = recent.filter(q => q !== query);
      const updated = [query, ...filtered].slice(0, 10);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save recent search:', error);
    }
  }

  /**
   * Get recent searches from localStorage
   */
  getRecentSearches(): string[] {
    try {
      const stored = localStorage.getItem('recent_searches');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to get recent searches:', error);
      return [];
    }
  }

  /**
   * Clear recent searches
   */
  clearRecentSearches(): void {
    try {
      localStorage.removeItem('recent_searches');
    } catch (error) {
      console.warn('Failed to clear recent searches:', error);
    }
  }

  /**
   * Track search interaction (placeholder for analytics)
   */
  trackSearchInteraction(query: string, resultCount?: number): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: query,
        ...(resultCount !== undefined && { result_count: resultCount })
      });
    }
  }
}

// Singleton instance for client-side use
export const clientSearchService = new ClientSearchService();
