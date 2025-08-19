export type Language = "ar" | "en";

// Detect browser language on initial load
export const detectBrowserLanguage = (): Language => {
  if (typeof window === "undefined") return "ar";

  try {
    // Check localStorage first for user preference
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage === "ar" || savedLanguage === "en") {
      return savedLanguage as Language;
    }

    // Detect from browser language
    const browserLanguage =
      navigator.language || navigator.languages?.[0] || "en";

    // Check if browser language is Arabic
    if (browserLanguage.startsWith("ar")) {
      return "ar";
    }

    // Default to English for all other languages
    return "en";
  } catch {
    return "ar";
  }
};

// Global language manager for non-React contexts
export const LanguageManager = {
  getLanguage: (): Language => {
    if (typeof window === "undefined") return "ar";
    try {
      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage === "ar" || savedLanguage === "en") {
        return savedLanguage as Language;
      }
      return detectBrowserLanguage();
    } catch {
      return "ar";
    }
  },

  setLanguage: (lang: Language) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("language", lang);
        document.documentElement.setAttribute(
          "dir",
          lang === "ar" ? "rtl" : "ltr",
        );
        document.documentElement.setAttribute("lang", lang);
        document.documentElement.setAttribute("data-language", lang);

        // Force page reload for complete language switch
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } catch {}
    }
  },

  t: (ar: string, en: string) => {
    const currentLang = LanguageManager?.getLanguage();
    return currentLang === "ar" ? ar : en;
  },

  getDir: (): "rtl" | "ltr" => {
    const currentLang = LanguageManager?.getLanguage();
    return currentLang === "ar" ? "rtl" : "ltr";
  },
};