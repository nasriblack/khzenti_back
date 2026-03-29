import { Request } from 'express';

/**
 * Extract the real IP address from request
 * Handles proxy headers (X-Forwarded-For, X-Real-IP)
 */
export const getClientIp = (req: Request): string => {
  // Check X-Forwarded-For header (can contain multiple IPs)
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    const ips = Array.isArray(forwardedFor) 
      ? forwardedFor[0] 
      : forwardedFor.split(',')[0];
    return ips.trim();
  }

  // Check X-Real-IP header
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] : realIp;
  }

  // Fallback to socket address
  return req.socket.remoteAddress || 'unknown';
};

/**
 * Normalize IP address (remove IPv6 prefix if present)
 */
export const normalizeIp = (ip: string): string => {
  // Remove IPv6 to IPv4 mapping prefix
  if (ip.startsWith('::ffff:')) {
    return ip.substring(7);
  }
  return ip;
};
