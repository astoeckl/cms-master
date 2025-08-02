/**
 * Navigation API Service for Cognitor CMS
 */

import { cognitorApi } from './client';
import type {
  CognitorNavigation,
  NavigationItem,
  GetNavigationParams,
  CognitorResponse,
} from '../types';

export class NavigationService {
  /**
   * Get navigation structure by location
   */
  async getNavigation(params: GetNavigationParams = {}): Promise<CognitorResponse<CognitorNavigation[]>> {
    const queryParams: Record<string, string> = {};
    if (params.location) queryParams.location = params.location;

    return cognitorApi.get<CognitorNavigation[]>('navigation', queryParams, {
      cache: 'force-cache',
      next: { 
        revalidate: 3600, // 1 hour
        tags: ['navigation'] 
      },
    });
  }

  /**
   * Get main navigation (header)
   */
  async getMainNavigation(): Promise<CognitorResponse<CognitorNavigation>> {
    return cognitorApi.get<CognitorNavigation>('navigation/main', {}, {
      cache: 'force-cache',
      next: { 
        revalidate: 3600, // 1 hour
        tags: ['navigation', 'main-navigation'] 
      },
    });
  }

  /**
   * Get footer navigation
   */
  async getFooterNavigation(): Promise<CognitorResponse<CognitorNavigation>> {
    return cognitorApi.get<CognitorNavigation>('navigation/footer', {}, {
      cache: 'force-cache',
      next: { 
        revalidate: 3600, // 1 hour
        tags: ['navigation', 'footer-navigation'] 
      },
    });
  }

  /**
   * Get sidebar navigation
   */
  async getSidebarNavigation(): Promise<CognitorResponse<CognitorNavigation>> {
    return cognitorApi.get<CognitorNavigation>('navigation/sidebar', {}, {
      cache: 'force-cache',
      next: { 
        revalidate: 3600, // 1 hour
        tags: ['navigation', 'sidebar-navigation'] 
      },
    });
  }

  /**
   * Build breadcrumb navigation for a given path
   */
  async getBreadcrumbs(currentPath: string): Promise<NavigationItem[]> {
    try {
      const response = await cognitorApi.get<NavigationItem[]>(
        'navigation/breadcrumbs',
        { path: currentPath },
        {
          cache: 'force-cache',
          next: { 
            revalidate: 1800, // 30 minutes
            tags: ['breadcrumbs'] 
          },
        }
      );
      return response.data;
    } catch (error) {
      // Fallback: generate simple breadcrumbs from path
      return this.generateFallbackBreadcrumbs(currentPath);
    }
  }

  /**
   * Generate fallback breadcrumbs from URL path
   */
  private generateFallbackBreadcrumbs(path: string): NavigationItem[] {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs: NavigationItem[] = [
      {
        id: 'home',
        title: 'Home',
        url: '/',
        order: 0,
        isActive: segments.length === 0,
      },
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        id: `breadcrumb-${index}`,
        title: this.formatSegmentTitle(segment),
        url: currentPath,
        order: index + 1,
        isActive: index === segments.length - 1,
      });
    });

    return breadcrumbs;
  }

  /**
   * Format URL segment to readable title
   */
  private formatSegmentTitle(segment: string): string {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Check if navigation item is active based on current path
   */
  markActiveNavigation(navigation: NavigationItem[], currentPath: string): NavigationItem[] {
    return navigation.map(item => ({
      ...item,
      isActive: this.isNavigationItemActive(item, currentPath),
      children: item.children 
        ? this.markActiveNavigation(item.children, currentPath)
        : undefined,
    }));
  }

  /**
   * Check if a navigation item should be marked as active
   */
  private isNavigationItemActive(item: NavigationItem, currentPath: string): boolean {
    if (item.url === currentPath) return true;
    if (item.slug && currentPath === `/${item.slug}`) return true;
    
    // Check if current path starts with item path (for parent items)
    if (item.url && currentPath.startsWith(item.url) && item.url !== '/') {
      return true;
    }
    
    return false;
  }
}

// Singleton instance
export const navigationService = new NavigationService();