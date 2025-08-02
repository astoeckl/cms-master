/**
 * Type definitions export index
 */

export * from './cognitor';

// Additional common types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps {
  params: Promise<{ slug?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// URL State Types (for nuqs)
export interface SearchState {
  query: string;
  page: number;
  category?: string;
  tags?: string[];
}

// Theme System Types
export interface ThemeProviderProps extends BaseComponentProps {
  theme?: string;
  storageKey?: string;
}

export interface NavigationProps extends BaseComponentProps {
  items: import('./cognitor').NavigationItem[];
  mobile?: boolean;
}