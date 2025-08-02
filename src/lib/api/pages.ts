/**
 * Pages API Service for Cognitor CMS
 */

import { cognitorApi } from './client';
import type {
  CognitorPage,
  GetPagesParams,
  GetPageParams,
  CognitorResponse,
  PaginatedData,
} from '../types';

export class PagesService {
  /**
   * Get all pages with optional filtering and pagination
   */
  async getPages(params: GetPagesParams = {}): Promise<CognitorResponse<PaginatedData<CognitorPage>>> {
    const queryParams: Record<string, string | number | boolean> = {};
    
    if (params.limit) queryParams.limit = params.limit;
    if (params.offset) queryParams.offset = params.offset;
    if (params.status) queryParams.status = params.status;
    if (params.category) queryParams.category = params.category;
    if (params.tag) queryParams.tag = params.tag;
    if (params.search) queryParams.search = params.search;

    return cognitorApi.get<PaginatedData<CognitorPage>>('pages', queryParams, {
      cache: 'force-cache',
      next: { 
        revalidate: 3600, // 1 hour
        tags: ['pages'] 
      },
    });
  }

  /**
   * Get all published pages (for sitemap generation)
   */
  async getAllPublishedPages(): Promise<CognitorResponse<CognitorPage[]>> {
    try {
      const response = await cognitorApi.get<PaginatedData<CognitorPage>>('pages', { 
        status: 'published',
        limit: '100' // Get more pages for static generation
      }, {
        cache: 'force-cache',
        next: { 
          revalidate: 1800, // 30 minutes
          tags: ['pages', 'sitemap'] 
        },
      });

      // Return just the items array
      if (response.success && response.data.items) {
        return {
          success: true,
          data: response.data.items,
          message: response.message,
          pagination: response.pagination
        };
      } else {
        return {
          success: false,
          data: [],
          message: 'No pages found'
        };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a single page by slug
   */
  async getPageBySlug(params: GetPageParams): Promise<CognitorResponse<CognitorPage>> {
    const queryParams: Record<string, string | boolean> = {
      slug: params.slug
    };
    if (params.preview) queryParams.preview = params.preview;

    const cacheOptions = params.preview 
      ? { cache: 'no-store' as const }
      : { 
          cache: 'force-cache' as const, 
          next: { 
            revalidate: 1800, // 30 minutes
            tags: ['page', `page-${params.slug}`] 
          } 
        };

    try {
      const response = await cognitorApi.get<PaginatedData<CognitorPage>>(
        'pages',
        queryParams,
        cacheOptions
      );

      // Step 1: Extract page metadata to get ID
      if (!response.success || !response.data.items || response.data.items.length === 0) {
        return {
          success: false,
          data: null as any,
          message: 'Page not found'
        };
      }

      const pageMetadata = response.data.items[0];
      
      // Step 2: Get full content using page ID
      const fullPageResponse = await cognitorApi.get<CognitorPage>(
        `pages/${pageMetadata.id}`,
        {},
        cacheOptions
      );

      if (!fullPageResponse.success) {
        return {
          success: false,
          data: null as any,
          message: fullPageResponse.message || 'Failed to load page content'
        };
      }

      return {
        success: true,
        data: fullPageResponse.data,
        message: fullPageResponse.message,
        pagination: response.pagination
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * Get page metadata only (useful for navigation)
   */
  async getPageMetadata(slug: string): Promise<CognitorResponse<Pick<CognitorPage, 'id' | 'slug' | 'title' | 'metadata'>>> {
    // Use the same endpoint as getPageBySlug but return only metadata fields
    try {
      const response = await this.getPageBySlug({ slug });
      
      if (response.success && response.data) {
        const { id, slug: pageSlug, title, metadata } = response.data;
        return {
          success: true,
          data: { id, slug: pageSlug, title, metadata },
          message: response.message,
          pagination: response.pagination
        };
      } else {
        return {
          success: false,
          data: null as any,
          message: 'Page metadata not found'
        };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @deprecated Use getPageMetadata instead
   */
  async getPageMetadataOld(slug: string): Promise<CognitorResponse<Pick<CognitorPage, 'id' | 'slug' | 'title' | 'metadata'>>> {
    return cognitorApi.get<Pick<CognitorPage, 'id' | 'slug' | 'title' | 'metadata'>>(
      `pages/${slug}/metadata`,
      {},
      {
        cache: 'force-cache',
        next: { 
          revalidate: 3600, // 1 hour
          tags: ['page-metadata', `page-metadata-${slug}`] 
        },
      }
    );
  }

  /**
   * Get related pages
   */
  async getRelatedPages(pageId: string, limit = 3): Promise<CognitorResponse<CognitorPage[]>> {
    return cognitorApi.get<CognitorPage[]>(
      `pages/${pageId}/related`,
      { limit },
      {
        cache: 'force-cache',
        next: { 
          revalidate: 1800, // 30 minutes
          tags: ['pages', 'related-pages'] 
        },
      }
    );
  }

  /**
   * Get page hierarchy/breadcrumbs
   */
  async getPageHierarchy(slug: string): Promise<CognitorResponse<CognitorPage[]>> {
    return cognitorApi.get<CognitorPage[]>(
      `pages/${slug}/hierarchy`,
      {},
      {
        cache: 'force-cache',
        next: { 
          revalidate: 3600, // 1 hour
          tags: ['page-hierarchy', `hierarchy-${slug}`] 
        },
      }
    );
  }
}

// Singleton instance
export const pagesService = new PagesService();