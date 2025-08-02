/**
 * TypeScript definitions for Cognitor CMS API
 */

// Base types
export interface CognitorResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: Pagination;
}

export interface PaginatedData<T> {
  items: T[];
  total?: number;
  page?: number;
  limit?: number;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

// Content Types
export interface RichContent {
  type: string;
  content?: RichContent[];
  attrs?: Record<string, any>;
  text?: string;
}

export interface ContentElement {
  id: number;
  type_identifier: string;
  data: Record<string, any>; // Dynamic data based on content type
  updated_at: string;
}

export interface PageElement {
  id: number;
  position: number;
  section: string;
  layout_config: Record<string, any> | null;
  content_element: ContentElement;
}

export interface Media {
  id: string;
  url: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  mimeType: string;
  size: number;
}

// Page Types
export interface CognitorPage {
  id: number;  // API returns number
  slug: string;
  title: string;
  description?: string;
  updated_at: string;  // API uses snake_case
  element_count?: number;
  published?: boolean;
  // Page content elements (available in detailed page view)
  page_elements?: PageElement[];
  // Legacy/fallback fields
  content?: RichContent[];
  excerpt?: string;
  metadata?: PageMetadata;
  featuredImage?: Media;
  publishedAt?: string;
  status?: 'published' | 'draft' | 'archived';
  author?: Author;
  tags?: string[];
  category?: Category;
}

export interface PageMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  openGraph?: OpenGraphData;
}

export interface OpenGraphData {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  siteName?: string;
}

export interface Author {
  id: string;
  name: string;
  email?: string;
  bio?: string;
  avatar?: Media;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  title: string;
  url?: string;
  slug?: string;
  external?: boolean;
  target?: '_blank' | '_self';
  children?: NavigationItem[];
  order: number;
  isActive?: boolean;
}

export interface CognitorNavigation {
  id: string;
  name: string;
  items: NavigationItem[];
  structure: 'flat' | 'hierarchical';
  location: 'header' | 'footer' | 'sidebar';
}

// Search Types
export interface SearchQuery {
  query: string;
  limit?: number;
  offset?: number;
  filters?: SearchFilters;
}

export interface SearchFilters {
  category?: string;
  tags?: string[];
  contentType?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  excerpt: string;
  url: string;
  score: number;
  publishedAt: string;
  category?: Category;
  tags?: string[];
  metadata: {
    contentType: string;
    wordCount: number;
    readTime: number;
  };
  highlight?: {
    content?: string[];
    title?: string[];
    description?: string[];
  };
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'page' | 'category' | 'tag' | 'term';
  url?: string;
  count?: number;
}

// Site Configuration Types
export interface SiteConfig {
  id: string;
  name: string;
  description?: string;
  logo?: Media;
  favicon?: Media;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  customCss?: string;
  socialMedia?: SocialMediaLinks;
  analytics?: AnalyticsConfig;
}

export interface SocialMediaLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

export interface AnalyticsConfig {
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  customScripts?: string[];
}

// API Error Types
export interface CognitorError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

// API Endpoint Parameter Types
export interface GetPagesParams {
  limit?: number;
  offset?: number;
  status?: 'published' | 'draft' | 'all';
  category?: string;
  tag?: string;
  search?: string;
}

export interface GetPageParams {
  slug: string;
  preview?: boolean;
}

export interface GetNavigationParams {
  location?: 'header' | 'footer' | 'sidebar';
}

// Theme System Types
export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  customCss?: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  muted: string;
  accent: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}