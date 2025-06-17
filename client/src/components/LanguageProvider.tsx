import React from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = React.createContext<LanguageContextType>({
  language: 'ar',
  setLanguage: () => {},
  t: (ar: string, en: string) => ar,
  dir: 'rtl'
});

interface LanguageProviderProps {
  children: React.ReactNode;
}

export class LanguageProvider extends React.Component<LanguageProviderProps, { language: Language }> {
  constructor(props: LanguageProviderProps) {
    super(props);
    this.state = {
      language: 'ar'
    };
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
  }

  setLanguage = (language: Language) => {
    this.setState({ language });
  }

  t = (ar: string, en: string): string => {
    return this.state.language === 'ar' ? ar : en;
  }

  render() {
    const dir = this.state.language === 'ar' ? 'rtl' : 'ltr';
    
    const contextValue: LanguageContextType = {
      language: this.state.language,
      setLanguage: this.setLanguage,
      t: this.t,
      dir
    };

    return (
      <LanguageContext.Provider value={contextValue}>
        {this.props.children}
      </LanguageContext.Provider>
    );
  }
}

export { LanguageContext };