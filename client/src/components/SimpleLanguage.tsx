import * as React from 'react';

export type Language = 'ar' | 'en';

interface SimpleLanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  dir: 'rtl' | 'ltr';
}

export const SimpleLanguageContext = React.createContext<SimpleLanguageContextType>({
  language: 'ar',
  setLanguage: () => {},
  t: (ar: string, en: string) => ar,
  dir: 'rtl'
});

interface SimpleLanguageProviderProps {
  children: React.ReactNode;
}

export class SimpleLanguageProvider extends React.Component<SimpleLanguageProviderProps, { language: Language }> {
  constructor(props: SimpleLanguageProviderProps) {
    super(props);
    
    // Detect browser language
    const detectBrowserLanguage = (): Language => {
      // Check localStorage first for user preference
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage === 'ar' || savedLanguage === 'en') {
        return savedLanguage as Language;
      }
      
      // Detect from browser language
      const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
      
      // Check if browser language is Arabic
      if (browserLanguage.startsWith('ar')) {
        return 'ar';
      }
      
      // Default to English for all other languages
      return 'en';
    };
    
    this.state = { language: detectBrowserLanguage() };
  }

  componentDidMount() {
    this.updateDocument();
  }

  componentDidUpdate() {
    this.updateDocument();
  }

  updateDocument = () => {
    const dir = this.state.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', this.state.language);
  };

  setLanguage = (language: Language) => {
    this.setState({ language });
    localStorage.setItem('language', language);
  };

  t = (ar: string, en: string): string => {
    return this.state.language === 'ar' ? ar : en;
  };

  render() {
    const dir: 'rtl' | 'ltr' = this.state.language === 'ar' ? 'rtl' : 'ltr';
    
    const contextValue: SimpleLanguageContextType = {
      language: this.state.language,
      setLanguage: this.setLanguage,
      t: this.t,
      dir
    };

    return (
      <SimpleLanguageContext.Provider value={contextValue}>
        {this.props.children}
      </SimpleLanguageContext.Provider>
    );
  }
}