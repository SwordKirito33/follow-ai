/**
 * API Client with rate limiting
 */

// Simple client-side rate limiter
interface RateLimiterOptions {
  windowMs: number;
  max: number;
  message: string;
}

function createRateLimiter(options: RateLimiterOptions) {
  const requests = new Map<string, number[]>();
  
  return (req: { ip: string }) => {
    const now = Date.now();
    const key = req.ip;
    
    // Get existing requests for this key
    const userRequests = requests.get(key) || [];
    
    // Filter out old requests outside the window
    const recentRequests = userRequests.filter(
      (timestamp) => now - timestamp < options.windowMs
    );
    
    // Check if limit exceeded
    if (recentRequests.length >= options.max) {
      return false;
    }
    
    // Add current request
    recentRequests.push(now);
    requests.set(key, recentRequests);
    
    return true;
  };
}

// Create rate limiters for different API types
const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many API requests, please try again later',
});

const readLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 200, // 200 read requests per minute
  message: 'Too many read requests, please try again later',
});

const writeLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 50, // 50 write requests per minute
  message: 'Too many write requests, please try again later',
});

/**
 * Rate-limited fetch wrapper
 */
export async function rateLimitedFetch(
  url: string,
  options?: RequestInit,
  limiter = apiLimiter
): Promise<Response> {
  // Check rate limit
  const allowed = limiter({ ip: 'client' });
  
  if (!allowed) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  // Make the request
  return fetch(url, options);
}

/**
 * Rate-limited GET request
 */
export async function get<T>(url: string): Promise<T> {
  const response = await rateLimitedFetch(url, { method: 'GET' }, readLimiter);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Rate-limited POST request
 */
export async function post<T>(url: string, data: unknown): Promise<T> {
  const response = await rateLimitedFetch(
    url,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    writeLimiter
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Rate-limited PUT request
 */
export async function put<T>(url: string, data: unknown): Promise<T> {
  const response = await rateLimitedFetch(
    url,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    writeLimiter
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Rate-limited DELETE request
 */
export async function del<T>(url: string): Promise<T> {
  const response = await rateLimitedFetch(
    url,
    { method: 'DELETE' },
    writeLimiter
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

/**
 * API client with rate limiting
 */
export const apiClient = {
  get,
  post,
  put,
  delete: del,
  fetch: rateLimitedFetch,
};
