import { useLanguage } from './useLanguage';

export interface TypographyClasses {
  heading: string;
  headingMedium: string;
  body: string;
  bodySemiBold: string;
}

export function useTypography(): TypographyClasses {
  const { language } = useLanguage();

  if (language === 'ar') {
    return {
      heading: 'font-arabic-regular',
      headingMedium: 'font-arabic-bold',
      body: 'font-arabic-regular',
      bodySemiBold: 'font-arabic-bold',
    };
  }

  return {
    heading: 'font-heading-en',
    headingMedium: 'font-heading-en-medium',
    body: 'font-body-en',
    bodySemiBold: 'font-body-en-semibold',
  };
}

// Utility function to get typography class based on element type and language
export function getTypographyClass(
  element: 'heading' | 'heading-medium' | 'body' | 'body-semibold',
  language: 'ar' | 'en'
): string {
  const isArabic = language === 'ar';

  switch (element) {
    case 'heading':
      return isArabic ? 'font-arabic-regular' : 'font-heading-en';
    case 'heading-medium':
      return isArabic ? 'font-arabic-bold' : 'font-heading-en-medium';
    case 'body':
      return isArabic ? 'font-arabic-regular' : 'font-body-en';
    case 'body-semibold':
      return isArabic ? 'font-arabic-bold' : 'font-body-en-semibold';
    default:
      return isArabic ? 'font-arabic-regular' : 'font-body-en';
  }
}