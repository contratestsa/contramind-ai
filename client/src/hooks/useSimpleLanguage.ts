import { LanguageManager, type Language } from '@/components/SimpleLanguage';

export type { Language };

// Force refresh components when language changes
let refreshTrigger = 0;
const componentInstances = new Set<() => void>();

LanguageManager.subscribe(() => {
  refreshTrigger++;
  // Force re-render all components using this hook
  componentInstances.forEach(refresh => {
    try {
      refresh();
    } catch (e) {
      // Ignore refresh errors
    }
  });
});

export function useSimpleLanguage() {
  // Force re-render function (dummy state to trigger updates)
  const forceUpdate = () => {
    // This will be called when language changes
  };
  
  // Register this component for updates
  if (typeof window !== 'undefined') {
    componentInstances.add(forceUpdate);
  }
  
  const setLanguage = (lang: Language) => {
    LanguageManager.setLanguage(lang);
    // Force immediate re-render by dispatching a custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
    }
  };
  
  const t = (ar: string, en: string) => {
    return LanguageManager.t(ar, en);
  };
  
  return { 
    language: LanguageManager.getLanguage(), 
    setLanguage, 
    t, 
    dir: LanguageManager.getDir() 
  };
}