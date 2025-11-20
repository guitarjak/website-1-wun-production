/**
 * Simple in-memory cache with TTL support for server-side rendering.
 * Caches course structure (courses, modules, lessons) which doesn't change frequently.
 * Each Next.js request gets its own context, so this cache lives for the duration
 * of the request processing.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class SimpleCache {
  private store: Map<string, CacheEntry<unknown>> = new Map();

  /**
   * Get a cached value if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set a cached value with TTL in milliseconds
   */
  set<T>(key: string, data: T, ttlMs: number): void {
    const entry: CacheEntry<T> = {
      data,
      expiresAt: Date.now() + ttlMs,
    };
    this.store.set(key, entry);
  }

  /**
   * Clear a specific key
   */
  clear(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.store.clear();
  }

  keys(): string[] {
    return Array.from(this.store.keys());
  }
}

// Global cache instance (persists across requests in dev mode, but fresh in production)
let globalCache: SimpleCache | null = null;

/**
 * Get the global cache instance
 */
function getGlobalCache(): SimpleCache {
  if (!globalCache) {
    globalCache = new SimpleCache();
  }
  return globalCache;
}

/**
 * Cache wrapper for async functions
 * @param key - Cache key
 * @param ttlMs - Time to live in milliseconds
 * @param fn - Async function to execute
 * @returns Cached or fresh data
 */
export async function withCache<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>
): Promise<T> {
  const cache = getGlobalCache();

  // Try to get from cache
  const cached = cache.get<T>(key);
  if (cached !== null) {
    console.log(`[Cache HIT] ${key}`);
    return cached;
  }

  console.log(`[Cache MISS] ${key}`);

  // Cache miss - execute function
  const data = await fn();

  // Store in cache
  cache.set(key, data, ttlMs);

  return data;
}

/**
 * Clear cache for a specific pattern (e.g., 'course:*')
 */
export function clearCachePattern(pattern: string): void {
  const cache = getGlobalCache();
  const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');

  // Note: In real production, you'd want a more efficient implementation
  // For now, this is sufficient for small datasets
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.clear(key);
    }
  }
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
  const cache = getGlobalCache();
  cache.clearAll();
}

export const CACHE_TTL = {
  // Course structure (courses, modules, lessons) - changes infrequently
  COURSE_STRUCTURE: 1 * 60 * 60 * 1000, // 1 hour

  // User progress - changes frequently, shorter TTL
  USER_PROGRESS: 5 * 60 * 1000, // 5 minutes

  // Admin data - can be cached longer
  ADMIN_DATA: 30 * 60 * 1000, // 30 minutes
};
