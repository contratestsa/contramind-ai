import {
  useEffect,
  useState,
  createContext,
  useCallback,
  useMemo,
  useContext,
  type ReactNode,
} from "react";
import { Language, detectBrowserLanguage } from "@/utils/languageManager";

// Language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  getDir: () => "rtl" | "ltr";
}

// Export the context for use in hooks
export const LanguageContext = createContext<LanguageContextType | null>(null);

interface SimpleLanguageProviderProps {
  children: ReactNode;
}

export function SimpleLanguageProvider({
  children,
}: SimpleLanguageProviderProps) {
  // Initialize language state with a lazy initializer to avoid SSR issues
  const [language, setLanguageState] = useState<Language>(() => {
    // Only call detectBrowserLanguage during initialization, not on every render
    if (typeof window === "undefined") return "ar";
    try {
      return detectBrowserLanguage() || "ar";
    } catch (error) {
      console.warn("Error detecting browser language:", error);
      return "ar";
    }
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("data-language", lang);

    // Force page reload for complete language switch
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, []);

  const t = useCallback(
    (ar: string, en: string) => {
      return language === "ar" ? ar : en;
    },
    [language],
  );

  const getDir = useCallback((): "rtl" | "ltr" => {
    return language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    // Set initial document attributes
    const dir = getDir();
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute("data-language", language);
  }, [language, getDir]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      getDir,
    }),
    [language, setLanguage, t, getDir],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Export hook to use the language context
export function useSimpleLanguageContext() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      "useSimpleLanguageContext must be used within a SimpleLanguageProvider"
    );
  }
  return context;
}
