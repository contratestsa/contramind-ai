import { ReactNode } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: ReactNode;
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body-large' | 'caption';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function Typography({ 
  children, 
  variant, 
  className = '', 
  as 
}: TypographyProps) {
  const { language } = useLanguage();
  const isArabic = language === 'ar';

  // Get the appropriate HTML element
  const Component = as || getDefaultElement(variant);

  // Get typography classes based on variant and language
  const typographyClasses = getTypographyClasses(variant, isArabic);

  return (
    <Component className={cn(typographyClasses, className)}>
      {children}
    </Component>
  );
}

function getDefaultElement(variant: string): keyof JSX.IntrinsicElements {
  switch (variant) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return variant as keyof JSX.IntrinsicElements;
    case 'body':
    case 'body-large':
    case 'caption':
      return 'p';
    default:
      return 'p';
  }
}

function getTypographyClasses(variant: string, isArabic: boolean): string {
  const baseClasses = 'leading-relaxed';
  
  if (isArabic) {
    // Arabic typography using Almarai for all purposes
    switch (variant) {
      case 'h1':
        return cn(baseClasses, 'font-arabic-heading-bold text-4xl lg:text-6xl');
      case 'h2':
        return cn(baseClasses, 'font-arabic-heading-bold text-3xl lg:text-5xl');
      case 'h3':
        return cn(baseClasses, 'font-arabic-heading-bold text-2xl lg:text-4xl');
      case 'h4':
        return cn(baseClasses, 'font-arabic-heading-bold text-xl lg:text-3xl');
      case 'h5':
        return cn(baseClasses, 'font-arabic-heading-bold text-lg lg:text-2xl');
      case 'h6':
        return cn(baseClasses, 'font-arabic-heading text-base lg:text-xl');
      case 'body-large':
        return cn(baseClasses, 'font-arabic-body text-lg');
      case 'body':
        return cn(baseClasses, 'font-arabic-body text-base');
      case 'caption':
        return cn(baseClasses, 'font-arabic-body text-sm');
      default:
        return cn(baseClasses, 'font-arabic-body text-base');
    }
  } else {
    // English typography using Space Grotesk for headings, Inter for body
    switch (variant) {
      case 'h1':
        return cn(baseClasses, 'font-heading-en-medium text-4xl lg:text-6xl');
      case 'h2':
        return cn(baseClasses, 'font-heading-en-medium text-3xl lg:text-5xl');
      case 'h3':
        return cn(baseClasses, 'font-heading-en-medium text-2xl lg:text-4xl');
      case 'h4':
        return cn(baseClasses, 'font-heading-en-medium text-xl lg:text-3xl');
      case 'h5':
        return cn(baseClasses, 'font-heading-en-medium text-lg lg:text-2xl');
      case 'h6':
        return cn(baseClasses, 'font-heading-en text-base lg:text-xl');
      case 'body-large':
        return cn(baseClasses, 'font-body-en text-lg');
      case 'body':
        return cn(baseClasses, 'font-body-en text-base');
      case 'caption':
        return cn(baseClasses, 'font-body-en text-sm');
      default:
        return cn(baseClasses, 'font-body-en text-base');
    }
  }
}