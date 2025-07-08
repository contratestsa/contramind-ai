// Authentication redirect handler for multiple domains
export function getPreferredDomain(req: any): string {
  // For OAuth redirects, always use the current host to avoid cross-domain issues
  const host = req.get('host');
  const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
  
  // If we have a host, use it
  if (host) {
    console.log('Using host for redirect:', host);
    return `${protocol}://${host}`;
  }
  
  // Fallback to environment variables
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  }
  
  // Fallback to localhost
  return 'http://localhost:5000';
}

export function ensureSameDomain(req: any, res: any, next: any) {
  // Skip for API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  const preferredDomain = getPreferredDomain(req);
  const currentUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const preferredUrl = `${preferredDomain}${req.originalUrl}`;
  
  // If not on preferred domain, redirect
  if (!currentUrl.startsWith(preferredDomain)) {
    return res.redirect(301, preferredUrl);
  }
  
  next();
}