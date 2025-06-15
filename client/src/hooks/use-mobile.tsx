const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Simple mobile detection without useState
  return window.innerWidth < MOBILE_BREAKPOINT
}
