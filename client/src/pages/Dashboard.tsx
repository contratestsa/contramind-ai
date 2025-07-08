// This file is intentionally empty
// Dashboard has been removed - users should see ComingSoonSimple instead
// If you're seeing this file, please redirect to /coming-soon

import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Immediately redirect to coming soon page
    setLocation('/coming-soon');
  }, [setLocation]);
  
  return null;
}