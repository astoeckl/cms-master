/**
 * Theme Loader - Loads and applies site-specific themes
 */

import type { Theme } from '@/lib/types';

/**
 * Load theme configuration for a site
 */
export async function loadTheme(siteId: string, fallbackTheme = 'default'): Promise<Theme | null> {
  try {
    // Try to load site-specific theme
    const theme = await loadSiteTheme(siteId);
    if (theme) {
      return theme;
    }

    // Fallback to default theme
    if (fallbackTheme !== siteId) {
      return await loadDefaultTheme(fallbackTheme);
    }

    return null;
  } catch (error) {
    console.error(`Failed to load theme for site: ${siteId}`, error);
    
    // Try fallback theme
    if (fallbackTheme !== siteId) {
      try {
        return await loadDefaultTheme(fallbackTheme);
      } catch (fallbackError) {
        console.error('Failed to load fallback theme:', fallbackError);
      }
    }
    
    return null;
  }
}

/**
 * Load site-specific theme
 */
async function loadSiteTheme(siteId: string): Promise<Theme | null> {
  try {
    // First, try to load from local file system (for custom themes)
    const response = await fetch(`/themes/${siteId}.json`);
    
    if (response.ok) {
      const themeData = await response.json();
      return validateTheme(themeData);
    }

    // If not found locally, you could also try to load from CMS API
    // const cmsTheme = await loadThemeFromCMS(siteId);
    // if (cmsTheme) return cmsTheme;

    return null;
  } catch (error) {
    console.warn(`Site theme not found: ${siteId}`, error);
    return null;
  }
}

/**
 * Load default theme
 */
async function loadDefaultTheme(themeName: string): Promise<Theme | null> {
  try {
    const response = await fetch(`/themes/${themeName}.json`);
    
    if (response.ok) {
      const themeData = await response.json();
      return validateTheme(themeData);
    }

    // If no custom theme file, return built-in default
    return getBuiltInDefaultTheme();
  } catch (error) {
    console.warn(`Default theme not found: ${themeName}`, error);
    return getBuiltInDefaultTheme();
  }
}

/**
 * Validate theme structure
 */
function validateTheme(themeData: any): Theme | null {
  try {
    // Basic validation - ensure required properties exist
    if (!themeData.id || !themeData.name || !themeData.colors) {
      console.error('Invalid theme structure:', themeData);
      return null;
    }

    // Ensure all required color properties exist
    const requiredColors = [
      'primary', 'secondary', 'background', 'foreground',
      'muted', 'accent', 'destructive', 'border', 'input', 'ring'
    ];

    for (const color of requiredColors) {
      if (!themeData.colors[color]) {
        console.error(`Missing required color: ${color}`, themeData);
        return null;
      }
    }

    return themeData as Theme;
  } catch (error) {
    console.error('Theme validation error:', error);
    return null;
  }
}

/**
 * Get built-in default theme
 */
function getBuiltInDefaultTheme(): Theme {
  return {
    id: 'default',
    name: 'Default Theme',
    colors: {
      primary: 'hsl(222.2 84% 4.9%)',
      secondary: 'hsl(210 40% 96%)',
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      muted: 'hsl(210 40% 96%)',
      accent: 'hsl(210 40% 96%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      input: 'hsl(214.3 31.8% 91.4%)',
      ring: 'hsl(222.2 84% 4.9%)',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
      },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
      '4xl': '6rem',
    },
  };
}

/**
 * Apply theme to DOM
 */
export function applyTheme(theme: Theme): void {
  try {
    const root = document.documentElement;

    // Apply CSS custom properties for colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Apply typography
    if (theme.typography) {
      root.style.setProperty('--font-family', theme.typography.fontFamily);
      
      // Apply font sizes
      Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
        root.style.setProperty(`--font-size-${key}`, value);
      });

      // Apply font weights
      Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
        root.style.setProperty(`--font-weight-${key}`, value);
      });

      // Apply line heights
      Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
        root.style.setProperty(`--line-height-${key}`, value);
      });
    }

    // Apply spacing
    if (theme.spacing) {
      Object.entries(theme.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value);
      });
    }

    // Apply custom CSS if provided
    if (theme.customCss) {
      applyCustomCSS(theme.customCss);
    }

    // Set data attribute for theme-specific styling
    root.setAttribute('data-theme', theme.id);

    console.log(`Theme applied: ${theme.name} (${theme.id})`);
  } catch (error) {
    console.error('Failed to apply theme:', error);
  }
}

/**
 * Apply custom CSS
 */
function applyCustomCSS(customCss: string): void {
  try {
    // Remove existing custom theme styles
    const existingStyle = document.getElementById('custom-theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style element
    const styleElement = document.createElement('style');
    styleElement.id = 'custom-theme-styles';
    styleElement.textContent = customCss;
    
    // Append to head
    document.head.appendChild(styleElement);
  } catch (error) {
    console.error('Failed to apply custom CSS:', error);
  }
}

/**
 * Remove theme styles
 */
export function removeTheme(): void {
  try {
    const root = document.documentElement;

    // Remove theme data attribute
    root.removeAttribute('data-theme');

    // Remove custom styles
    const customStyles = document.getElementById('custom-theme-styles');
    if (customStyles) {
      customStyles.remove();
    }

    // Note: We don't remove CSS custom properties as they fall back to defaults
    console.log('Theme styles removed');
  } catch (error) {
    console.error('Failed to remove theme:', error);
  }
}