/**
 * API Services export index
 */

// Import services first
import { pagesService } from './pages';
import { navigationService } from './navigation';
import { searchService } from './search';

// Export classes
export { CognitorApiClient, CognitorApiError, cognitorApi } from './client';
export { PagesService } from './pages';
export { NavigationService } from './navigation';
export { SearchService } from './search';

// Export individual services
export { pagesService, navigationService, searchService };

// Re-export commonly used functions
export const api = {
  pages: pagesService,
  navigation: navigationService,
  search: searchService,
} as const;