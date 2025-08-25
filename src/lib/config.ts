/**
 * Environment configuration for Cognitor CMS Master Application
 */

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getSiteId(): string {
  // Try server-side first, then client-side
  return process.env.COGNITOR_SITE_ID || 
         process.env.NEXT_PUBLIC_COGNITOR_SITE_ID || 
         'default';
}

function getApiBaseUrl(): string {
  // Try server-side first, then client-side, then default
  return process.env.COGNITOR_API_BASE_URL || 
         process.env.NEXT_PUBLIC_COGNITOR_API_BASE_URL || 
         'https://backend.cognitor.dev';
}

export const config = {
  // Cognitor API Configuration
  cognitor: {
    siteId: getSiteId(),
    apiBaseUrl: getApiBaseUrl(),
    apiKey: process.env.COGNITOR_API_KEY, // Optional
  },
  
  // Application Configuration
  app: {
    siteUrl: getEnvVar('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000'),
    siteName: getEnvVar('NEXT_PUBLIC_SITE_NAME', 'Cognitor CMS Master'),
    defaultTheme: getEnvVar('NEXT_PUBLIC_DEFAULT_THEME', 'default'),
  },
  
  // Development flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

export type Config = typeof config;