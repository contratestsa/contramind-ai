import {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { Language, detectBrowserLanguage } from "@/utils/languageManager";

// Language context
const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  getDir: () => "rtl" | "ltr";
} | null>(null);

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a SimpleLanguageProvider");
  }
  return context;
};

interface SimpleLanguageProviderProps {
  children: ReactNode;
}

export function SimpleLanguageProvider({
  children,
}: SimpleLanguageProviderProps) {
  const defaultLanguage: Language = detectBrowserLanguage() || "ar";

  const [language, setLanguageState] = useState<Language>(defaultLanguage);

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
