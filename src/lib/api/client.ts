/**
 * Base API Client for Cognitor CMS
 */

import { config } from '../config';
import type { CognitorResponse, CognitorError } from '../types';

export class CognitorApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'CognitorApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

export class CognitorApiClient {
  private baseUrl: string;
  private _siteId: string;
  private apiKey?: string;
  private rateLimitTracker = new Map<string, number>();

  constructor() {
    this.baseUrl = config.cognitor.apiBaseUrl;
    this._siteId = config.cognitor.siteId;
    this.apiKey = config.cognitor.apiKey;
  }

  /**
   * Get the site ID
   */
  get siteId(): string {
    return this._siteId;
  }

  /**
   * Check rate limiting (simple implementation)
   */
  private checkRateLimit(endpoint: string): void {
    const now = Date.now();
    const lastRequest = this.rateLimitTracker.get(endpoint) || 0;
    const timeDiff = now - lastRequest;
    
    // Simple rate limiting: 1000ms between requests to same endpoint
    if (timeDiff < 1000) {
      console.warn(`Rate limit: waiting ${1000 - timeDiff}ms for endpoint ${endpoint}`);
      return; // Don't throw error, just warn and continue
    }
    
    this.rateLimitTracker.set(endpoint, now);
  }

  /**
   * Build full URL with site context
   */
  private buildUrl(endpoint: string): string {
    // Remove leading slash if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    

    
    // Handle different API patterns
    if (cleanEndpoint.startsWith('search/sites/')) {
      // Search API pattern: /search/sites/{site_id}/...
      const url = `${this.baseUrl}/${cleanEndpoint}`;

      return url;
    } else if (cleanEndpoint.startsWith('search/')) {
      // Legacy search pattern - convert to full path
      const searchPath = cleanEndpoint.replace('search/', '');
      const url = `${this.baseUrl}/search/sites/${this._siteId}/${searchPath}`;

      return url;
    } else if (cleanEndpoint.startsWith('public/')) {
      // Already has public prefix
      return `${this.baseUrl}/${cleanEndpoint}`;
    } else {
      // Default to public API for pages and elements
      return `${this.baseUrl}/public/${this._siteId}/${cleanEndpoint}`;
    }
  }

  /**
   * Get default headers
   */
  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  /**
   * Make HTTP request with error handling
   */
  private async request<T>(
    endpoint: string, 
    options: RequestOptions = {}
  ): Promise<CognitorResponse<T>> {
    this.checkRateLimit(endpoint);
    
    const url = this.buildUrl(endpoint);
    const {
      method = 'GET',
      headers: customHeaders = {},
      body,
      cache = 'default',
      next,
    } = options;

    const requestInit: RequestInit = {
      method,
      headers: this.getHeaders(customHeaders),
      cache,
    };

    // Add Next.js specific options
    if (next) {
      (requestInit as any).next = next;
    }

    if (body && method !== 'GET') {
      requestInit.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
      console.log(`🔗 API Request: ${method} ${url}`);
      console.log(`🔧 Config debug:`, {
        baseUrl: this.baseUrl,
        siteId: this._siteId,
        endpoint,
        builtUrl: url
      });
      
      if (config.isDevelopment) {
        console.log(`🔧 Request config:`, {
          headers: this.getHeaders(customHeaders),
          cache,
          next,
          siteId: this._siteId,
          apiKey: this.apiKey ? 'SET' : 'NOT SET'
        });
      }

      const response = await fetch(url, requestInit);
      
      if (!response.ok) {
        let errorData: CognitorError;
        
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            code: 'UNKNOWN_ERROR',
            message: `HTTP ${response.status}: ${response.statusText}`,
            statusCode: response.status,
          };
        }

        throw new CognitorApiError(
          response.status,
          errorData.code,
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errorData.details
        );
      }

      const rawData = await response.json();
      
      if (config.isDevelopment) {
        console.log(`✅ API Response: ${method} ${url}`, rawData);
      }

      // Transform raw API response to expected format
      let data: CognitorResponse<T>;
      
      if (Array.isArray(rawData)) {
        // Direct array response (like /pages endpoint)
        data = {
          success: true,
          data: { 
            items: rawData,
            total: rawData.length,
            page: 1,
            limit: rawData.length,
            pagination: {
              page: 1,
              limit: rawData.length,
              total: rawData.length,
              totalPages: 1,
              hasNext: false,
              hasPrev: false
            }
          } as T,
          message: 'Success'
        };
      } else if (rawData && typeof rawData === 'object' && 'data' in rawData) {
        // Already in CognitorResponse format
        data = rawData as CognitorResponse<T>;
      } else {
        // Single object or other format
        data = {
          success: true,
          data: rawData as T,
          message: 'Success'
        };
      }



      return data;
    } catch (error) {
      if (error instanceof CognitorApiError) {
        throw error;
      }

      // Network or other errors
      console.error('🔥 Network/API Error:', error);
      throw new CognitorApiError(
        0,
        'NETWORK_ERROR',
        error instanceof Error ? error.message : 'Unknown network error'
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string, 
    params?: Record<string, string | number | boolean>,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<CognitorResponse<T>> {
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    return this.request<T>(url, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string, 
    body?: any,
    options?: Omit<RequestOptions, 'method'>
  ): Promise<CognitorResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string, 
    body?: any,
    options?: Omit<RequestOptions, 'method'>
  ): Promise<CognitorResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<CognitorResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('health');
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const cognitorApi = new CognitorApiClient();