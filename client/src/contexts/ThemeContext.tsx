import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Safely check localStorage (handle SSR or initial load)
    try {
      const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch (error) {
      // localStorage might be blocked or unavailable
      console.warn('Unable to access localStorage:', error);
    }
    
    // Check system preference
    try {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    } catch (error) {
      console.warn('Unable to check system preference:', error);
    }
    
    // Default to dark theme to match current implementation
    return 'dark';
  });

  useEffect(() => {
    // Add theme transitioning class to prevent flash
    document.documentElement.classList.add('theme-transitioning');
    
    // Update data-theme attribute
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save to localStorage (safely)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
      }
    } catch (error) {
      console.warn('Unable to save theme to localStorage:', error);
    }
    
    // Remove transitioning class after a frame
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('theme-transitioning');
    });
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}