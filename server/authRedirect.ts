// Authentication redirect handler for multiple domains
export function getPreferredDomain(req: any): string {
  // Check if we have a custom domain
  const customDomain = 'contramind.ai';
  const replitDomain = 'ai-language-bridge-ceo-ContraMind.replit.app';
  
  // Get the host from the request
  const host = req.get('host');
  
  // If accessing from custom domain, use that
  if (host?.includes(customDomain)) {
    return `https://${customDomain}`;
  }
  
  // If accessing from Replit domain, use that
  if (host?.includes(replitDomain)) {
    return `https://${replitDomain}`;
  }
  
  // In development
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