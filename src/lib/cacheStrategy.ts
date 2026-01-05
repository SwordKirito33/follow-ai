/**
 * Cache Strategy Configuration
 * Defines caching policies for different asset types
 */

/**
 * HTTP Cache Headers Configuration
 */
export const cacheHeaders = {
  // HTML files - no cache, always check
  html: {
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'Pragma': 'no-cache',
  },

  // JavaScript and CSS - cache for 1 year (content hash in filename)
  assets: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },

  // Images - cache for 1 month
  images: {
    'Cache-Control': 'public, max-age=2592000, stale-while-revalidate=86400',
  },

  // API responses - cache for 5 minutes
  api: {
    'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
  },

  // Fonts - cache for 1 year
  fonts: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },

  // Default - cache for 1 hour
  default: {
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
  },
};

/**
 * Browser Cache Configuration
 */
export const browserCacheConfig = {
  // Enable service worker caching
  enableServiceWorker: true,

  // Cache strategies
  strategies: {
    // Cache first, fallback to network
    cacheFirst: ['images', 'fonts'],

    // Network first, fallback to cache
    networkFirst: ['api', 'html'],

    // Stale while revalidate
    staleWhileRevalidate: ['assets'],
  },

  // Cache expiration times (in seconds)
  expiration: {
    images: 2592000, // 30 days
    api: 300, // 5 minutes
    assets: 31536000, // 1 year
    fonts: 31536000, // 1 year
  },

  // Maximum cache size (in MB)
  maxSize: {
    total: 50,
    images: 30,
    api: 10,
    assets: 10,
  },
};

/**
 * CDN Configuration
 */
export const cdnConfig = {
  // CDN endpoints
  endpoints: {
    images: 'https://cdn.example.com/images/',
    assets: 'https://cdn.example.com/assets/',
    api: 'https://api.example.com/',
  },

  // Cache purge configuration
  purge: {
    enabled: true,
    // Purge cache on deployment
    onDeploy: true,
  },

  // Compression
  compression: {
    enabled: true,
    types: ['text/html', 'text/css', 'application/javascript', 'application/json'],
  },
};

/**
 * Get cache headers for a file type
 */
export function getCacheHeaders(filePath: string): Record<string, string> {
  if (filePath.endsWith('.html')) {
    return cacheHeaders.html;
  }
  if (filePath.match(/\.(js|css)$/)) {
    return cacheHeaders.assets;
  }
  if (filePath.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    return cacheHeaders.images;
  }
  if (filePath.match(/\.(woff|woff2|ttf|eot)$/)) {
    return cacheHeaders.fonts;
  }
  if (filePath.match(/^\/api\//)) {
    return cacheHeaders.api;
  }
  return cacheHeaders.default;
}

/**
 * Get cache strategy for a URL
 */
export function getCacheStrategy(url: string): 'cacheFirst' | 'networkFirst' | 'staleWhileRevalidate' {
  if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|woff|woff2|ttf|eot)$/)) {
    return 'cacheFirst';
  }
  if (url.match(/^\/api\//)) {
    return 'networkFirst';
  }
  return 'staleWhileRevalidate';
}

/**
 * Initialize cache headers
 * Should be called on server startup
 */
export function initializeCacheHeaders() {
  // Configure HTTP headers for different asset types
  // This should be done in your server configuration (e.g., Nginx, Apache, or CDN)

  console.log('Cache headers configured:');
  console.log('- HTML: no cache');
  console.log('- Assets (JS/CSS): 1 year');
  console.log('- Images: 30 days');
  console.log('- Fonts: 1 year');
  console.log('- API: 5 minutes');
}

export default {
  cacheHeaders,
  browserCacheConfig,
  cdnConfig,
  getCacheHeaders,
  getCacheStrategy,
  initializeCacheHeaders,
};
