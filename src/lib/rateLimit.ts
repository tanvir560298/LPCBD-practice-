// Rate limiting helper for LPC public & portal endpoints
// Enforces sliding window request throttling to defend against brute force, form spam & automated abuse

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Checks if a given key (e.g. client IP + route identifier) has exceeded the allowable request count.
 * @param key Unique key for client/route
 * @param limit Maximum allowed requests within the window
 * @param windowMs Time window in milliseconds (default: 60,000ms = 1 minute)
 */
export function checkRateLimit(
  key: string,
  limit: number = 30,
  windowMs: number = 60_000
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - windowMs;

  const record = rateLimitStore.get(key) || { timestamps: [] };

  // Retain only timestamps within the sliding window
  const recentTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (recentTimestamps.length >= limit) {
    const oldestTimestamp = recentTimestamps[0];
    const resetAt = oldestTimestamp + windowMs;
    return {
      allowed: false,
      remaining: 0,
      resetAt,
    };
  }

  // Record this request
  recentTimestamps.push(now);
  rateLimitStore.set(key, { timestamps: recentTimestamps });

  return {
    allowed: true,
    remaining: limit - recentTimestamps.length,
    resetAt: now + windowMs,
  };
}

/**
 * Reset all rate limit counters (useful in unit tests)
 */
export function resetRateLimits(): void {
  rateLimitStore.clear();
}

